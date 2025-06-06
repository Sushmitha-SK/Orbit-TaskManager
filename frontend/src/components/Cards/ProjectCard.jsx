import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { IoMdMore } from "react-icons/io";
import UpdateProjectModal from '../UpdateProjectModal';
import ViewProjectModal from '../ViewProjectModal';
import Modal from '../Modal';
import DeleteAlert from '../DeleteAlert';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import AssignMembersModal from '../AssignMembersModal';

const Projectcard = ({
    projectId,
    title,
    description,
    status,
    createdAt,
    dueDate,
    assignedTo,
    refreshProjects,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleEdit = () => {
        setIsUpdateModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleView = () => {
        setIsViewModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleAssignProject = () => {
        setIsAssignModalOpen(true); 
        setIsDropdownOpen(false);
    };

    const handleDelete = async () => {
        try {
            setIsAlertModalOpen(false);
            await axiosInstance.delete(API_PATHS.PROJECTS.DELETE_PROJECT(projectId));
            toast.success("Project details deleted successfully");
            refreshProjects();
            navigate('/admin/projects');

        } catch (error) {
            console.error("Error deleting project:", error.response?.data?.message || error.message);
        }
    }

    const getStatusTagColor = () => {
        switch (status) {
            case "In Progress":
                return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
            case "Completed":
                return "text-lime-500 bg-lime-50 border border-lime-500/20";
            default:
                return "text-violet-500 bg-violet-50 border border-violet-500/10";
        }
    };

    const isOverdue = (dueDate, status) => {
        if (!dueDate) return false;
        return moment(dueDate).isBefore(moment(), 'day') && status !== 'Completed';
    };

    const overdue = isOverdue(dueDate, status);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !event.target.closest('.more-icon')
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);


    return (
        <div ref={dropdownRef} className="relative bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"  >
            <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                onClick={toggleDropdown}
            >
                <IoMdMore size={20} />
            </button>

            {isDropdownOpen && (
                <div className="absolute top-10 right-3 bg-white shadow-lg rounded-lg border border-gray-200 w-40 z-10">
                    <ul className="py-1">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[11px]"
                            onClick={handleView}
                        >
                            View
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[11px]"
                            onClick={handleAssignProject}
                        >
                            Assign Project
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[11px]"
                            onClick={handleEdit}
                        >
                            Edit
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[11px]"
                            onClick={() => {
                                setIsDropdownOpen(false); 
                                setIsAlertModalOpen(true); 
                            }}
                        >
                            Delete
                        </li>
                    </ul>
                </div>
            )}

            <div className="flex items-end gap-3 px-4">
                <div className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
                    {status}
                </div>
            </div>
            <div
                className={`px-4 border-l-[3px] 
                  ${status === "In Progress"
                        ? "border-cyan-500"
                        : status === "Completed"
                            ? "border-indigo-500"
                            : "border-violet-500"
                    }`}
            >
                <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
                    {title}
                </p>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
                    {description}
                </p>
            </div>
            <div className="px-4">
                <div className="flex items-center justify-between my-1">
                    <div>
                        <label className="text-xs text-gray-500">Start Date</label>
                        <p className="text-[13px] font-medium text-gray-900">
                            {moment(createdAt).format("D MMM YYYY")}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Due Date</label>
                        <p className="text-[13px] font-medium text-gray-900 flex items-center gap-2">
                            {moment(dueDate).format("D MMM YYYY")}
                            {overdue && (
                                <span
                                    className="inline-block px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded"
                                    title="Overdue"
                                >
                                    Overdue
                                </span>
                            )}
                        </p>
                    </div>


                </div>

            </div>

            {isAlertModalOpen && (
                <Modal
                    isOpen={isAlertModalOpen}
                    onClose={() => setIsAlertModalOpen(false)}
                    title="Delete Project"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this project? This action cannot be undone."
                        onClose={() => setIsAlertModalOpen(false)}
                        onDelete={() => handleDelete()}
                    />
                </Modal>
            )}

            {isUpdateModalOpen && (
                <UpdateProjectModal
                    isUpdateOpen={isUpdateModalOpen}
                    onUpdateClose={() => setIsUpdateModalOpen(false)}
                    projectId={projectId}
                    projectDetails={{
                        title,
                        description,
                        createdAt,
                        dueDate,
                        status,
                    }}
                    onSuccess={() => {
                        refreshProjects(); 
                        setIsUpdateModalOpen(false); 
                    }}
                />
            )}

            {isViewModalOpen && (
                <ViewProjectModal
                    isViewOpen={isViewModalOpen}
                    onViewClose={() => setIsViewModalOpen(false)}
                    projectId={projectId}
                    projectDetails={{
                        title,
                        description,
                        createdAt,
                        dueDate,
                        status,
                    }}
                />
            )}

            {isAssignModalOpen && (
                <AssignMembersModal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    projectId={projectId}
                    projectName={title}
                    projectDescription={description}
                    onSuccess={refreshProjects}
                    assignedMember={assignedTo}
                />
            )}
        </div>
    );
};

export default Projectcard;
