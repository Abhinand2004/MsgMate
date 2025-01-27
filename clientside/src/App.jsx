import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import RegisterPage from "./components/Register";
import Login from "./components/Login";
import OTPVerify from "./components/Verify";
import PassChange from "./components/PassChange";
import Contact from "./components/Contacts";
import ChatBox from "./components/ChatBox";
import ChatList from "./components/ChatList";
import Navbar from "./components/Nav";
import PassVerify from "./components/Passverify";
import Profile from "./components/Profile";
import Receiver from "./components/Reciver";
import { useState } from 'react';

function App() {
  const [serch, setSerch] = useState("");
  
 
  return (
    <BrowserRouter>
      <Navbar setSearch={setSerch} /> 
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<OTPVerify />} />
        <Route path="/passchange" element={<PassChange />} />
        <Route path="/contact" element={<Contact serch={serch} />} />
        <Route path="/chat/:id" element={<ChatBox />} />
        <Route path="/" element={<ChatList serch={serch} />} />
        <Route path="/pverify" element={<PassVerify />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/receiver/:id" element={<Receiver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
