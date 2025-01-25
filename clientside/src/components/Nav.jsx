import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Nav.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(""); // State to store the profile image
  const [username, setUsername] = useState(""); // State to store the username

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/navdata", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.status === 200) {
        console.log(response.data);
        
        setProfileImage(response.data.data.image); 
        setUsername(response.data.data.username);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        <div className="navbar-search">
          <input type="text" className="search-input" placeholder="Search..." />
        </div>

        <div className="navbar-profile">
          <img
            src={profileImage || "/default-profile.jpg"} 
            alt={username || "Profile"} 
            className="profile-image"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div className="dropdown-menu">
              <div className="dropdown-item"><Link to={"/profile"}>{ "Profile"}</Link></div>
              <div className="dropdown-item" onClick={logout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
