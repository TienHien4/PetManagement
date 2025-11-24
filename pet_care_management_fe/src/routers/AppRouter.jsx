import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from '../pages/login/LoginPage';
import HomePage from '../pages/HomePage';
import OAuthRedirect from '../components/OAuthRedirect';
import RegisterPage from '../pages/login/RegisterPage';
import PetManagementPage from '../pages/admin/PetManagementPage';
import ProductManagementPage from '../pages/admin/ProductManagementPage';
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

// VET Components
import VetLayout from '../pages/vet/VetLayout';
import VetDashboard from '../pages/vet/VetDashboard';
import VetAppointments from '../pages/vet/VetAppointments';

import UserChat from '../pages/Profile/UserChat';
import VetChat from '../pages/vet/VetChat';

// Floating Chat Button
import FloatingChatButton from '../components/FloatingChatButton';

// Payment Components
import VNPayReturn from '../pages/Payment/VNPayReturn';

// Route Components
import ProtectedRoute from '../components/ProtectedRoute';
import RoleBasedRedirect from '../components/RoleBasedRedirect';


const AppRouter = () => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage></LoginPage>} />
                <Route path="/" element={<RoleBasedRedirect />} />
                <Route path="/register" element={<RegisterPage></RegisterPage>} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/oauth2/redirect" element={<OAuthRedirect />} />

                {/* Admin Routes */}
                <Route path="/admin/usermanagement" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <UserManagementPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/petmanagement" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <PetManagementPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/productmanagement" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <ProductManagementPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path='/admin/orders' element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <OrderManagement />
                    </ProtectedRoute>
                } />

                {/* User Routes */}
                <Route path="/pet/add" element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <CreatePetForm />
                    </ProtectedRoute>
                } />
                <Route path="/pet/edit/:petId" element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <EditPetForm />
                    </ProtectedRoute>
                } />
                <Route path='/services' element={<ServicesPage />} />
                <Route path="/user/profile" element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <UserInformation />
                    </ProtectedRoute>
                } />
                <Route path="/user/pets" element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <PetList />
                    </ProtectedRoute>
                } />
                <Route path="/user/schedule" element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <Schedule />
                    </ProtectedRoute>
                } />
                <Route path="/user/changePassword" element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <ChangePassword />
                    </ProtectedRoute>
                } />
                <Route path="/user/orders" element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <Order />
                    </ProtectedRoute>
                } />
                <Route path='/products' element={<ProductPage />} />
                <Route path='/shopping-cart' element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <ShoppingCart />
                    </ProtectedRoute>
                } />
                <Route path="/pet/health-dashboard" element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <HealthDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/pet/health/:petId" element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <PetHealth />
                    </ProtectedRoute>
                } />
                <Route path="/pet/health/:petId/add" element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <AddHealthRecord />
                    </ProtectedRoute>
                } />
                <Route path="/user/chat" element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                        <UserChat />
                    </ProtectedRoute>
                } />

                <Route path="/vet/chat" element={
                    <ProtectedRoute allowedRoles={['VET']}>
                        <VetChat />
                    </ProtectedRoute>
                } />
                <Route path="/payment/vnpay-return" element={<VNPayReturn />} />


                {/* VET Routes */}
                <Route path="/vet" element={
                    <ProtectedRoute allowedRoles={['VET']}>
                        <VetLayout />
                    </ProtectedRoute>
                }>
                    <Route path="dashboard" element={<VetDashboard />} />
                    <Route path="appointments" element={<VetAppointments />} />
                </Route>

                {/* Unauthorized page */}
                <Route path="/unauthorized" element={
                    <div className="container text-center mt-5">
                        <h1>403 - Unauthorized</h1>
                        <p>Bạn không có quyền truy cập trang này.</p>
                    </div>
                } />
            </Routes>

            {/* Show floating chat button only for logged-in users */}
            {user && (user.userId || user.id) && <FloatingChatButton />}
        </Router>
    );
};

export default AppRouter;
