import React, { useEffect, useState } from 'react';
import { LuFileSpreadsheet } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { SyncLoader } from 'react-spinners';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AddProjectModal from '../../components/AddProjectModal';
import ProjectCard from '../../components/Cards/ProjectCard';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { IoSearchOutline } from "react-icons/io5";
import noproject from '../../assets/images/noproject.png'

const ManageProjects = () => {
    const [isAddProjectModalOpen, setAddProjectModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [allProjects, setAllProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [sortOption, setSortOption] = useState('Name');

    const handleAddNewProject = () => {
        setAddProjectModalOpen(true);
    };

    const handleDownloadReport = async () => {
        setDownloadLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_PROJECTS, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'project_details.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Report downloaded successfully.');
        } catch (error) {
            console.error('Error downloading report:', error);
            toast.error('Failed to download report. Please try again.');
        } finally {
            setDownloadLoading(false);
        }
    };

    const closeAddProjectModal = () => {
        setAddProjectModalOpen(false);
    };

    const getAllProjects = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS);
            setAllProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects', error);
            toast.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllProjects();
    }, []);

    useEffect(() => {
        const filtered = allProjects.filter((project) =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const sorted = [...filtered].sort((a, b) => {
            switch (sortOption) {
                case 'Name':
                    return a.name.localeCompare(b.name);
                case 'Status':
                    return a.status.localeCompare(b.status);
                case 'Due Date':
                    return new Date(a.endDate) - new Date(b.endDate);
                default:
                    return 0;
            }
        });
        setFilteredProjects(sorted);
    }, [searchQuery, allProjects, sortOption]);

    return (
        <DashboardLayout activeMenu="Manage Projects">
            <div className="my-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <h2 className="text-xl md:text-xl font-medium">Manage Projects</h2>
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0 lg:justify-end w-full lg:w-auto">
                        <button
                            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg text-sm"
                            onClick={handleAddNewProject}
                        >
                            + Add New Project
                        </button>
                        <button
                            className="flex items-center download-btn text-gray-700 px-4 py-2 rounded-lg text-sm"
                            onClick={handleDownloadReport}
                            disabled={downloadLoading}
                        >
                            <LuFileSpreadsheet className="text-lg mr-2" />
                            {downloadLoading ? 'Downloading...' : 'Download Report'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center my-8 space-y-4 md:space-y-0">
                    <div className="flex items-center w-full md:w-1/2 relative">
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-10 py-2 bg-white 
                                       focus:ring-primary focus:outline-none text-sm text-gray-700"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute left-3 text-gray-400">
                            <IoSearchOutline className="w-5 h-5" />
                        </span>
                    </div>


                    <div className="flex items-center space-x-2">
                        <span className="text-[12px] font-medium text-gray-600">Sort By:</span>
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 bg-white 
                    focus:ring-primary focus:outline-none text-[12px] text-gray-700"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="Name">Name</option>
                            <option value="Status">Status</option>
                            <option value="Due Date">Due Date</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <SyncLoader size={8} color="#1368EC" />
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {filteredProjects.map((item) => (
                            <ProjectCard
                                key={item._id}
                                projectId={item._id}
                                title={item.name}
                                description={item.description}
                                status={item.status}
                                createdAt={item.createdAt}
                                dueDate={item?.endDate}
                                assignedTo={item.assignedUsers}
                                refreshProjects={getAllProjects}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-96">
                        <img src={noproject} alt="No projects available" className="w-50 h-50" />
                        <p className="text-gray-500 mt-4 text-center text-sm">
                            No projects found at the moment. Please check back later.
                        </p>
                    </div>
                )}

            </div>
            <AddProjectModal
                isOpen={isAddProjectModalOpen}
                onClose={closeAddProjectModal}
                onSuccess={getAllProjects}
            />
        </DashboardLayout>
    );
};

export default ManageProjects;
