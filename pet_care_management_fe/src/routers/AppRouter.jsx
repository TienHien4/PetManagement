import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from '../pages/login/LoginPage';
import HomePage from '../pages/HomePage';
import OAuthRedirect from '../components/OAuthRedirect';
import RegisterPage from '../pages/login/RegisterPage';
import PetManagementPage from '../pages/admin/PetManagementPage';
import CreatePetForm from '../pages/Profile/CreatePetForm';
import EditPetForm from '../pages/Profile/EditPetForm';
import Dashboard from '../pages/admin/DashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ServicesPage from '../pages/ServicesPage';
import LoginPage from '../pages/login/LoginPage';
import PetList from '../pages/Profile/PetList';
import Schedule from '../pages/Profile/Schedule';
import ChangePassword from '../pages/Profile/ChangePassword';
import UserInformation from '../pages/Profile/UserInformation';
import ProductPage from '../pages/products/productPage';
import ShoppingCart from '../pages/cart/ShoppingCart';
import OrderManagement from '../pages/admin/OrderManagement';
import Order from '../pages/Profile/Order';
import AboutPage from '../pages/AboutPage';
import NewsPage from '../pages/NewsPage';
import ContactPage from '../pages/ContactPage';
import HealthDashboard from '../pages/Profile/HealthDashboard';
import AddHealthRecord from '../pages/Profile/AddHealthRecord';
import PetHealth from '../pages/Profile/PetHealth';


const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage></LoginPage>} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage></RegisterPage>} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
                <Route path="/admin/usermanagement" element={<UserManagementPage></UserManagementPage>} />
                <Route path="/admin/petmanagement" element={<PetManagementPage></PetManagementPage>} />
                <Route path="/admin" element={<Dashboard></Dashboard>} />
                <Route path="/pet/add" element={<CreatePetForm></CreatePetForm>} />
                <Route path="/pet/edit/:petId" element={<EditPetForm></EditPetForm>} />
                <Route path='/services' element={<ServicesPage></ServicesPage>} />
                <Route path="/user/profile" element={<UserInformation></UserInformation>} />
                <Route path="/user/pets" element={<PetList></PetList>} />
                <Route path="/user/schedule" element={<Schedule></Schedule>} />
                <Route path="/user/changePassword" element={<ChangePassword></ChangePassword>} />
                <Route path="/user/orders" element={<Order></Order>} />
                <Route path='/products' element={<ProductPage />} />
                <Route path='/shopping-cart' element={<ShoppingCart />} />
                <Route path='/admin/orders' element={<OrderManagement />} />
                <Route path="/pet/health-dashboard" element={<HealthDashboard />} />
                <Route path="/pet/health/:petId" element={<PetHealth />} />
                <Route path="/pet/health/:petId/add" element={<AddHealthRecord />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
