const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

//Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

//@desc Register a new user
//@route POST /api/auth/register
//@access Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } =
            req.body;

        //Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        //Determine user role: Admin if correct token is provided, otehrwise Member
        let role = "member";
        if (
            adminInviteToken &&
            adminInviteToken == process.env.ADMIN_INVITE_TOKEN
        ) {
            role = "admin";
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create new user
        const user = await User.create({
            name, email, password: hashedPassword,
            profileImageUrl,
            role,
        });

        //Return user data with JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
};

//@desc Login user
//@route POST /api/auth/login
//@access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Update lastLogin field
        user.lastLogin = Date.now();
        await user.save();

        // Return user data with JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//@desc Get user profile
//@route GET /api/auth/profile
//@access Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
};

//@desc Update user profile
//@route PUT /api/auth/profile
//@access Private (Requires JWT)

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.profileImageUrl = req.body.profileImageUrl || user.profileImageUrl;

        // Update password if provided
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        // Save the updated user
        const updatedUser = await user.save();

        // Return updated user details, including profileImageUrl
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImageUrl: updatedUser.profileImageUrl,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Forgot Password
//@route POST /api/auth/forgot-password
//@access Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send email
        const resetUrl = `https://orbit-task-manager.vercel.app/resetpassword/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="font-family: 'Poppins', sans-serif; font-size: 1.5rem; font-weight: 800; display: flex; flex-wrap: wrap; margin-bottom: 20px;">
                    <span style="color: #333;">Orbit</span>
                    <span style="color: #1368EC;">.</span>
                </h1>
                <h2 style="color: #1368EC;">Reset Your Password</h2>
                <p>Dear ${user.name || "User"},</p>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}" style="color: #1368EC; text-decoration: none;">Reset Password</a>
                <p>This link is valid for the next <strong>10 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
                <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;" />
                <p style="font-size: 14px; color: #888;">Best regards,</p>
                <p style="font-size: 14px; color: #888;">The Orbit Team</p>
            </div>
        `;

        await transporter.sendMail({
            from: `"Orbit Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset",
            html: htmlContent,
        });

        res.json({ message: "Password reset email sent" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Reset Password
//@route POST /api/auth/reset-password
//@access Public

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Hash the provided token
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Find user by hashed token and ensure token hasn't expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // Save updated user
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Change Password
//@route PUT /api/auth/change-password
//@access Public
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Find the user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Update to the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//@desc Verify a user
//@route PUT /api/admin/verify-user/:id
//@access Private (Admin only)
const verifyUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's verification status
        user.isVerified = true;
        await user.save();

        res.json({
            message: `User with ID ${userId} has been verified successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword, changePassword, verifyUser }