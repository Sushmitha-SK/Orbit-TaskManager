const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileImageUrl: { type: String, default: "" },
        role: { type: String, enum: ["admin", "member"], default: "member" },

        // Password reset functionality
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpire: { type: Date, default: null },

        // Optional fields for enhanced user management
        isVerified: { type: Boolean, default: false }, // For email verification
        lastLogin: { type: Date, default: null }, // To track user activity
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
