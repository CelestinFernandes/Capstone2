// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Prediction from '../pages/Prediction';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import HomePage from '../pages/HomePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/prediction" element={<Prediction />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/homepage" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;