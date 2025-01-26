import React, { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import "./Login.scss";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        email,
        pass: password,
      });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        Navigate("/");
        window.location.reload()
      } else {
        alert("Incorrect password or username");
      }
    } catch {
      alert("Username or password is incorrect");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Welcome Back</h2>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="login-button"
          >
            Login
          </Button>
          <div className="links">
            <a href="/pverify" className="link">
              Forgot Password?
            </a>
            <a href="/verify" className="link">
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
