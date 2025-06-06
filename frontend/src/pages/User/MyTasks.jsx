import React, { useEffect, useState } from 'react'
import DashboardLayout from './../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import { SyncLoader } from 'react-spinners';
import notask from '../../assets/images/notask.png'
import { IoSearchOutline } from "react-icons/io5";

const MyTasks = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [displayedTasks, setDisplayedTasks] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [sortBy, setSortBy] = useState("CreatedAt");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    const getAllTasks = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
                params: {
                    status: filterStatus === "All" ? "" : filterStatus,
                }
            });
            const tasks = response.data?.tasks?.length > 0 ? response.data.tasks : [];
            setAllTasks(tasks);
            setDisplayedTasks(tasks);

            const statusSummary = response.data?.statusSummary || {};
            const statusArray = [
                { label: "All", count: statusSummary.all || 0 },
                { label: "Pending", count: statusSummary.pendingTasks || 0 },
                { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
                { label: "Completed", count: statusSummary.completedTasks || 0 },
            ];
            setTabs(statusArray);

        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = allTasks;

        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        const statusOrder = { Pending: 1, "In Progress": 2, Completed: 3 };
        const priorityOrder = { Low: 3, Medium: 2, High: 1 };

        const sortedTasks = [...filtered].sort((a, b) => {
            switch (sortBy) {
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

        setDisplayedTasks(sortedTasks);
    }, [allTasks, searchQuery, sortBy]);

    const handleSortChange = (criteria) => {
        setSortBy(criteria);
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClick = (taskId) => {
        if (taskId) {
            navigate(`/user/task-details/${taskId}`);
        }
    };

    useEffect(() => {
        getAllTasks(filterStatus);
    }, [filterStatus]);


    return (
        <DashboardLayout activeMenu="My Tasks">
            <div className="my-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
                    {tabs?.[0]?.count > 0 && (
                        <TaskStatusTabs tabs={tabs}
                            activeTab={filterStatus}
                            setActiveTab={setFilterStatus}
                        />
                    )}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 my-6">

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
                    <div className="flex justify-center items-center h-64">
                        <SyncLoader size={8} color="#1368EC" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {displayedTasks.length > 0 ? (
                            displayedTasks.map((item) => (
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
                                    onClick={() => handleClick(item._id)}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center mt-10 col-span-3">
                                <img
                                    src={notask}
                                    alt="No tasks available"
                                    className="w-40 h-40 my-12"
                                />
                                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mt-4 mr-8">
                                    {filterStatus === "All" &&
                                        "It looks like you don't have any tasks assigned yet."}
                                    {filterStatus === "Pending" &&
                                        "It looks like you don't have any pending tasks."}
                                    {filterStatus === "In Progress" &&
                                        "It looks like you don't have any in-progress tasks."}
                                    {filterStatus === "Completed" &&
                                        "It looks like you don't have any completed tasks."}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 mr-8">
                                    Check back later or reach out to your team for updates.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default MyTasks
