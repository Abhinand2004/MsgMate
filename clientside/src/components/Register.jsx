import React, { useState } from 'react';
import axios from 'axios'; 
import './Register.css';
import { Navigate, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const   Navigate=useNavigate()
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
            if (response.status==200) {
                Navigate("/login")
            }else{
                alert("something went wrong")
                
            }
        } catch (error) {
            alert("something went wrong try again")
            console.error('There was an error registering the user!', error);
        }
    };
    const loginnavigate=()=>{
        Navigate("/login")
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-heading">Register</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="form-input"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            className="form-input"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="pwd">Password</label>
                        <input
                            type="password"
                            name="pwd"
                            id="pwd"
                            className="form-input"
                            placeholder="Enter password"
                            value={formData.pwd}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="cpwd">Confirm Password</label>
                        <input
                            type="password"
                            name="cpwd"
                            id="cpwd"
                            className="form-input"
                            placeholder="Confirm password"
                            value={formData.cpwd}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group image-upload">
                        <label className="form-label" htmlFor="image">Profile Image</label>
                        <input
                            type="file"
                            id="image"
                            className="form-input-file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {image && <img src={image} alt="Selected" className="image-preview" />}
                    </div>

                    <div className="button-group">
                        <button type="submit" className="register-button">Register</button>
                        <button type="button" className="login-button" onClick={loginnavigate}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
