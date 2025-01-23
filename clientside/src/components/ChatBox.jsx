import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./ChatBox.css";
import { FaPaperPlane } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";

const ChatBox = ({ chatId }) => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState({});
    const [my_id, setMyId] = useState(null);

    useEffect(() => {
        fetchMessages();
        fetchUserDetails();
        markMessagesAsSeen();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/displaymsg/${chatId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const fetchUserDetails = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/api/user/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setUser(response.data.user);
                setMyId(response.data.my_id);
            } else {
                console.error("Failed to fetch user details", response.status);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const sendMessage = async (messageContent) => {
        if (messageContent.trim() === "" || my_id === null) return;

        const message = {
            sender_id: my_id,
            message: messageContent,
            time: new Date().toISOString(),
        };

        try {
            // Send the message
            await axios.post(
                `http://localhost:3000/api/sendmsg/${chatId}`,
                { message: messageContent },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            // Update the unseen message count for the receiver
            await updateMessageCount(user._id);

            // Create the chat list only if it's the first message sent
            if (messages.length === 0) {
                await initializeChatList(); // Create chat list when the first message is sent
            }

            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message or update count:", error);
        }
    };

    const initializeChatList = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:3000/api/createchatlist/${chatId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log("Chat list already exists");
            } else {
                console.error("Error initializing chat list:", error);
            }
        }
    };

    const markMessagesAsSeen = async () => {
        try {
            await axios.put(`http://localhost:3000/api/setseen/${chatId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
        } catch (error) {
            console.error("Error marking messages as seen:", error);
        }
    };

    const updateMessageCount = async (id) => {
        try {
            await axios.put(
                `http://localhost:3000/api/setcount/${chatId}`,
                { chatid: chatId }, // Body now correctly sends receiverId
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
        } catch (error) {
            console.error("Error updating unseen message count:", error);
        }
    };

    const handleSend = () => {
        sendMessage(newMessage);
    };

    const handleChange = (e) => {
        setNewMessage(e.target.value);
    };

    return (
        <div className="chat-box-fullscreen">
            <Link to={`/receiver/${user._id}`}>
                <div className="chat-header">
                    <div className="chat-user-info">
                        <img src={user.image} alt={user.username} className="chat-user-photo" />
                        <span className="chat-username">{user.username}</span>
                    </div>
                    <FaEllipsisV className="dropdown-icon" />
                </div>
            </Link>

            <div className="messages-list">
                {messages.length === 0 ? (
                    <p>No messages yet</p>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.sender_id === my_id ? "sent" : "received"}`}
                        >
                            <p>{msg.message}</p>
                            <small>{new Date(msg.time).toLocaleString()}</small>
                        </div>
                    ))
                )}
            </div>

            <div className="message-box">
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleChange}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button onClick={handleSend} className="send-btn">
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
