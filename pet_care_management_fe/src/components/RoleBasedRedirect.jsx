import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleBasedRedirect = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        if (user.roles) {
            if (user.roles.includes('VET')) {
                navigate('/vet/dashboard');
            } else if (user.roles.includes('ADMIN')) {
                navigate('/admin');
            } else if (user.roles.includes('USER')) {
                navigate('/home');
            } else {
                navigate('/home');
            }
        } else {
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
