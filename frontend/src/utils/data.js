import { LuLayoutDashboard, LuUsers, LuClipboardCheck, LuSquarePlus, LuLogOut } from 'react-icons/lu';
import { AiOutlineUser } from "react-icons/ai";
import { GoProjectRoadmap } from "react-icons/go";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/admin/dashboard",
    },
    {
        id: "02",
        label: "Manage Projects",
        icon: GoProjectRoadmap,
        path: "/admin/projects",
    },

    {
        id: "03",
        label: "Manage Tasks",
        icon: LuClipboardCheck,
        path: "/admin/tasks",
    },
    {
        id: "04",
        label: "Create Task",
        icon: LuSquarePlus,
        path: "/admin/create-task",
    },
    {
        id: "05",
        label: "Team Members",
        icon: LuUsers,
        path: "/admin/users",
    },
    {
        id: "06",
        label: "Chat",
        icon: HiOutlineChatBubbleLeftRight,
        path: "/admin/chat",
    },
    {
        id: "07",
        label: "Logout",
        icon: LuLogOut,
        path: "logout",
    },
];

export const SIDE_MENU_USER_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/user/dashboard",
    },
    {
        id: "02",
        label: "My Tasks",
        icon: LuClipboardCheck,
        path: "/user/tasks",
    },
    {
        id: "03",
        label: "My Profile",
        icon: AiOutlineUser,
        path: "/user/userprofile",
    },
    {
        id: "04",
        label: "Chat",
        icon: HiOutlineChatBubbleLeftRight,
        path: "/user/chat",
    },
    {
        id: "05",
        label: "Logout",
        icon: LuLogOut,
        path: "logout",
    },
];

export const PRIORITY_DATA = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
];

export const STATUS_DATA = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
]