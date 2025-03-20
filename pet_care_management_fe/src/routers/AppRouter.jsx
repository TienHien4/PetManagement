import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from '../components/LoginComponent';
import HomePage from '../pages/HomePage';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/" element={<LoginComponent />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
