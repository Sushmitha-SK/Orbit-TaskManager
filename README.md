# Orbit - Task Management System

## 🚀 Project Overview

**Orbit** is a powerful and efficient task management system thoughtfully crafted to streamline team collaboration, boost productivity, and drive successful project outcomes. Built on the robust MERN stack (MongoDB, Express.js, React.js, and Node.js), Orbit combines a modern, responsive user interface with seamless backend integration, delivering a smooth and scalable experience for users and administrators alike.

---

## 🌐 Live URL & Repository

- **Live Application**: [https://orbit-task-manager.vercel.app/](https://orbit-task-manager.vercel.app/)
- **GitHub Repository**: [https://github.com/Sushmitha-SK/Orbit-TaskManager.git](https://github.com/Sushmitha-SK/Orbit-TaskManager.git)

---

## ✨ Features

- **Landing Page**: A visually appealing landing page to introduce users to the core features of Orbit. Prominent "Start Managing Tasks" button to guide users into the application.

- **User Authentication**:

  - **Signup**: Users can create accounts with their details, upload a profile picture, and get validated for correct inputs like email and password.

  - **Login**: Users can log in using their email and password, with role-based redirection and error handling for invalid credentials.

  - **Forgot Password**: Users can request a reset link by providing their registered email.

  - **Reset Password**: Allows users to set a new password using the reset link from their email.

- **Admin Dashboard**: The Admin Dashboard offers a centralized and comprehensive overview of task and project management. It displays essential metrics such as total, pending, in-progress, and completed tasks, accompanied by detailed charts illustrating task distribution and priority levels. The dashboard also provides a clear summary of project statuses, insights into user involvement, and a list of recent tasks with their status, priority, and due dates—highlighting overdue tasks for prompt attention. A convenient sidebar ensures easy navigation to manage projects, tasks, team members, and chats, along with a quick logout option, making it an efficient control center for all admin activities.

- **Manage Projects**: This feature enables admins to efficiently view, search, sort, and add projects. Admins can easily manage project details and download comprehensive project reports as Excel files for analysis and record-keeping.

- **Manage Tasks**: This feature offers a complete task management interface for admins. They can view, search, filter, and sort tasks to quickly find what they need. Admins can also view and edit detailed task information directly. Additionally, task reports can be downloaded as Excel files for easy sharing and analysis.

- **Create Task**: The Create Task component allows admins to easily create new tasks and assign them to team members, streamlining task delegation and management.

- **Team Members**: This feature enables admins to view, search, verify, and manage team members efficiently. Admins can add new members as needed and download detailed reports of user information in Excel format for easy tracking and record-keeping.

- **Chat**: This real-time chat system, powered by Firebase Firestore, enables users to send and receive messages within a dashboard interface. It efficiently manages conversations, features a searchable user list, and displays chat messages in real time. Users can send messages, use emoji reactions, and see typing indicators, delivering a smooth and interactive messaging experience.

- **User Dashboard**: The User Dashboard provides a personalized view for logged-in users, presenting an overview of their task statistics, including totals and status breakdowns. It highlights recent tasks and features interactive charts that visualize task distribution and priority levels, offering users a clear and organized understanding of their workload.

- **My Tasks**: This feature provides users with a comprehensive view of their assigned tasks. Users can search and sort tasks to quickly find what they need. They can also access detailed task information and update task checklists, ensuring efficient task management and progress tracking.

- **My Profile**: The My Profile section displays a user’s personal information alongside comprehensive project analytics. Users can edit their profile details and access a detailed list of their projects. Each project entry includes progress metrics such as completion percentage, status, priority level, and timelines, providing a clear snapshot of ongoing and completed work.

- **Logout**: The logout functionality clears all session data from local storage, resets the user context, and redirects the user to the login page. It also provides feedback to the user through a success notification, ensuring a smooth and clear logout process.

- **Responsive Design**: Ensures the app adapts smoothly to different screen sizes, providing an optimal experience on all devices.

---

## 🛠️ Tech Stack

### Core Technologies:

- **Frontend**: React.js, Vite

- **State Management**: Context API

- **Styling**: Tailwind CSS

- **Animations**: framer-motion

- **Charts & Data Visualization**: Recharts

- **Icons**: react-icons

- **Loader**: react-spinners

- **API Integration**: https://orbit-taskmanager.onrender.com

- **Backend**: Node.js with Express.js for server-side logic and APIs

- **Database**: MongoDB for a flexible and scalable NoSQL database

- **Authentication**: JSON Web Tokens (JWT) for secure authentication

- **File Uploads**: Multer for handling file uploads (e.g., profile pictures)

### Deployment:

- Hosted on [Vercel](https://vercel.com/) for fast, reliable, and scalable deployment.

---

## 📂 Project Structure

```
Orbit/
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── reportController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   └── uploads/
├── frontend/
│   ├── .env
│   ├── .gitignore
│   ├── coverage/
│   │   ├── clover.xml
│   │   ├── coverage-final.json
│   │   └── lcov-report/ (files excluded)
│   ├── dist/
│   │   ├── assets/ (files excluded)
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── vite.svg
│   ├── eslint.config.js
│   ├── index.html
│   ├── jest.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── public/
│   │   ├── favicon.ico
│   │   └── vite.svg
│   ├── README.md
│   ├── setupTests.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── assets/
│   │   │   ├── audio/
│   │   │   │   └── notification.mp3
│   │   │   ├── images/
│   │   ├── components/
│   │   │   ├── AddNewUserModal.jsx
│   │   │   ├── AddProjectModal.jsx
│   │   │   ├── AssignMembersModal.jsx
│   │   │   ├── Attachment.jsx
│   │   │   ├── AvatarGroup.jsx
│   │   │   ├── Cards/
│   │   │   │   ├── InfoBox.jsx
│   │   │   │   ├── InfoCard.jsx
│   │   │   │   ├── ProjectCard.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   └── UserCard.jsx
│   │   │   ├── Charts/
│   │   │   │   ├── CustomBarChart.jsx
│   │   │   │   ├── CustomLegend.jsx
│   │   │   │   ├── CustomPieChart.jsx
│   │   │   │   └── CustomTooltip.jsx
│   │   │   ├── DeleteAlert.jsx
│   │   │   ├── EditProfileModal.jsx
│   │   │   ├── Inputs/
│   │   │   │   ├── AddAttachmentsInput.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── ProfilePhotoSelector.jsx
│   │   │   │   ├── SearchInput.jsx
│   │   │   │   ├── SelectDropdown.jsx
│   │   │   │   ├── SelectUsers.jsx
│   │   │   │   └── TodoListInput.jsx
│   │   │   ├── Landing/
│   │   │   │   ├── About.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── LandingHeader.jsx
│   │   │   │   ├── Services.jsx
│   │   │   │   └── Testimonials.jsx
│   │   │   ├── layout/
│   │   │   │   ├── AuthLayout.jsx
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── SideMenu.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Progress.jsx
│   │   │   ├── TaskListTable.jsx
│   │   │   ├── TaskStatusTabs.jsx
│   │   │   ├── TodoCheckList.jsx
│   │   │   ├── UpdateProjectModal.jsx
│   │   │   └── ViewProjectModal.jsx
│   │   ├── context/
│   │   │   └── userContext.jsx
│   │   ├── firebase.js
│   │   ├── hooks/
│   │   │   └── useUserAuth.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminProfile.jsx
│   │   │   │   ├── CreateTask.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── ManageProjects.jsx
│   │   │   │   ├── ManageTasks.jsx
│   │   │   │   └── ManageUsers.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── ChangePassword.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── ResetPassword.jsx
│   │   │   │   └── SignUp.jsx
│   │   │   ├── Chat/
│   │   │   │   └── ChatInterface.tsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── User/
│   │   │   │   ├── MyTasks.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── UserDashboard.jsx
│   │   │   │   └── ViewTaskDetails.jsx
│   │   ├── routes/
│   │   │   └── PrivateRoute.jsx
│   │   ├── utils/
│   │   │   ├── apiPaths.js
│   │   │   ├── axiosInstance.js
│   │   │   ├── data.js
│   │   │   ├── helper.js
│   │   │   └── uploadImage.js
│   ├── vite-env.d.ts
│   ├── vite.config.js
│   └── __tests__/
│       └── Login.test.jsx
└── README.md


```

## 🚀 Getting Started

### Setup:

1.  Clone the repository:

    ```bash
    git clone https://github.com/Sushmitha-SK/Orbit-TaskManager.git
    ```

2.  Navigate to the project directory:
    ```bash
    cd Orbit-TaskManager
    ```
3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Set up environment variables:
    Create a .env file in the root directory and add the following:

    ```bash
    VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
    VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
    VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
    VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
    VITE_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID
    ```

5.  Run the application:

    ```bash
    npm run dev
    ```

6.  Open [http://localhost:5173](http://localhost:5173) in your browser to see the app.

## 🎯 Conclusion

Orbit is a comprehensive and thoughtfully designed task management system that empowers teams and administrators to efficiently handle projects, tasks, and communication in one unified platform. With its modern tech stack, robust features, real-time collaboration capabilities, and user-friendly interfaces, Orbit not only boosts productivity but also ensures smooth project tracking and management. Its scalable architecture and clean codebase make it an excellent foundation for further customization and growth. Whether you're a team member looking to stay organized or an admin overseeing multiple projects, Orbit delivers a seamless experience tailored to your workflow needs.
