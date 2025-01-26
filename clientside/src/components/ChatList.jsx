import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ChatList.css";
import { FaRegComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Nav";
import ChatBox from "./ChatBox";
import logo from "../assets/logo.png";

const ChatList = ({ serch }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  console.log(serch);

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

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchChats();
    } else {
      navigate("/login");
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        <ul className="chat-list">
          {chats.length === 0 ? (
            <p>No chats found</p>
          ) : (
            chats
              .filter((chat) => {
                // Ensure both serch and chat.username are strings before using toLowerCase
                const searchValue = serch?.toLowerCase() || '';
                return chat.username?.toLowerCase().includes(searchValue);
              })
              .map((chat) => (
                <li
                  className="chat-item"
                  key={chat.chatId}
                  onClick={() => handleChatClick(chat.otherUserId)}
                >
                  <img src={chat.image} alt={chat.username} className="chat-user-image" />
                  <div className="chat-user-details">
                    <span className="chat-user-name">{chat.username}</span>
                    <span className="chat-last-message">{chat.lastmsg}</span>

                    {/* Show count in green circle if last sender is not the current user */}
                    {chat.lastSender !== chat.my_id && chat.count > 0 && (
                      <span className="chat-count">{chat.count}</span>
                    )}

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
            <div className="welcome-container">
              <img src={logo} alt="Company Logo" className="company-logo" />
              <h1 className="company-name">Msg-Mate</h1>
              <p className="company-description">Stay connected with the people who matter most.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatList;
