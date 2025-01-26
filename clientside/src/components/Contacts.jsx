import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Contacts.css"; // Import the CSS file
import ChatBox from "./ChatBox"; // Import ChatBox component
import { FaRegComments } from "react-icons/fa";
import logo from "../assets/logo.png";

const Contact = ({ serch }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null); // State to track the selected contact
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Track the screen width for responsive layout
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/showcontacts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setContacts(response.data.contacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts(); // Call the function to fetch contacts
  }, []); // Empty dependency array to run the effect only once after component mounts

  // Filter contacts based on the search term (serch)
  const filteredContacts = contacts.filter((contact) => {
    return (
      contact.username.toLowerCase().includes(serch.toLowerCase()) ||
      contact.about.toLowerCase().includes(serch.toLowerCase())
    );
  });

  const handleContactClick = (contact) => {
    if (screenWidth < 760) {
      // Navigate to ChatBox page with contact._id in the URL for smaller screens
      navigate(`/chat/${contact._id}`);
    } else {
      setSelectedContact(contact._id); // Set the selected contact's _id for larger screens
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

  return (
    <div className="container">
      <div className="left-panel">
        <div className="contact-list">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                className="contact-item"
                key={contact._id}
                onClick={() => handleContactClick(contact)} // Pass the contact._id
              >
                <img src={contact.image} alt="Profile" className="contact-image" />
                <div className="contact-details">
                  <span className="contact-username">{contact.username}</span>
                  <span className="contact-about">{contact.about}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No contacts found</p>
          )}
        </div>
        <button className="chat-message-button" onClick={() => navigate("/contact")}>
          <FaRegComments />
        </button>
      </div>

      {/* Conditionally display right panel */}
      {screenWidth > 760 && (
        <div className="right-panel">
          {selectedContact ? (
            <ChatBox chatId={selectedContact} />
          ) : (
            <div className="welcome-container">
              <img src={logo} alt="Company Logo" className="company-logo" />
              <h1 className="company-name">Msg-Mate</h1>
              <p className="company-description">Start chatting with your contacts now.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Contact;
