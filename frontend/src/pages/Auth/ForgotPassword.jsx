import React, { useState } from 'react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { ClipLoader } from 'react-spinners';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
            setMessage("If this email is registered, you will receive a password reset link.");
        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">
                    Forgot Password
                </h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                <form onSubmit={handleForgotPassword}>
                    <Input
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        label="Email Address"
                        placeholder="john@example.com"
                        type="email"
                    />
                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
                    {message && <p className='text-green-500 text-xs pb-2.5'>{message}</p>}
                    <button
                        type='submit'
                        className='btn-authentication flex items-center justify-center'
                        disabled={isLoading} 
                    >
                        {isLoading ? (
                            <>
                                <ClipLoader size={16} color={"#ffffff"} />
                                <span className="ml-2">Sending Reset Link</span>
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
