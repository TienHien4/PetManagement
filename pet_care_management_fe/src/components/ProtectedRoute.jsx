import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const token = localStorage.getItem('accessToken'); // Changed from 'token' to 'accessToken'
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    console.log('ProtectedRoute - Token:', token ? 'exists' : 'missing');
    console.log('ProtectedRoute - User:', user);
    console.log('ProtectedRoute - Allowed roles:', allowedRoles);

    if (!token) {
        console.log('No token found, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && user.roles) {
        const hasRole = allowedRoles.some(role => user.roles.includes(role));
        console.log('Role check - hasRole:', hasRole, 'user.roles:', user.roles);
        if (!hasRole) {
            console.log('User does not have required role, redirecting to unauthorized');
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
