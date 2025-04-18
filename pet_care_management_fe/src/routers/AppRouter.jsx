import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from '../pages/login/LoginPage';
import HomePage from '../pages/HomePage';
import OAuthRedirect from '../components/OAuthRedirect';
import RegisterPage from '../pages/login/RegisterPage';
import PetManagementPage from '../pages/admin/PetManagementPage';
import CreatePetForm from '../pages/admin/CreatePetForm';
import Dashboard from '../pages/admin/DashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ServicesPage from '../pages/ServicesPage';
import LoginPage from '../pages/login/LoginPage';
import PetList from '../pages/Profile/PetList';
import Schedule from '../pages/Profile/Schedule';
import ChangePassword from '../pages/Profile/ChangePassword';
import Notifications from '../pages/Profile/Notifications';
import UserInformation from '../pages/Profile/UserInformation';


const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage></LoginPage>} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage></RegisterPage>} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
                <Route path="/admin/usermanagement" element={<UserManagementPage></UserManagementPage>} />
                <Route path="/admin/petmanagement" element={<PetManagementPage></PetManagementPage>} />
                <Route path="/admin" element={<Dashboard></Dashboard>} />
                <Route path="/admin/addPet" element={<CreatePetForm></CreatePetForm>} />
                <Route path='/services' element={<ServicesPage></ServicesPage>} />
                <Route path="/user/profile" element={<UserInformation></UserInformation>} />
                <Route path="/user/pets" element={<PetList></PetList>} />
                <Route path="/user/schedule" element={<Schedule></Schedule>} />
                <Route path="/user/changePassword" element={<ChangePassword></ChangePassword>} />
                <Route path="/user/notifications" element={<Notifications></Notifications>} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
