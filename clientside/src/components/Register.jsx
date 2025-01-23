import React, { useState } from 'react';
import axios from 'axios'; 
import './Register.css'; // Assuming the CSS file is in the same directory

const RegisterPage = () => {
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        pwd: '',
        cpwd: '',
        email: localStorage.getItem('email'),
        image: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result); 
            setFormData({
                ...formData,
                image: reader.result 
            });
        };

        if (file) {
            reader.readAsDataURL(file); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);

        try {
            const response = await axios.post('http://localhost:3000/api/register', formData);
        } catch (error) {
            console.error('There was an error registering the user!', error);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="pwd"
                        placeholder="Enter password"
                        value={formData.pwd}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="cpwd"
                        placeholder="Confirm password"
                        value={formData.cpwd}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {image && <img src={image} alt="Selected" className="image-preview" />}
                </div>
                <button type="submit" className="register-button">Register</button>
                <button type="button" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default RegisterPage;
