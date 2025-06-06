import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useUserAuth } from '../../hooks/useUserAuth'
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import InfoCard from '../../components/Cards/InfoCard';
import { addThousandsSeparator } from '../../utils/helper';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';
import { SyncLoader } from 'react-spinners';

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const UserDashboard = () => {
    useUserAuth();

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);

    const prepareChartData = (data) => {
        const taskDistribution = data?.taskDistribution || null;
        const taskPriorityLevels = data?.taskPriorityLevels || null;

        const taskDistributionData = [
            { status: "Pending", count: taskDistribution?.Pending || 0 },
            { status: "In Progress", count: taskDistribution?.InProgress || 0 },
            { status: 'Completed', count: taskDistribution?.Completed || 0 },
        ];
        setPieChartData(taskDistributionData);

        const PriorityLevelData = [
            { priority: "Low", count: taskPriorityLevels?.Low || 0 },
            { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
            { priority: "High", count: taskPriorityLevels?.High || 0 },
        ];
        setBarChartData(PriorityLevelData);
    }

    const getGreetingMessage = () => {
        try {
            const currentHour = moment().hour();

            if (currentHour < 12) return "Good Morning";
            if (currentHour < 18) return "Good Afternoon";
            return "Good Evening";
        } catch (error) {
            console.error("Error determining the current time:", error);
            return "Welcome";
        }
    };


    const getDashboardData = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
            if (response.data) {
                setDashboardData(response.data);
                prepareChartData(response.data?.charts || null);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false)
        }
    }


    const getTaskData = async () => {
        setLoadingTasks(true)
        try {

            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_USERID(user._id));
            if (response.data) {
                const tasks = response.data.tasks || [];
                setTaskList(tasks);
                const events = tasks.map(task => ({
                    taskId: task._id,
                    title: task.title,
                    start: new Date(task.createdAt),
                    end: new Date(task.dueDate),
                    allDay: true,
                }));
                setEvents(events);
            }
        } catch (error) {

            console.error("Error fetching tasks:", error);
        } finally {
            setLoadingTasks(false);
        }
    };
    const onSeeMore = () => {
        navigate("/user/tasks");
    }

    const getUserData = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_USERS_BY_ID(user._id));
            setUser(response.data)

        } catch (error) {

        }
    }

    useEffect(() => {

        getDashboardData();
        getTaskData();

        getUserData();

        return () => { };
    }, []);


    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="card my-5">
                <div>
                    <div className="col-span-3">
                        <h2 className="text-xl md:text-2xl"> {getGreetingMessage()}! {user?.name}</h2>
                        <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                            {moment().format("dddd Do MMM YYYY")}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
                    <InfoCard
                        label="Total Tasks"
                        value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.All || 0
                        )}
                        color="bg-primary"
                    />
                    <InfoCard
                        label="Pending Tasks"
                        value={addThousandsSeparator(
                            dashboardData?.charts?.taskDistribution?.Pending || 0
                        )}
                        color="bg-violet-500"
                    />
                    <InfoCard
                        label="In Progress Tasks"
                        value={addThousandsSeparator(
                            dashboardData?.charts?.taskDistribution?.InProgress || 0
                        )}
                        color="bg-cyan-500"
                    />
                    <InfoCard
                        label="Completed Tasks"
                        value={addThousandsSeparator(
                            dashboardData?.charts?.taskDistribution?.Completed || 0
                        )}
                        color="bg-lime-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">

                <div>

                    <div className="card">
                        <h5 className="font-medium">Task Distribution</h5>
                        {loading ? (
                            <div className="flex justify-center">
                                <SyncLoader color="#4A90E2" size={5} />
                            </div>
                        ) : pieChartData && pieChartData.some(item => item.count > 0) ? (
                            <CustomPieChart data={pieChartData} colors={COLORS} />
                        ) : (
                            <p className="text-center text-gray-500 text-sm mt-6">No data available for Task Distribution</p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="card">
                        <h5 className="font-medium">Task Priority Levels</h5>
                        {loading ? (
                            <div className="flex justify-center">
                                <SyncLoader color="#4A90E2" size={5} />
                            </div>
                        ) : barChartData && barChartData.some(item => item.count > 0) ? (
                            <CustomBarChart data={barChartData} />
                        ) : (
                            <p className="text-center text-gray-500 text-sm mt-6">No data available for Task Priority Levels</p>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <h5 className="text-lg">
                                Recent Tasks
                            </h5>
                            <button className='card-btn' onClick={onSeeMore}>
                                See All <LuArrowRight className='text-base' />
                            </button>
                        </div>
                        {loadingTasks ? (
                            <div className="flex justify-center">
                                <SyncLoader color="#4A90E2" size={5} />
                            </div>
                        ) : dashboardData?.recentTasks && dashboardData.recentTasks.length > 0 ? (
                            <TaskListTable tableData={dashboardData.recentTasks} />
                        ) : (
                            <p className="text-center text-gray-500">No recent tasks</p>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default UserDashboard