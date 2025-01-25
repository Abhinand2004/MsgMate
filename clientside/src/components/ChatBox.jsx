import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaPaperPlane, FaEllipsisV } from "react-icons/fa";
import io from "socket.io-client";
import "./ChatBox.css";

const ChatBox = ({ chatId }) => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState({});
    const [my_id, setMyId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const socket = useRef(null);

    const fetchId = id || chatId;

    useEffect(() => {
        socket.current = io("http://localhost:3000");

        socket.current.on("chat message", (msg) => {
            if (msg.sender_id !== my_id) {
                setMessages((prevMessages) => [...prevMessages, msg]);
            }
            scrollToBottom();
        });

        fetchMessages();
        fetchUserDetails();
        markMessagesAsSeen();

        return () => {
            socket.current.disconnect();
        };
    }, [my_id]);

    useEffect(() => {
        if (messagesEndRef.current) {
            scrollToBottom();
        }
    }, [messages]);

    // Scroll to the bottom when the component mounts
    useEffect(() => {
        scrollToBottom();
    }, []); 

    const fetchMessages = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/displaymsg/${fetchId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            setMessages(response.data.messages);
            setLoading(false);
            scrollToBottom(); // Ensure scroll to bottom after messages are fetched
        } catch (error) {
            setError("Error fetching messages. Please try again.");
            setLoading(false);
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
            const response = await axios.get(`http://localhost:3000/api/user/${fetchId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setUser(response.data.user);
                setMyId(response.data.my_id);
            } else {
                console.error("Failed to fetch user details", response.status);
            }
        } catch (error) {
            setError("Error fetching user details. Please try again.");
            console.error("Error fetching user details:", error);
        }
    };

    const sendMessage = async (messageContent) => {
        if (messageContent.trim() === "" || my_id === null) return;

        const message = {
            sender_id: my_id,
            message: messageContent,
            time: new Date().toISOString(),
            seen: false,
        };

        try {
            await axios.post(
                `http://localhost:3000/api/sendmsg/${fetchId}`,
                { message: messageContent },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage("");
            scrollToBottom();

            socket.current.emit("chat message", message);
        } catch (error) {
            setError("Failed to send message. Please try again.");
            console.error("Failed to send message:", error);
        }
    };
    const updatelastmessage = async (id) => {
        try {
            await axios.put(
                `http://localhost:3000/api/setlastmsg/${fetchId}`,
                { chatid: chatId }, // Body now correctly sends receiverId
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
        } catch (error) {
            console.error("Error updating unseen message count:", error);
        }
    };

    const handleSend = () => {
        sendMessage(newMessage);
        updatelastmessage()
        scrollToBottom();
    };

    const handleChange = (e) => {
        setNewMessage(e.target.value);
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50); 
    };

    const markMessagesAsSeen = async () => {
        try {
            await axios.put(
                `http://localhost:3000/api/setseen/${fetchId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
        } catch (error) {
            setError("Error marking messages as seen.");
            console.error("Error marking messages as seen:", error);
        }
    };

    const formatTime = (timestamp) => {
        const messageTime = new Date(timestamp);
        const hours = messageTime.getHours();
        const minutes = messageTime.getMinutes();
        const isAM = hours < 12;
        return `${hours % 12 || 12}:${minutes < 10 ? "0" : ""}${minutes} ${isAM ? "AM" : "PM"}`;
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
                {loading ? (
                    <p>Loading...</p>
                ) : messages.length === 0 ? (
                    <p>No messages yet</p>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.sender_id === my_id ? "sent" : "received"}`}
                        >
                            <p>{msg.message}</p>

                            <div className="message-footer">
                                <small>{formatTime(msg.time)}</small>

                                {msg.sender_id === my_id && (
                                    <div className="tick-marks">
                                        <span className="tick">
                                            {msg.seen ? (
                                                <span className="seen-tick">✔✔</span> 
                                            ) : (
                                                <span className="sent-tick">✔</span> 
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
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
