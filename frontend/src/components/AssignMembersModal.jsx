import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import SelectUsers from './Inputs/SelectUsers';

const AssignMembersModal = ({ isOpen, onClose, projectId, projectName, projectDescription, assignedMember, onSuccess }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);

    useEffect(() => {
        if (Array.isArray(assignedMember)) {
            setSelectedMembers([...assignedMember]);
        }
    }, [assignedMember]);

  
    const assignMembers = async () => {
        try {
            const uniqueMembers = [...new Set(selectedMembers)];

            const payload = { userIds: uniqueMembers };
            console.log('PAYLOAD==>', JSON.stringify(payload))

            const response =
                await axiosInstance.put(
                    API_PATHS.PROJECTS.ASSIGN_USERS_TO_PROJECT(projectId),
                    payload
                );
            toast.success(response.data.message || "Members assigned successfully!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error assigning members", error);
            toast.error(error.response?.data?.message || "Failed to assign members.");
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assign Members to Project">
            <div className="mb-4">
                <h2 className="text-md font-semibold text-gray-900 dark:text-white mb-2">{projectName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{projectDescription}</p>
            </div>
            <SelectUsers selectedUsers={selectedMembers} setSelectedUsers={setSelectedMembers} />
            <div className="flex justify-end gap-4 mt-4">
                <button className="card-btn" onClick={onClose}>
                    CANCEL
                </button>
                <button className="card-btn-fill" onClick={assignMembers}>
                    ASSIGN
                </button>
            </div>
        </Modal>
    );
};

export default AssignMembersModal;
