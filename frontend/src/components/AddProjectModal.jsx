import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';

const AddProjectModal = ({ isOpen, onClose, taskId, onSuccess }) => {

    const [projectData, setProjectData] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Not Started",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleValueChange = (key, value) => {
        setProjectData((prevData) => ({ ...prevData, [key]: value }));
    };

    const createProject = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(API_PATHS.PROJECTS.CREATE_PROJECT, {
                ...projectData,
            });
            toast.success("Project Created Successfully");
            onSuccess();
        } catch (error) {
            console.error("Error creating project", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = () => {
        setError(null);

        if (!projectData.name.trim()) {
            setError("Project Name is required.");
            return;
        }

        if (!projectData.description.trim()) {
            setError("Description is required.");
            return;
        }

        if (!projectData.startDate) {
            setError("Start Date is required.");
            return;
        }

        if (!projectData.endDate) {
            setError("End Date is required.");
            return;
        }
        if (taskId) {
            updateProjectStatus();
        }
        createProject();
        onClose();
    };

    if (!isOpen) return null;

    const updateProjectStatus = async () => {
        setLoading(true);
        try {
            const projectStatus = projectData.map((item) => item.status);
            console.log("project status", projectStatus)
        } catch (error) {

        }
    }

    return (
        <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center
        w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {taskId ? "Update Project" : "Add New Project"}
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
                                Project Name
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter project name"
                                value={projectData.name}
                                onChange={({ target }) => handleValueChange("name", target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">
                                Description
                            </label>
                            <textarea
                                className="form-input"
                                placeholder="Enter project description"
                                rows={4}
                                value={projectData.description}
                                onChange={({ target }) =>
                                    handleValueChange("description", target.value)
                                }
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-slate-600">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={projectData.startDate}
                                    onChange={({ target }) =>
                                        handleValueChange("startDate", target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-600">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={projectData.endDate}
                                    onChange={({ target }) =>
                                        handleValueChange("endDate", target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">
                                Status
                            </label>
                            <select
                                className="form-input"
                                value={projectData.status}
                                onChange={({ target }) => handleValueChange("status", target.value)}
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
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
                                Save Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProjectModal;
