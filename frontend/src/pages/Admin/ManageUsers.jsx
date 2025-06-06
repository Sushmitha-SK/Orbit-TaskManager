import React, { useEffect, useState } from 'react';
import DashboardLayout from './../../components/layout/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../components/Cards/UserCard';
import { toast } from 'react-hot-toast';
import { SyncLoader } from 'react-spinners';
import AddNewUserModal from '../../components/AddNewUserModal';
import { IoSearchOutline } from "react-icons/io5";
import nodata from '../../assets/images/nodata.png'

const ManageUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const getAllUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            if (response.data?.length > 0) {
                setAllUsers(response.data);
                setFilteredUsers(response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = allUsers.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleDownloadReport = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "user_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading expense details:", error);
            toast.error("Failed to download expense details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <DashboardLayout activeMenu="Team Members">
            <div className="mt-5 mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h2 className="text-xl md:text-xl font-medium">
                        Team Members
                    </h2>

                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <button
                            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg text-sm"
                            onClick={() => setShowModal(true)}
                        >
                            + Add New Member
                        </button>
                        <button className="flex items-center download-btn" onClick={handleDownloadReport}>
                            <LuFileSpreadsheet className="text-lg mr-2" />
                            {loading ? "Downloading..." : "Download Report"}
                        </button>
                    </div>
                </div>
                <div className="flex items-center w-full md:w-1/2 relative">
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-10 py-2 bg-white 
                                                       focus:ring-primary focus:outline-none text-sm text-gray-700"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <span className="absolute left-3 text-gray-400">
                        <IoSearchOutline className="w-5 h-5" />
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <SyncLoader size={8} color="#1368EC" />
                    </div>
                ) : filteredUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {filteredUsers?.map((user) => (
                            <UserCard key={user._id} userInfo={user} onUserVerified={getAllUsers} />
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center text-center mt-10 col-span-3'>
                        <img
                            src={nodata}
                            alt="No tasks available"
                            className="w-50 h-50 my-10"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-500  mr-8">
                            No team members found. Add a new member to get started or refine your search criteria.
                        </p>
                    </div>
                )}
            </div>

            {showModal && <AddNewUserModal onClose={() => setShowModal(false)} onRefresh={getAllUsers} />}
        </DashboardLayout >
    );
};

export default ManageUsers;

