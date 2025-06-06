import React, { useEffect, useState } from 'react'
import ProfilePhotoSelector from './Inputs/ProfilePhotoSelector';
import axiosInstance from './../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { toast } from 'react-hot-toast';
import uploadImage from '../utils/uploadImage';

const EditProfileModal = ({ isOpen, onClose, title, userDetails, onProfileUpdate }) => {
    if (!isOpen) return;

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [userData, setUserData] = useState({
        name: '',
        profileImageUrl: ''
    })

    const handleValueChange = (key, value) => {
        setUserData((prevData) => ({ ...prevData, [key]: value }));
    };

    useEffect(() => {
        if (userDetails) {
            setUserData({
                name: userDetails.name || '',
                profileImageUrl: userDetails.profileImageUrl || '',
            });
            setProfilePic(null);
        }
    }, [userDetails, isOpen]);

    const handleSubmit = async () => {
        setError(null);

        if (!userData.name.trim()) {
            setError("User Full Name is required.");
            return;
        }

        if (!profilePic && !userDetails.profileImageUrl) {
            setError("Profile picture is required.");
            return;
        }

        setLoading(true);

        try {
            let profileImageUrl = userData.profileImageUrl;

            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl;
            }

            if (
                userData.name !== userDetails.name ||
                profileImageUrl !== userDetails.profileImageUrl
            ) {
                await axiosInstance.put(API_PATHS.USERS.UPDATE_USER_PROFILE, {
                    ...userData,
                    profileImageUrl,
                });

                toast.success("User Profile Updated Successfully");
                onProfileUpdate({ ...userData, profileImageUrl });
            }

            onClose();
        } catch (error) {
            console.error("Error updating profile", error);
            setError("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    if (!isOpen) return null;

    return (

        <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center
        w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center
                            dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
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
                        <div>
                            <label className="text-xs font-medium text-slate-600">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter your name"
                                value={userData.name}
                                onChange={({ target }) => handleValueChange("name", target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-600">
                                Profile Picture
                            </label>
                            <ProfilePhotoSelector
                                image={profilePic || userData.profileImageUrl}
                                setImage={setProfilePic}
                                canDelete={!!(profilePic || userData.profileImageUrl)}
                            />
                        </div>
                        {error && (
                            <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
                        )}
                        <div className="flex justify-end mt-7">
                            <button
                                className="cancel-btn"
                                onClick={onClose}
                                disabled={false}
                            >
                                Cancel
                            </button>
                            <button
                                className="add-btn ml-4"
                                onClick={handleSubmit}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfileModal