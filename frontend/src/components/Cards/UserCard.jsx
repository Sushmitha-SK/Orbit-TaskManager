import React, { useState } from 'react'
import StatCard from './StatCard'
import defaultImage from '../../assets/images/user.png'
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { VscVerified } from "react-icons/vsc";
import Modal from '../Modal';

const UserCard = ({ userInfo, onUserVerified }) => {
    const [profileImage, setProfileImage] = useState(userInfo?.profileImageUrl || defaultImage);
    const [isVerified, setIsVerified] = useState(userInfo?.isVerified);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const verifyUser = async () => {
        try {
            const response = await axiosInstance.put(
                API_PATHS.AUTH.VERIFY_USER(userInfo._id)
            );
            console.log('userinfo response', JSON.stringify(response));
            setIsVerified(true);
            onUserVerified();
            toast.success("User Verified Successfully");
        } catch (error) {
            console.error("Error verifying member", error);
            toast.error(error.response?.data?.message || "Failed to verify member.");
        }
    };

    const handleVerifyClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmVerify = () => {
        setIsModalOpen(false);
        verifyUser();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='user-card p-2'>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={profileImage}
                        alt={`Avatar`}
                        className='w-12 h-12 rounded-full border-2 border-white'
                        onError={() => setProfileImage(defaultImage)}
                    />

                    <div>
                        <p className="text-sm font-medium">{userInfo?.name}</p>
                        <p className="text-xs text-gray-500">{userInfo?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                            {isVerified ? (
                                <FaCheckCircle className="text-green-500" />
                            ) : (
                                <FaTimesCircle className="text-red-500" />
                            )}
                            <p className={`text-xs ${isVerified ? "text-green-500" : "text-red-500"}`}>
                                {isVerified ? "Verified" : "Not Verified"}
                            </p>
                        </div>
                    </div>
                </div>
                {!isVerified && (
                    <button
                        onClick={handleVerifyClick}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-display text-white bg-[#f8c838] rounded-sm hover:bg-[#FFC107] cursor-pointer">
                        <VscVerified /> Verify Now
                    </button>
                )}
            </div>

            <div className="flex items-end gap-3 mt-5">
                <StatCard
                    label="Pending"
                    count={userInfo?.pendingTasks || 0}
                    status="Pending"
                />
                <StatCard
                    label="In Progress"
                    count={userInfo?.inProgressTasks || 0}
                    status="In Progress"
                />
                <StatCard
                    label="Completed"
                    count={userInfo?.completedTasks || 0}
                    status="Completed"
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Confirm Verification"
            >
                <p className='text-xs'>Are you sure you want to verify this user?</p>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmVerify}
                        className="px-4 py-2 text-xs text-white bg-green-500 rounded-md hover:bg-green-600">
                        Yes, Verify
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default UserCard;
