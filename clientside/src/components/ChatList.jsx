import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ChatList.css";
import { FaRegComments } from "react-icons/fa";
import ChatBox from "./ChatBox"; // Import ChatBox component
import { useNavigate } from "react-router-dom";
import Navbar from "./Nav";

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const navigate = useNavigate();

    const fetchChats = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3000/api/showchatlist", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setChats(response.data); // Store chats in state
        } catch (error) {
            console.error("Error fetching chat list:", error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const handleChatClick = (chatId) => {
        setSelectedChat(chatId);
    };

    const contacts = () => {
        navigate("/contact");
    };

    return (
        <div className="container">
            <div className="left-panel">
                {/* Navbar Component */}
                <Navbar />

                <ul className="chat-list">
                    {chats.length === 0 ? (
                        <p>No chats found</p>
                    ) : (
                        chats.map((chat) => (
                            <li
                                className="chat-item"
                                key={chat.chatId}
                                onClick={() => handleChatClick(chat.otherUserId)} // Pass chatId on click
                            >
                                <img
                                    src={chat.image}
                                    alt={chat.username}
                                    className="chat-user-image"
                                />
                                <div className="chat-user-details">
                                    <span className="chat-user-name">{chat.username}</span>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
                <button className="chat-message-button" onClick={contacts}>
                    <FaRegComments />
                </button>
            </div>

            {/* Right panel displaying selected chat */}
            <div className="right-panel">
                {selectedChat ? (
                    <ChatBox chatId={selectedChat} />
                ) : (
                    <h1 className="company-name">Your Company Name</h1>
                )}
            </div>
        </div>
    );
};

export default ChatList;
