import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    collection,
    addDoc,
    query,
    onSnapshot,
    orderBy,
    doc,
    setDoc,
    getDocs,
    where,
    writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { motion } from 'framer-motion';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { defaultAvatar } from '../../assets/index';
import EmojiPicker from 'emoji-picker-react';
import { formatDistanceToNow } from 'date-fns';
import { IoIosSend } from "react-icons/io";
import { SyncLoader } from 'react-spinners';

const ChatInterface = () => {
    const { user } = useContext(UserContext);

    const [recipient, setRecipient] = useState<string>('');
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [activeUser, setActiveUser] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);

    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const conversationId = user._id && recipient ? [user._id, recipient].sort().join('_') : null;

    useEffect(() => {
        if (!conversationId) return;
        const q = query(
            collection(db, `conversations/${conversationId}/messages`),
            orderBy('timestamp', 'asc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [conversationId]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !recipient) return;

        const conversationRef = doc(db, 'conversations', conversationId!);
        await setDoc(conversationRef, { participants: [user._id, recipient] }, { merge: true });

        await addDoc(collection(conversationRef, 'messages'), {
            text: newMessage,
            timestamp: new Date(),
            sender: user._id,
            read: false,
        });
        setNewMessage('');
    };

    useEffect(() => {
        getAllUsers();
        getUnreadCounts();

        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    useEffect(() => {
        const conversationsQuery = query(collection(db, 'conversations'));
        const unsubscribe = onSnapshot(conversationsQuery, async (snapshot) => {
            const freshCounts: { [key: string]: number } = {};

            for (const change of snapshot.docChanges()) {
                const { participants } = change.doc.data();
                const otherUserId = participants.find((id: string) => id !== user._id);
                if (otherUserId && otherUserId !== recipient) {
                    const messagesQuery = query(
                        collection(db, `conversations/${change.doc.id}/messages`),
                        where('read', '==', false),
                        where('sender', '!=', user._id)
                    );
                    const messagesSnapshot = await getDocs(messagesQuery);
                    freshCounts[otherUserId] = messagesSnapshot.size;
                }
            }

            setUnreadCounts((prev) => ({ ...prev, ...freshCounts }));
        });

        return () => unsubscribe();
    }, [recipient]);

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1000);
    };

    const handleEmojiClick = (emojiData: { emoji: string }) => {
        setNewMessage((prev) => prev + emojiData.emoji);
    };

    const getAllUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GETALLUSERS_CHAT);
            if (response.data?.length > 0) {
                setAllUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };


    const getUnreadCounts = async () => {
        try {
            const counts: { [key: string]: number } = {};
            const conversationsQuery = query(collection(db, 'conversations'));
            const conversationsSnapshot = await getDocs(conversationsQuery);

            for (const docSnapshot of conversationsSnapshot.docs) {
                const { participants } = docSnapshot.data();
                const otherUserId = participants.find((id: string) => id !== user._id);

                if (otherUserId) {
                    const messagesQuery = query(
                        collection(db, `conversations/${docSnapshot.id}/messages`),
                        where('read', '==', false),
                        where('sender', '!=', user._id)
                    );
                    const messagesSnapshot = await getDocs(messagesQuery);
                    counts[otherUserId] = messagesSnapshot.size;
                }
            }

            setUnreadCounts(counts);
        } catch (error) {
            console.error('Error fetching unread message counts:', error);
        }
    };



    const markMessagesAsRead = async () => {
        if (!conversationId || !recipient) return;

        try {
            const messagesQuery = query(
                collection(db, `conversations/${conversationId}/messages`),
                where('read', '==', false),
                where('sender', '==', recipient)
            );
            const messagesSnapshot = await getDocs(messagesQuery);

            const batch = writeBatch(db);
            messagesSnapshot.forEach((doc) => {
                batch.update(doc.ref, { read: true });
            });

            await batch.commit();

            setUnreadCounts((prev) => {
                const updatedCounts = { ...prev };
                delete updatedCounts[recipient];
                return updatedCounts;
            });
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };



    const handleUserClick = async (userId: string) => {
        setRecipient(userId);
        setActiveUser(allUsers.find((user: any) => user._id === userId));
        setIsSidebarOpen(false);
        await markMessagesAsRead();
    };


    const filteredUsers = allUsers.filter((user: any) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (date: Date) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    const renderMessages = () => {
        let lastDate: string | null = null;

        return messages.map((msg, index) => {
            const msgDate = new Date(msg.timestamp?.toDate?.() || msg.timestamp);
            const formattedDate = formatDate(msgDate);
            const showDateSeparator = lastDate !== formattedDate;

            lastDate = formattedDate;

            return (
                <React.Fragment key={msg.id}>
                    {showDateSeparator && (
                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="px-4 text-sm text-gray-500">{formattedDate}</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>
                    )}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`mb-3 flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.sender !== user._id && (
                            <img
                                src={activeUser?.profileImageUrl || defaultAvatar}
                                alt={activeUser?.name}
                                className="w-8 h-8 rounded-full mr-2 self-end"
                            />
                        )}
                        <div
                            className={`relative max-w-xs p-3 rounded-2xl shadow-md ${msg.sender === user._id
                                ? 'bg-[#007AFF] text-white rounded-tr-none'
                                : 'bg-gray-300 text-gray-900 rounded-tl-none'
                                }`}
                        >
                            <p className="mb-1 text-sm">{msg.text}</p>
                            <span
                                className={`text-xs bottom-1 right-2 ${msg.sender === user._id ? 'text-white' : 'text-gray-500'
                                    }`}
                            >
                                {msgDate.toLocaleTimeString()}
                            </span>
                        </div>
                    </motion.div>
                </React.Fragment>
            );
        });
    };

    return (
        <DashboardLayout activeMenu="Chat">
            <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
                <div className={`lg:w-1/4 bg-white p-4 border-r-gray-600 overflow-y-auto lg:block`}>
                    <h3 className="text-lg font-semibold mb-4">Users</h3>

                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 pl-10 border rounded-lg w-full focus:outline-none input-box"
                        />
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex justify-center items-center mt-52">
                                <SyncLoader size={5} color="#1368EC" />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="flex justify-center items-center mt-52">
                                <p className="text-gray-500 text-center text-sm">No users found</p>
                            </div>
                        ) : (
                            filteredUsers.map((user: any) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserClick(user._id)}
                                    className={`flex items-center p-3 cursor-pointer rounded-lg transition-all duration-300 
                ${activeUser?._id === user._id ? 'bg-[#F1F1F1] text-[#000000]' : 'hover:bg-gray-100'}`}
                                >
                                    <div className="relative w-12 h-12 mr-4">
                                        <img
                                            src={user.profileImageUrl || defaultAvatar}
                                            alt={user.name || 'User'}
                                            className="w-full h-full rounded-full object-cover"
                                            onError={(e) => (e.currentTarget.src = defaultAvatar)}
                                        />
                                        {user.isOnline && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                        {unreadCounts[user._id] > 0 && (
                                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
                                                {unreadCounts[user._id]}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-[500] text-sm truncate">{user.name || 'Unknown User'}</p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.lastLogin
                                                ? `${formatDistanceToNow(new Date(user.lastLogin))} ago`
                                                : 'Start a conversation'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>

                <div className="w-full lg:w-3/4 flex flex-col">
                    {activeUser ? (
                        <>
                            <div className="flex items-center p-4 border-b-gray-200 bg-white">
                                <img
                                    src={activeUser?.profileImageUrl || defaultAvatar}
                                    alt={activeUser?.name}
                                    className="w-10 h-10 rounded-full mr-4"
                                />
                                <div>
                                    <p className="font-semibold">{activeUser?.name || activeUser?._id}</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-sm scrollbar-hidden">
                                {renderMessages()}
                            </div>

                            {isTyping && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[11px] text-gray-500 mt-2"
                                >
                                    Someone is typing...
                                </motion.p>
                            )}

                            <div className="flex items-center p-4 bg-white border-t-gray-600">
                                <button
                                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                                    className="p-2 bg-gray-200 rounded-lg mr-2"
                                >
                                    😊
                                </button>
                                {showEmojiPicker && (
                                    <div ref={emojiPickerRef} className="absolute bottom-16">
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={handleTyping}
                                    placeholder="Type a message..."
                                    className="flex-grow p-2 border rounded-lg focus:outline-none input-box"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    <IoIosSend size={20} />

                                </button> </div> </>) : (<div className="flex-1 flex items-center justify-center bg-gray-100">
                                    <p className="text-gray-500 text-center"> Select a user to start a conversation. </p> </div>)} </div> </div> </DashboardLayout>);
};
export default ChatInterface;



