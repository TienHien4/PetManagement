import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from '../components/LoginComponent';
import HomePage from '../pages/HomePage';
import DashBoardPage from '../pages/DashBoardPage';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="login" element={<LoginComponent/>} />
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/admin" element={<DashBoardPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
