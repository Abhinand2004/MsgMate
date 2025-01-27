import React, { useState } from 'react';
import axios from 'axios'; 
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import url from '../assets/url';
import './Register.css';

const RegisterPage = () => {
    const navigate = useNavigate();
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

        try {
            const response = await axios.post(`${url}/register`, formData);
            if (response.status === 200) {
                navigate('/login');
            } else {
                alert('Something went wrong');
            }
        } catch (error) {
            alert('Something went wrong, try again');
            console.error('There was an error registering the user!', error);
        }
    };

    const loginnavigate = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-heading">Register</h2>
                
                <form className="register-form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        variant="standard"
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        fullWidth
                        variant="standard"
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        fullWidth
                        variant="standard"
                        label="Password"
                        type="password"
                        name="pwd"
                        value={formData.pwd}
                        onChange={handleInputChange}
                        required
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        fullWidth
                        variant="standard"
                        label="Confirm Password"
                        type="password"
                        name="cpwd"
                        value={formData.cpwd}
                        onChange={handleInputChange}
                        required
                        sx={{ marginBottom: 2 }}
                    />

                    <div className="form-group image-upload">
                        <label htmlFor="image" className="image-upload-label">Profile Image</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="image">
                            <div className="image-upload-button">Upload Image</div>
                        </label>
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
