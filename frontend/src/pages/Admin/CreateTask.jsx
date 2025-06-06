import React, { useEffect, useState } from 'react'
import DashboardLayout from './../../components/layout/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';

const CreateTask = () => {
    const location = useLocation();
    const { taskId } = location.state || {};
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "Low",
        status: "",
        dueDate: null,
        assignedTo: [],
        todoChecklist: [],
        attachments: [],
        projectId: "",
    });

    const [currentTask, setCurrentTask] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [projects, setProjects] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null)


    const handleValueChange = (key, value) => {
        if (key === "dueDate") {
            const selectedDate = new Date(value);
            const currentDueDate = new Date(taskData.dueDate);
            if (taskData.dueDate && moment(taskData.dueDate).isBefore(moment()) && selectedDate < currentDueDate) {
                setError("End date cannot be set earlier than the current overdue date.");
                return;
            }
        }

        setTaskData((prevData) => ({ ...prevData, [key]: value }));
    };

    const isOverdue = () => {
        return (
            taskData.dueDate &&
            moment(taskData.dueDate).isBefore(moment()) &&
            taskData.status !== "Completed"
        );
    };

    const handleProjectChange = (selectedValue) => {
        setSelectedProject(() => {
            return selectedValue;
        });
    };

    const clearData = () => {
        setTaskData({
            title: "",
            description: "",
            priority: "Low",
            status: "",
            dueDate: null,
            assignedTo: [],
            todoChecklist: [],
            attachments: [],
            projectId: "",
        });
    };

    const createTask = async () => {
        setLoading(true);
        try {
            const todolist = taskData.todoChecklist?.map((item) => ({
                text: item,
                completed: false
            }));

            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString(),
                todoChecklist: todolist,
                projectId: selectedProject
            });

            const createdTask = response.data?.task;

            const projectObject = projects?.find(project => project.value === createdTask.project) || {};
            createdTask.project = {
                id: projectObject.value || createdTask.project,
                name: projectObject.label || ""
            };

            setTaskData((prevState) => ({
                ...prevState,
                project: createdTask.project
            }));

            toast.success("Task Created Successfully");
            clearData();
            navigate('/admin/tasks');
        } catch (error) {
            console.error('Error creating task:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async () => {
        setLoading(true);
        try {
            const todolist = taskData.todoChecklist?.map((item) => {
                const prevTodoChecklist = currentTask?.todoChecklist || [];
                const matchedTask = prevTodoChecklist.find((task) => task.text == item);

                return {
                    text: item,
                    completed: matchedTask ? matchedTask.completed : false,
                };
            });
            const response = await axiosInstance.put(
                API_PATHS.TASKS.UPDATE_TASK(taskId),
                {
                    ...taskData,
                    dueDate: new Date(taskData.dueDate).toISOString(),
                    todoChecklist: todolist,
                    projectId: selectedProject
                }
            );


            toast.success("Task Updated Successfully");
        } catch (error) {
            console.error("Error creating task:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = () => {
        setError(null);
        if (!taskData.title.trim()) {
            setError("Title is required.");
            return;
        }

        if (!taskData.description.trim()) {
            setError("Description is required.");
            return;
        }

        if (!taskData.dueDate) {
            setError("Due date is required.");
            return;
        }

        if (taskData.assignedTo?.length === 0) {
            setError("Task not assigned to any member");
            return;
        }

        if (taskData.todoChecklist?.length === 0) {
            setError("Add atleast one todo task");
            return;
        }

        if (taskId) {
            updateTask();
            return;
        }

        createTask();
    }

    const getAllProjects = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS)
            if (response.data) {
                const projectOptions = response.data.map(project => ({
                    value: project._id,
                    label: project.name,
                }));
                setProjects(projectOptions);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    const getTaskDetailsByID = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
            if (response.data) {
                const taskInfo = response.data;
                console.log('taskinfo===>', JSON.stringify(taskInfo))
                setCurrentTask(taskInfo);

                setTaskData((prevState) => ({
                    title: taskInfo.title,
                    description: taskInfo.description,
                    priority: taskInfo.priority,
                    status: taskInfo.status,
                    dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format("YYYY-MM-DD") : null,
                    assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
                    todoChecklist: taskInfo?.todoChecklist?.map((item) => item?.text) || [],
                    attachments: taskInfo?.attachments || [],
                    projectId: taskInfo?.project?.id || "",

                }));
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }

    }

    const deleteTask = async () => {
        try {
            await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
            setOpenDeleteAlert(false);
            toast.success("Task details deleted successfully");
            navigate('/admin/tasks');
        } catch (error) {
            console.error("Error deleting task:", error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        getAllProjects();
        if (taskId) {
            getTaskDetailsByID(taskId);
            return () => {

            }
        }
    }, [taskId]);

    return (
        <DashboardLayout activeMenu="Create Task">
            <div className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                    <div className="form-card col-span-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl md:text-xl font-medium">
                                {taskId ? "Update Task" : "Create Task"}
                            </h2>
                            {taskId && (
                                <button className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer'
                                    onClick={() => setOpenDeleteAlert(true)}>
                                    <LuTrash2 className='text-base' />Delete
                                </button>
                            )}
                        </div>

                        <div className="mt-4 ">
                            <label className="text-xs font-medium text-slate-600">
                                Select Project
                            </label>
                            <SelectDropdown
                                options={projects || []}
                                value={selectedProject || taskData.projectId}
                                onChange={(value) => handleProjectChange(value)}
                                placeholder="Select a Project"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-medium text-slate-600">
                                Task Title
                            </label>
                            <input placeholder='Create App UI'
                                className='form-input'
                                value={taskData.title}
                                onChange={({ target }) =>
                                    handleValueChange("title", target.value)}
                            />
                        </div>
                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">
                                Description
                            </label>
                            <textarea placeholder='Describe task'
                                className='form-input'
                                rows={4}
                                value={taskData.description}
                                onChange={({ target }) =>
                                    handleValueChange("description", target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-12 gap-4 mt-2">
                            <div className="col-span-6 md:col-span-4">
                                <label className="text-xs font-medium text-slate-600">
                                    Priority
                                </label>

                                <SelectDropdown
                                    options={PRIORITY_DATA}
                                    value={taskData.priority}
                                    onChange={(value) => handleValueChange("priority", value)}
                                    placeholder="Select Priority"
                                />
                            </div>

                            <div className="col-span-6 md:col-span-4">
                                <label className='text-xs font-medium text-slate-600'>
                                    Due Date
                                </label>
                                <div className="relative">
                                    <input
                                        placeholder='Create App UI'
                                        className={`form-input ${isOverdue() ? "border-red-500" : ""}`}
                                        value={taskData.dueDate || ""}
                                        onChange={({ target }) =>
                                            handleValueChange("dueDate", target.value)}
                                        type='date' />
                                    {isOverdue() && (
                                        <p className="text-xs text-red-500 mt-1">
                                            The due date is overdue.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <label className="text-xs font-medium text-slate-600">
                                    Assign To
                                </label>

                                <SelectUsers
                                    selectedUsers={taskData.assignedTo}
                                    setSelectedUsers={(value) => {
                                        handleValueChange("assignedTo", value);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">
                                TODO Checklist
                            </label>
                            <TodoListInput
                                todoList={taskData?.todoChecklist}
                                setTodoList={(value) =>
                                    handleValueChange("todoChecklist", value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">
                                Add Attachments
                            </label>
                            <AddAttachmentsInput
                                attachments={taskData?.attachments}
                                setAttachments={(value) =>
                                    handleValueChange("attachments", value)}
                            />
                        </div>

                        {error && (
                            <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
                        )}

                        <div className="flex justify-end mt-7">
                            <button className="add-btn"
                                onClick={handleSubmit}
                                disabled={loading}>
                                {taskId ? "UPDATE TASK" : "CREATE TASK"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={openDeleteAlert}
                onClose={() => setOpenDeleteAlert(false)}
                title="Delete Task"
            >
                <DeleteAlert
                    content="Are you sure you want to delete this task?"
                    onDelete={() => deleteTask()}
                    onClose={() => setOpenDeleteAlert(false)}
                />
            </Modal>
        </DashboardLayout>
    )
}

export default CreateTask

