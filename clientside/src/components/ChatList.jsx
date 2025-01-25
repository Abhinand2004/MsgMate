import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ChatList.css";
import { FaRegComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Nav";
import ChatBox from "./ChatBox";

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const navigate = useNavigate();

    // Fetch chat list
    const fetchChats = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3000/api/showchatlist", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const formattedChats = response.data.map((chat) => ({
                ...chat,
                time: new Date(chat.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }));
            setChats(formattedChats);
        } catch (error) {
            console.error("Error fetching chat list:", error);
        }
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchChats();
    }, []);

    const handleChatClick = (id) => {
        if (screenWidth <= 760) {
            navigate(`/chat/${id}`);
        } else {
            setSelectedChat(id);
        }
    };

    const contacts = () => {
        navigate("/contact");
    };

    return (
        <div className="container">
            <div className="left-panel">
                <Navbar />

                <ul className="chat-list">
                    {chats.length === 0 ? (
                        <p>No chats found</p>
                    ) : (
                        chats.map((chat) => (
                            <li
                                className="chat-item"
                                key={chat.chatId}
                                onClick={() => handleChatClick(chat.otherUserId)}
                            >
                                <img
                                    src={chat.image}
                                    alt={chat.username}
                                    className="chat-user-image"
                                />
                                <div className="chat-user-details">
                                    <span className="chat-user-name">{chat.username}</span>
                                    <span className="chat-last-message">{chat.lastmsg}</span>
                                    <span className="chat-time">{chat.time}</span>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
                <button className="chat-message-button" onClick={contacts}>
                    <FaRegComments />
                </button>
            </div>

            {/* Conditionally display right panel */}
            {screenWidth > 760 && (
                <div className="right-panel">
                    {selectedChat ? (
                        <ChatBox chatId={selectedChat} />
                    ) : (
                        <h1 className="company-name">Your Company Name</h1>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatList;
