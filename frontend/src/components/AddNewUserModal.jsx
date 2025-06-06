import React, { useState, useRef } from 'react';
import { validateEmail } from '../utils/helper';
import Input from './Inputs/Input';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';

const AddNewUserModal = ({ onClose, onRefresh }) => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const modalRef = useRef(null);

    const handleAddNew = async (e) => {
        e.preventDefault();

        let profileImageUrl = '';

        if (!fullName) {
            setError("Please enter full name.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Please enter the password");
            return;
        }
        setError("");

        try {
            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || "";
            }
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                name: fullName,
                email,
                password,
                profileImageUrl,
            });

            if (response) {
                toast.success("Member added successfully");
                onClose();
                onRefresh();
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
                toast.error(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
                toast.error("Something went wrong. Please try again.");
            }
        }
    };

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    return (
        <div
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black/20 bg-opacity-50"
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow-sm dark:bg-gray-700"
            >
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Add New Member
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                    >
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                    </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                            label="Full Name"
                            placeholder="John"
                            type="text"
                        />
                        <Input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            label="Email Address"
                            placeholder="john@example.com"
                            type="text"
                        />
                        <Input
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                            label="Password"
                            placeholder="Min 8 Characters"
                            type="password"
                        />
                    </div>
                    {error && <p className="text-xs font-medium text-red-500 mt-5">{error}</p>}
                    <div className="flex justify-end mt-7 space-x-4">
                        <button
                            type="button"
                            className="cancel-btn bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md py-2 px-4 "
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="add-btn bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 px-4 "
                            onClick={handleAddNew}
                        >
                            Add New Member
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewUserModal;
