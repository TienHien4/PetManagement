import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleBasedRedirect = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('accessToken'); // Changed from 'token' to 'accessToken'

        console.log('RoleBasedRedirect - Token:', token ? 'exists' : 'missing');
        console.log('RoleBasedRedirect - User:', user);

        if (!token) {
            console.log('No token, redirecting to login');
            navigate('/login');
            return;
        }

        if (user.roles && Array.isArray(user.roles)) {
            if (user.roles.includes('VET')) {
                console.log('VET role detected, redirecting to /vet/dashboard');
                navigate('/vet/dashboard');
            } else if (user.roles.includes('ADMIN')) {
                console.log('ADMIN role detected, redirecting to /admin');
                navigate('/admin');
            } else if (user.roles.includes('USER')) {
                console.log('USER role detected, redirecting to /home');
                navigate('/home');
            } else {
                console.log('Unknown role, redirecting to /home');
                navigate('/home');
            }
        } else {
            console.log('No roles found, redirecting to /home');
            navigate('/home');
        }
    }, [navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default RoleBasedRedirect;
