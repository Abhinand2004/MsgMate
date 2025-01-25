import React, { useEffect, useState } from "react";
import Navbar from "./Nav";
import "./Profile.scss"; // Reuse the existing styles
import { useParams } from "react-router-dom";

const Receiver = () => {
    const [receiverData, setReceiverData] = useState({ image: "", username: "", about: "", email: "", phone: "" });
    const {id}=useParams()
    console.log(id);
    
    const fetchReceiverData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/reciver/${id}`);
            if (response.ok) {
                const data = await response.json();
                setReceiverData(data);
            } else {
                console.error("Failed to fetch receiver data");
            }
        } catch (error) {
            console.error("Error fetching receiver data:", error);
        }
    };

    useEffect(() => {
        fetchReceiverData();
    }, []);

    return (
        <div className="profile-container">
            <div className="left-panel">
                <div className="profile-card">
                    <div className="profile-image">
                        <img
                            src={receiverData.image || "https://via.placeholder.com/150"}
                            alt="Profile"
                        />
                    </div>
                    <div className="profile-details">
                        <div className="profile-field">
                            <label>Username:</label>
                            <span>{receiverData.username}</span>
                        </div>
                        <div className="profile-field">
                            <label>About:</label>
                            <span>{receiverData.about}</span>
                        </div>
                        <div className="profile-field">
                            <label>Email:</label>
                            <span>{receiverData.email}</span>
                        </div>
                        <div className="profile-field">
                            <label>Phone :</label>
                            <span>{receiverData.phone}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-panel">
                <h1 className="company-name">Receiver Details</h1>
            </div>
        </div>
    );
};

export default Receiver;
