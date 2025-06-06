export const BASE_URL = "https://orbit-taskmanager.onrender.com"

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
        FORGOT_PASSWORD: "/api/auth/forgot-password",
        RESET_PASSWORD: "/api/auth/reset-password",
        VERIFY_USER: (userId) => `/api/auth/verify-user/${userId}`,
    },

    USERS: {
        GET_ALL_USERS: "/api/users",
        GET_USERS_BY_ID: (userId) => `/api/users/${userId}`,
        CREATE_USER: "/api/users",
        UPDATE_USER: (userId) => `/api/users/${userId}`,
        DELETE_USER: (userId) => `/api/users/${userId}`,
        GETALLUSERS_CHAT: "/api/users/all",
        UPDATE_USER_PROFILE: "/api/auth/profile"
    },

    TASKS: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
        GET_ALL_TASKS: "/api/tasks",
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
        GET_TASK_BY_USERID: (userId) => `/api/tasks/user/${userId}`,
        CREATE_TASK: "/api/tasks",
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,
        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`,
    },

    REPORTS: {
        EXPORT_TASKS: "/api/reports/export/tasks",
        EXPORT_USERS: "/api/reports/export/users",
        EXPORT_PROJECTS: "/api/reports/export/projects"
    },

    IMAGE: {
        UPLOAD_IMAGE: "api/auth/upload-image",
    },

    PROJECTS: {
        CREATE_PROJECT: "/api/projects",
        GET_ALL_PROJECTS: "/api/projects",
        UPDATE_PROJECT: (projectID) => `/api/projects/${projectID}`,
        ASSIGN_TASK_TO_PROJECT: (taskId) => `/api/projects/${taskId}`,
        GET_PROJECTS_BY_USER: (userID) => `/api/projects/user/${userID}`,
        GET_PROJECTS_BY_USER_ANALYTICS: (userID) => `/api/projects/user/${userID}/analytics`,
        DELETE_PROJECT: (projectId) => `/api/projects/${projectId}`,
        ASSIGN_USERS_TO_PROJECT: (projectId) => `/api/projects/${projectId}/assign-users`,
        GET_PROJECT_ANALYTICS: `api/projects/admin/projectanalytics`
    }
};
