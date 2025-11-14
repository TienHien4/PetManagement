import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../services/customizeAxios';
import './FloatingChatButton.css';

const FloatingChatButton = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Kiểm tra đăng nhập mỗi khi đổi route
    useEffect(() => {
        const checkLoginStatus = () => {
            const userData = localStorage.getItem('user');
            setIsLoggedIn(!!userData && userData !== 'null');
        };

        checkLoginStatus();

        // Listen to storage changes (when logout happens in another tab or token expires)
        window.addEventListener('storage', checkLoginStatus);

        // Also check periodically in case of same-tab changes
        const interval = setInterval(checkLoginStatus, 1000);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
            clearInterval(interval);
        };
    }, [location.pathname]);

    // Tải số tin nhắn chưa đọc
    useEffect(() => {
        const loadUnreadCount = async () => {
            const userData = localStorage.getItem('user');
            if (!userData || userData === 'null') return;

            try {
                const user = JSON.parse(userData);
                if (!user.userId) return;

                const response = await apiClient.get(`/api/chat/unread/${user.userId}`);
                setUnreadCount(response.data || 0);
            } catch (error) {
                console.error('Error loading unread count:', error);
                // If token expired, apiClient will handle redirect to login
            }
        };

        if (isLoggedIn) {
            loadUnreadCount();
            const interval = setInterval(loadUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [isLoggedIn]);

    const handleChatClick = () => {
        const userData = localStorage.getItem('user');
        if (!userData || userData === 'null') {
            alert('Vui lòng đăng nhập để sử dụng chat');
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(userData);
            if (!user.userId) {
                alert('Vui lòng đăng nhập để sử dụng chat');
                navigate('/login');
                return;
            }

            const roles = user.roles || [];
            if (roles.includes('VET')) {
                navigate('/vet/chat');
            } else if (roles.includes('USER') || roles.includes('ADMIN')) {
                navigate('/user/chat');
            } else {
                alert('Không xác định được vai trò người dùng');
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
        }
    };

    // Ẩn nút chat nếu chưa đăng nhập hoặc đang ở trang login/register
    if (!isLoggedIn || location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    return (
        <div className="floating-chat-container">
            <button
                className="floating-chat-button"
                onClick={handleChatClick}
                aria-label="Open chat"
                title="Chat với bác sĩ"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                        fill="white"
                    />
                    <path d="M6 9H18V11H6V9ZM6 12H15V14H6V12Z" fill="#4CAF50" />
                </svg>

                {unreadCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            borderRadius: '50%',
                            minWidth: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            border: '2px solid white',
                            padding: '0 6px',
                        }}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default FloatingChatButton;
