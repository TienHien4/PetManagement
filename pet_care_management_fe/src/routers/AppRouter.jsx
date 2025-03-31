import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import OAuthRedirect from '../components/OAuthRedirect';
import RegisterPage from '../pages/RegisterPage';
import PetManagementPage from '../pages/PetManagementPage';
import CreatePetForm from '../pages/CreatePetForm';
import Dashboard from '../pages/DashboardPage';
import UserManagementPage from '../pages/UserManagementPage';


const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage></RegisterPage>} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
                <Route path="/admin/usermanagement" element={<UserManagementPage></UserManagementPage> }/>
                <Route path="/admin/petmanagement" element={<PetManagementPage></PetManagementPage>} />
                <Route path="/admin" element={<Dashboard></Dashboard>} />
                <Route path="/admin/addPet" element={<CreatePetForm></CreatePetForm>} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
