import React, { useEffect, useState } from 'react';
import DashboardLayout from './../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import toast from 'react-hot-toast';
import { SyncLoader } from 'react-spinners';
import { IoSearchOutline } from "react-icons/io5";
import notask from '../../assets/images/notask.png'

const ManageTasks = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [sortBy, setSortBy] = useState("CreatedAt");
    const [loading, setLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);

    const navigate = useNavigate();

    const getAllTasks = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
                params: {
                    status: filterStatus === "All" ? "" : filterStatus,
                },
            });
            setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);
            setFilteredTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);
            const statusSummary = response.data?.statusSummary || {};

            console.log('test tasklist===>', JSON.stringify(response.data?.tasks))

            const statusArray = [
                { label: "All", count: statusSummary.all || 0 },
                { label: "Pending", count: statusSummary.pendingTasks || 0 },
                { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
                { label: "Completed", count: statusSummary.completedTasks || 0 },
            ];
            setTabs(statusArray);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error("Failed to fetch tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        setDownloadLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "task_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Report downloaded successfully.");
        } catch (error) {
            console.error("Error downloading report:", error);
            toast.error("Failed to download report. Please try again.");
        } finally {
            setDownloadLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        const filtered = allTasks.filter((task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTasks(filtered);
    };

    const handleSortChange = (criteria) => {
        setSortBy(criteria);
        const statusOrder = { Pending: 1, "In Progress": 2, Completed: 3 };
        const priorityOrder = { Low: 3, Medium: 2, High: 1 };
        const sortedTasks = [...filteredTasks].sort((a, b) => {
            switch (criteria) {
                case "Priority":
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case "Status":
                    return statusOrder[a.status] - statusOrder[b.status];
                case "DueDate":
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case "CreatedAt":
                default:
                    return new Date(a.createdAt) - new Date(b.createdAt);
            }
        });
        setFilteredTasks(sortedTasks);
    };

    useEffect(() => {
        getAllTasks(filterStatus);
    }, [filterStatus]);


    return (
        <DashboardLayout activeMenu="Manage Tasks">
            <div className="my-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl md:text-xl font-medium">Manage Tasks</h2>
                        <button
                            className="flex lg:hidden download-btn"
                            onClick={handleDownloadReport}
                            disabled={downloadLoading}
                        >
                            <LuFileSpreadsheet className="text-lg" />
                            {downloadLoading ? "Downloading..." : "Download Report"}
                        </button>
                    </div>
                    {tabs?.[0]?.count > 0 && (
                        <div className="flex items-center gap-3">
                            <TaskStatusTabs
                                tabs={tabs}
                                activeTab={filterStatus}
                                setActiveTab={setFilterStatus}
                            />
                            <button
                                className="hidden lg:flex download-btn"
                                onClick={handleDownloadReport}
                                disabled={downloadLoading}
                            >
                                <LuFileSpreadsheet className="text-lg" />
                                {downloadLoading ? "Downloading..." : "Download Report"}
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 my-4">
                    <div className="flex items-center w-full md:w-1/2 relative">
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-10 py-2 bg-white 
                    focus:ring-primary focus:outline-none text-sm text-gray-700"
                            placeholder="Search tasks by title or description..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <span className="absolute left-3 text-gray-400">
                            <IoSearchOutline className="w-5 h-5" />
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="sortBy"
                            className="text-[12px] font-medium text-gray-600"
                        >
                            Sort By:
                        </label>
                        <select
                            id="sortBy"
                            className="border border-gray-300 rounded-lg px-3 py-2 bg-white 
                    focus:ring-primary focus:outline-none text-[12px] text-gray-700"
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                        >
                            <option value="Priority">Priority</option>
                            <option value="Status">Status</option>
                            <option value="CreatedAt">Created Date</option>
                            <option value="DueDate">Due Date</option>
                        </select>
                    </div>
                </div>


                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <SyncLoader size={8} color="#1368EC" />
                    </div>
                ) : filteredTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {filteredTasks.map((item) => (
                            <TaskCard
                                key={item._id}
                                title={item.title}
                                description={item.description}
                                priority={item.priority}
                                status={item.status}
                                progress={item.progress}
                                createdAt={item.createdAt}
                                dueDate={item.dueDate}
                                assignedTo={item.assignedTo?.map((user) => user.profileImageUrl)}
                                attachmentCount={item.attachments?.length || 0}
                                completedTodoCount={item.completedTodoCount || 0}
                                todoChecklist={item.todoChecklist || []}
                                onClick={() =>
                                    navigate(`/admin/create-task`, { state: { taskId: item._id } })
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-96">
                        <img src={notask} alt="No tasks available" className="w-50 h-50" />
                        <p className="text-gray-500 mt-4 text-center text-sm">
                            No tasks available at the moment. Please check back later.
                        </p>
                    </div>
                )}

            </div>

        </DashboardLayout>
    );
};

export default ManageTasks;

