import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaPaperPlane, FaEllipsisV } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import io from "socket.io-client";
import "./ChatBox.css";
import url from "../assets/url";
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
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    };

  
    
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${url}/displaymsg/${fetchId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            if (response.status === 200) {
                updatecount()
                setLoading(false);
                setMessages(response.data.messages);
                fetchMessages()
            } else {
                alert("Failed to fetch messages.");
            }
        } catch (error) {
            setLoading(false);
        }
    };

    const fetchUserDetails = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await axios.get(
                `${url}/user/${fetchId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setUser(response.data.user);
                setMyId(response.data.my_id);
                scrollToBottom()
            } else {
                
                console.error("Failed to fetch user details", response.status);
            }
        } catch (error) {
            setError("Error fetching user details. Please try again.");
            console.error("Error fetching user details:", error);
        }
    };

    const initializeChatList = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }
            const response = await axios.post(  `${url}/createchatlist/${fetchId}`, {}, {  headers: { Authorization: `Bearer ${token}` },} );
            if (response.status === 200) {
                socket.current.emit("chat message", message);

                console.log("Chat list initialized successfully.");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log("Chat list already exists.");
            } else {
                console.error("Error initializing chat list:", error);
            }
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
            if (messages.length === 0) {
                await initializeChatList();
            }

            await axios.post(
                `${url}/sendmsg/${fetchId}`,
                { message: messageContent },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            fetchMessages()
            updatecount()
            updatelastmessage()
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage("");
            scrollToBottom();

            socket.current.emit("chat message", message);
        } catch (error) {
            setError("Failed to send message. Please try again.");
            console.error("Failed to send message:", error);
        }
    };

    const handleSend = () => {
        sendMessage(newMessage);
        updatecount()
        updatelastmessage();
        scrollToBottom();
    };

    const updatelastmessage = async () => {
        try {
       const res=await axios.put( `${url}/setlastmsg/${fetchId}`,{ },{ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }  );
            if (res.status==200) {
                console.log("sucess");
                scrollToBottom()
            }else{
               console.log("error updatin");
               
            }
        } catch (error) {
            console.error("Error updating unseen message count:", error);
        }
    };
    
    const updatecount = async () => {
        try {


       const res=await axios.put(  `${url}/setcount/${fetchId}`,{ }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } } );
            if (res.status==200) {
                // console.log("sucess");
                // scrollToBottom()
            }else{
                
            }
        } catch (error) {
            console.error("Error updating unseen message count:", error);
        }
    };
    

    const handleChange = (e) => {
        setNewMessage(e.target.value);
    };

   

    const markMessagesAsSeen = async () => {
        try {
       const res=     await axios.put(
                `${url}/setseen/${fetchId}`, {}, {    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },}
            );

            if (res.status==200) {
                // scrollToBottom()
            }
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



    useEffect(() => {
        socket.current = io("http://localhost:3000", { transports: ["websocket"] });
    
        socket.current.on("connect", () => {
            console.log("User connected with socket id:", socket.current.id);
        });


        socket.current.on("chat message", (msg) => {
            if (msg.sender_id !== my_id) {
                setMessages((prevMessages) => [...prevMessages, msg]);
            }
        });
    
        socket.current.on("disconnect", () => {
            console.log("User disconnected");
        });
    
        fetchMessages();
        socket.current.on("disconnect", () => {
            console.log("User disconnected");
        });
        fetchMessages();
        scrollToBottom()
        return () => {
            socket.current.disconnect();
        };
    }, [fetchId]); 
    

    useEffect(() => {
        markMessagesAsSeen()
     }, [messages]);
     useEffect(() => {
         fetchUserDetails(); 
         scrollToBottom();
     }, [socket.current]);
 
     const godown=()=>{
        scrollToBottom()
     }
     




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
                                                <span className="seen-tick">✔</span>
                                            ) : (
                                                <span className="sent-tick">✔✔</span>
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
                <FaArrowDown size={24} color="green" className="arrow" onClick={godown}/>
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
    