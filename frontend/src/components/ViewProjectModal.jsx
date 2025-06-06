import moment from "moment";

const ViewProjectModal = ({ isViewOpen, onViewClose, projectDetails }) => {
    if (!isViewOpen) return null;

    const isOverdue = (dueDate, status) => {
        if (!dueDate) return false;
        return moment(dueDate).isBefore(moment(), 'day') && status !== 'Completed';
    };

    const overdue = isOverdue(projectDetails.dueDate, projectDetails.status);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onViewClose}>
            <div
                className="relative p-6 bg-white rounded-2xl shadow-lg w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800">View Project Details</h3>
                    <button
                        onClick={onViewClose}
                        className="text-gray-500 hover:text-gray-800 focus:outline-none"
                        title="Close"
                    >
                        <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-600">Project Name</h4>
                            <p className="text-sm text-gray-700 font-light bg-gray-50 p-3 rounded-lg">
                                {projectDetails.title || "N/A"}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-600">Project Status</h4>
                            <p
                                className={`text-sm font-light p-3 rounded-lg ${projectDetails.status === "Completed"
                                    ? "bg-green-50 text-green-700"
                                    : projectDetails.status === "In Progress"
                                        ? "bg-cyan-50 text-cyan-700"
                                        : "bg-violet-100 text-violet-700"
                                    }`}
                            >
                                {projectDetails.status || "Not Available"}
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-sm font-medium text-gray-600">Description</h4>
                            <p className="text-sm text-gray-700 font-light bg-gray-50 p-3 rounded-lg">
                                {projectDetails.description || "No description provided."}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-600">Created At</h4>
                            <p className="text-sm text-gray-700 font-light bg-gray-50 p-3 rounded-lg">
                                {new Date(projectDetails.createdAt).toLocaleDateString() || "N/A"}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-600">Due Date</h4>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-700 font-light bg-gray-50 p-3 rounded-lg">
                                    {new Date(projectDetails.dueDate).toLocaleDateString() || "N/A"}
                                </p>
                                {overdue && (
                                    <span
                                        className="inline-block px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded"
                                        title="Overdue"
                                    >
                                        Overdue
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end border-t pt-4">
                    <button
                        onClick={onViewClose}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewProjectModal;
