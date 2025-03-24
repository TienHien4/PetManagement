import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import DashBoardPage from '../pages/DashBoardPage';
import OAuthRedirect from '../components/OAuthRedirect';


const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/" element={<LoginPage/>} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
                <Route path="/admin" element={<DashBoardPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
