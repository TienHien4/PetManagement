// src/pages/Profile/UserChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/customizeAxios';
import WebSocketService from '../../services/WebSocketService';
import './UserChat.css';

const UserChat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [vets, setVets] = useState([]);
    const [isConnecting, setIsConnecting] = useState(true);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Helper function to get user ID (handle both 'id' and 'userId' fields)
    const getUserId = (user) => user?.userId || user?.id;

    useEffect(() => {
        const userId = getUserId(currentUser);
        if (!userId) {
            console.error('No user found in localStorage');
            return;
        }

        loadConversations();
        loadVets();

        WebSocketService.connect(userId, handleReceivedMessage);

        // Check connection status after 2 seconds
        setTimeout(() => {
            if (WebSocketService.isConnected()) {
                setIsConnecting(false);

            } else {
                console.warn('WebSocket still connecting...');
                // Check again after 3 more seconds
                setTimeout(() => {
                    setIsConnecting(false);
                }, 3000);
            }
        }, 2000);

        return () => {
            WebSocketService.disconnect();
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadConversations = async () => {
        try {
            const userId = getUserId(currentUser);
            const response = await apiClient.get(`/api/chat/conversations/user/${userId}`);
            console.log('Conversations response:', response.data);
            setConversations(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error loading conversations:', error);
            setConversations([]);
        }
    };

    const loadVets = async () => {
        try {
            const response = await apiClient.get('/api/user/vets');
            console.log('Vets response:', response.data);
            setVets(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error loading vets:', error);
            setVets([]);
        }
    };

    const loadMessages = async (conversationId) => {
        try {
            const response = await apiClient.get(`/api/chat/messages/${conversationId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const startConversation = async (vetId) => {
        try {
            const userId = getUserId(currentUser);
            const response = await apiClient.post(`/api/chat/conversations/create?userId=${userId}&vetId=${vetId}`);
            const conversationId = response.data;
            setSelectedConversation({ conversationId, vetId });
            loadMessages(conversationId);
            loadConversations();
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        if (!WebSocketService.isConnected()) {
            alert('Đang kết nối WebSocket, vui lòng thử lại sau giây lát...');
            return;
        }

        const userId = getUserId(currentUser);
        const messageContent = newMessage;
        const message = {
            conversationId: selectedConversation.conversationId,
            senderId: userId,
            senderName: currentUser.userName,
            recipientId: selectedConversation.vetId,
            content: messageContent,
            type: 'CHAT'
        };

        // Add message to UI immediately with temp timestamp
        const tempMessage = {
            ...message,
            createdAt: new Date().toISOString(),
            tempTimestamp: Date.now()
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage(''); // Clear input immediately

        // Send via WebSocket
        WebSocketService.sendMessage(message);

        // Update conversation list immediately
        loadConversations();
    };

    const handleReceivedMessage = (message) => {


        // Always update conversation list when receiving message
        loadConversations();

        if (selectedConversation && message.conversationId === selectedConversation.conversationId) {
            setMessages(prev => {
                // Check if this message already exists (by id)
                const exists = prev.some(m => m.id && m.id === message.id);
                if (exists) {

                    return prev;
                }

                // Check if this is a replacement for temp message
                const tempIndex = prev.findIndex(m =>
                    !m.id &&
                    m.senderId === message.senderId &&
                    m.content === message.content &&
                    m.conversationId === message.conversationId
                );

                if (tempIndex !== -1) {
                    // Replace temp message with real one

                    return prev.map((msg, idx) =>
                        idx === tempIndex ? message : msg
                    );
                } else {
                    // New message from other user
                    return [...prev, message];
                }
            });
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="user-chat-container">
            {/* Back button */}
            <button
                className="chat-back-button"
                onClick={() => navigate(-1)}
                title="Quay lại"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor" />
                </svg>
                Quay lại
            </button>

            {isConnecting && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    background: 'rgba(255, 193, 7, 0.95)',
                    color: '#000',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '600',
                    zIndex: 1000,
                    boxShadow: '0 4px 20px rgba(255, 193, 7, 0.3)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#fff',
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}></div>
                    Đang kết nối...
                </div>
            )}
            <div className="chat-sidebar">
                <h3>👨‍⚕️ Danh sách bác sĩ</h3>
                {vets.length === 0 ? (
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: '#a0aec0',
                        fontSize: '0.95rem'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🩺</div>
                        Không có bác sĩ nào
                    </div>
                ) : (
                    vets.map(vet => (
                        <div
                            key={vet.id || vet.userId}
                            className="vet-item"
                            onClick={() => startConversation(vet.id || vet.userId)}
                        >
                            <div className="vet-avatar">
                                {(vet.userName || vet.fullName || 'V')?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="vet-info">
                                <div className="vet-name">{vet.userName || vet.fullName || 'Bác sĩ'}</div>
                                <div className="vet-specialty">🩺 Bác sĩ thú y</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="chat-main">
                {selectedConversation ? (
                    <>
                        <div className="chat-header" style={{
                            padding: '20px 30px',
                            borderBottom: '1px solid rgba(240, 147, 251, 0.1)',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}>
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '1.1rem',
                                boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
                            }}>
                                👨‍⚕️
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#2d3748' }}>
                                    Bác sĩ thú y
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
                                    Đang hoạt động
                                </div>
                            </div>
                        </div>
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={msg.id || msg.tempTimestamp || index}
                                    className={`message ${msg.senderId === getUserId(currentUser) ? 'sent' : 'received'}`}>
                                    <div className="message-content">{msg.content}</div>
                                    <div className="message-time">
                                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Nhập tin nhắn..."
                            />
                            <button onClick={sendMessage}>
                                <span style={{ marginRight: '5px' }}>📤</span>
                                Gửi
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-conversation">
                        <p>Chọn bác sĩ để bắt đầu trò chuyện</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserChat;