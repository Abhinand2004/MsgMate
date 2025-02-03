import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import RegisterPage from './components/Register';
import Login from './components/Login';
import OTPVerify from './components/Verify';
import PassChange from './components/PassChange';
import Contact from './components/Contacts';
import ChatBox from './components/ChatBox';
import ChatList from './components/ChatList';
import Navbar from './components/Nav';
import PassVerify from './components/Passverify';
import Profile from './components/Profile';
import Receiver from './components/Reciver';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [search, setSearch] = useState('');

  return (
    <GoogleOAuthProvider clientId="105958806746-rioiiafbpp4uo7a0vtjomi239j9pb9kk.apps.googleusercontent.com">
      <AppWithNavbar setSearch={setSearch} search={search} />
    </GoogleOAuthProvider>
  );
}

function AppWithNavbar({ setSearch, search }) {
  const location = useLocation();
  const noNavbarPaths = ['/login', '/passchange', '/verify', '/register', '/pverify'];

  return (
    <>
      {/* Navbar should only appear on paths not in the noNavbarPaths list */}
      {!noNavbarPaths.includes(location.pathname) && <Navbar setSearch={setSearch} />}

      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<OTPVerify />} />
        <Route path="/passchange" element={<PassChange />} />
        {/* Pass the correct prop name 'search' */}
        <Route path="/contact" element={<Contact search={search} />} />
        <Route path="/chat/:id" element={<ChatBox />} />
        {/* Pass the correct prop name 'search' */}
        <Route path="/" element={<ChatList search={search} />} />
        <Route path="/pverify" element={<PassVerify />} />

        {/* Protected Routes */}
        {/* <Route element={<ProtectedRoute isAuthenticated={true} />}> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/receiver/:id" element={<Receiver />} />
        {/* </Route> */}
      </Routes>
    </>
  );
}

export default App;
