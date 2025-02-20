import React, { useState } from 'react';
import './App.css';
import { Navigate, Routes, Route } from 'react-router-dom';
import Login from "./components/Login"
import Homepage from './components/Homepage';
import Register from './components/Register';

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={localStorage.user? <Navigate to="/home"/> : <Navigate to="/login"/>}/>
        {/* <Route path="/" element={<Homepage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Homepage/>} />
      </Routes>
    </>
  );
}

export default App;


