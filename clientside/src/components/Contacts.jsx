import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Contacts.css'; // Import the CSS file
import ChatBox from './ChatBox'; // Import ChatBox component
import Navbar from "./Nav";

const Contact = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null); // State to track the selected contact
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/showcontacts", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setContacts(response.data.contacts);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };

        fetchContacts();  // Call the function to fetch contacts
    }, []);  // Empty dependency array to run the effect only once after component mounts

    const handleContactClick = (contact) => {
        const screenWidth = window.innerWidth; // Get the current screen width
        if (screenWidth < 760) {
            // Navigate to ChatBox page with contact._id in the URL for smaller screens
            navigate(`/chat/${contact._id}`);
        } else {
            setSelectedContact(contact._id); // Set the selected contact's _id for larger screens
        }
    };

    return (
        <div className="container">
            <div className="left-panel">
                <Navbar />
                <div className="contact-list">
                    {contacts.map(contact => (
                        <div 
                            className="contact-card" 
                            key={contact._id} 
                            onClick={() => handleContactClick(contact)}  // Pass the contact._id
                        >
                            <img src={contact.image} alt="Profile" className="profile-photo" />
                            <div className="contact-info">
                                <h2 className="username">{contact.username}</h2>
                                <p className="about">{contact.about}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="right-panel">
                {selectedContact ? (
                    <ChatBox chatId={selectedContact} />  
                ) : (
                    <h1 className="company-name">Your Company Name</h1>
                )}
            </div>
        </div>
    );
};

export default Contact;
