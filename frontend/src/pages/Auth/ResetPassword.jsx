import React, { useState } from 'react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axiosInstance.post(`${API_PATHS.AUTH.RESET_PASSWORD}/${resetToken}`, { password });
            setMessage("Your password has been reset. You can now log in.");
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setError("Failed to reset password. Please try again.");
        }
    };

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">
                    Reset Password
                </h3>
                <form onSubmit={handleResetPassword}>
                    <Input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        label="New Password"
                        placeholder="Min 8 Characters"
                        type="password"
                    />
                    <Input
                        value={confirmPassword}
                        onChange={({ target }) => setConfirmPassword(target.value)}
                        label="Confirm Password"
                        placeholder="Repeat your new password"
                        type="password"
                    />
                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
                    {message && <p className='text-green-500 text-xs pb-2.5'>{message}</p>}
                    <button type='submit' className='btn-primary'>
                        Reset Password
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;
