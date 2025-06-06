import React from 'react'
import { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import EditProfileModal from '../../components/EditProfileModal';
import moment from 'moment';
import DashboardLayout from '../../components/layout/DashboardLayout';
import userImg from '../../assets/images/user.png';
import { SyncLoader } from 'react-spinners';
import { MdUpdate, MdCheckCircle, MdCancel } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsPersonFill } from "react-icons/bs";


const AdminProfile = () => {
    const { user, updateUser, loading } = useContext(UserContext);
    const [openEditModal, setOpenEditModal] = useState(false);

    const handleOpenEditModal = () => setOpenEditModal(true);

    const handleProfileUpdate = (updatedUser) => {
        if (updateUser) updateUser(updatedUser);
        setOpenEditModal(false);
    };


    if (loading) {
        return (
            <DashboardLayout activeMenu="My Profile">
                <div className="my-5 flex justify-center text-gray-500" role="status" aria-live="polite" aria-label="Loading user profile">
                    <SyncLoader size={8} color="#1368EC" />
                </div>
            </DashboardLayout>
        );
    }



    return (
        <DashboardLayout activeMenu="My Profile">
            <main className="my-5 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <h2 className="text-xl md:text-xl font-medium dark:text-white">My Profile</h2>
                    <button
                        onClick={handleOpenEditModal}
                        className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-white text-sm font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-2 transition"
                        aria-label="Edit Profile"
                    >
                        Edit Profile
                    </button>
                </header>

                {user ? (
                    <>
                        <section
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700 p-8 shadow-sm"
                            aria-labelledby="profile-heading"
                        >


                            <div className="flex flex-col items-center sm:flex-row sm:items-center space-y-6 sm:space-y-0 sm:space-x-8 max-w-full">
                                <img
                                    src={user.profileImageUrl || userImg}
                                    alt={`${user.name}'s profile`}
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-md flex-shrink-0"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = userImg;
                                    }}
                                />
                                <div className="flex-1 min-w-0 w-full flex flex-col items-center sm:items-start">
                                    <h3 className="text-lg sm:text-xl  dark:text-gray-100 truncate text-gray-950 font-medium ">{user.name}</h3>
                                    <p className="mt-1 dark:text-gray-400 truncate sm:text-sm text-[12px] text-gray-500">{user.email}</p>
                                    <span className="inline-block mt-2 rounded-full bg-primary px-3 py-1 text-xs sm:text-sm md:text-sm lg:text-xs font-normal text-white uppercase tracking-wide select-none">
                                        {user.role || 'User'}
                                    </span>
                                    <div className="flex items-center mt-3 space-x-1" aria-live="polite">
                                        {user.isVerified ? (
                                            <>
                                                <MdCheckCircle className="text-green-500 w-4 h-4 lg:text-xs" aria-hidden="true" />
                                                <span className="text-green-600 text-sm font-medium lg:text-xs">Verified</span>
                                            </>
                                        ) : (
                                            <>
                                                <MdCancel className="text-red-500 w-4 h-4 lg:text-xs" aria-hidden="true" />
                                                <span className="text-red-600 text-sm font-medium lg:text-xs">Not Verified</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>


                            <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
                                <div>
                                    <dt className="flex items-center justify-center sm:justify-start text-gray-500 dark:text-gray-400 font-semibold text-sm mb-1">
                                        <AiOutlineClockCircle className="w-5 h-5 mr-2" aria-hidden="true" /> Last Login
                                    </dt>
                                    <dd className="text-gray-900 dark:text-gray-300 font-normal text-sm truncate" title={moment(user.lastLogin).format('LLLL')}>
                                        {moment(user.lastLogin).format('DD MMM YYYY, hh:mm A')}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="flex items-center justify-center sm:justify-start text-gray-500 dark:text-gray-400 font-semibold text-sm mb-1">
                                        <BsPersonFill className="w-5 h-5 mr-2" aria-hidden="true" /> Member Since
                                    </dt>
                                    <dd className="text-gray-900 dark:text-gray-300 font-normal text-sm truncate" title={moment(user.createdAt).format('LLLL')}>
                                        {moment(user.createdAt).format('DD MMM YYYY')}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="flex items-center justify-center sm:justify-start text-gray-500 dark:text-gray-400 font-semibold text-sm mb-1">
                                        <MdUpdate className="w-5 h-5 mr-2" aria-hidden="true" /> Last Updated
                                    </dt>
                                    <dd className="text-gray-900 dark:text-gray-300 font-normal text-sm truncate" title={moment(user.updatedAt).format('LLLL')}>
                                        {moment(user.updatedAt).format('DD MMM YYYY')}
                                    </dd>
                                </div>
                            </dl>
                        </section>

                    </>
                ) : (
                    <div
                        className="flex justify-center items-center h-40 bg-gray-100 rounded-lg shadow-inner dark:bg-gray-700"
                        role="alert"
                        aria-live="polite"
                    >
                        <p className="text-gray-500 text-lg dark:text-gray-400">No user information available.</p>
                    </div>
                )}
                <EditProfileModal
                    isOpen={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    title="Edit Profile"
                    userDetails={user}
                    onProfileUpdate={handleProfileUpdate}
                />
            </main>

        </DashboardLayout>
    )
}

export default AdminProfile