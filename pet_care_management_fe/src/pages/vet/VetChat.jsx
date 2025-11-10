// src/pages/vet/VetChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/customizeAxios';
import WebSocketService from '../../services/WebSocketService';
import './VetChat.css';

const VetChat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnecting, setIsConnecting] = useState(true);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const currentVet = JSON.parse(localStorage.getItem('user') || '{}');

    // Helper function to get user ID (handle both 'id' and 'userId' fields)
    const getUserId = (user) => user?.userId || user?.id;

    useEffect(() => {
        const vetId = getUserId(currentVet);
        if (!vetId) {
            console.error('No vet user found in localStorage');
            return;
        }

        loadConversations();
        WebSocketService.connect(vetId, handleReceivedMessage);

        // Check connection status after 2 seconds
        setTimeout(() => {
            if (WebSocketService.isConnected()) {
                setIsConnecting(false);
                console.log('✅ WebSocket ready');
            } else {
                console.warn('⚠️ WebSocket still connecting...');
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
            const vetId = getUserId(currentVet);
            const response = await apiClient.get(`/api/chat/conversations/vet/${vetId}`);
            console.log('Vet conversations response:', response.data);
            setConversations(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error loading conversations:', error);
            setConversations([]);
        }
    };

    const loadMessages = async (conversationId, userId) => {
        try {
            const response = await apiClient.get(`/api/chat/messages/${conversationId}`);
            setMessages(response.data);
            setSelectedConversation({ conversationId, userId });
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        if (!WebSocketService.isConnected()) {
            alert('⚠️ Đang kết nối WebSocket, vui lòng thử lại sau giây lát...');
            return;
        }

        const vetId = getUserId(currentVet);
        const messageContent = newMessage;
        const message = {
            conversationId: selectedConversation.conversationId,
            senderId: vetId,
            senderName: currentVet.userName,
            recipientId: selectedConversation.userId,
            content: messageContent,
            type: 'CHAT'
        };

        // Add message to UI immediately
        const tempMessage = {
            ...message,
            createdAt: new Date().toISOString(),
            tempTimestamp: Date.now()
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');

        // Send via WebSocket
        WebSocketService.sendMessage(message);

        // Update conversation list immediately
        loadConversations();
    };

    const handleReceivedMessage = (message) => {
        console.log('📩 Received message:', message);

        // Always update conversation list when receiving message
        loadConversations();

        if (selectedConversation && message.conversationId === selectedConversation.conversationId) {
            setMessages(prev => {
                // Check if message already exists
                const exists = prev.some(m => m.id && m.id === message.id);
                if (exists) {
                    console.log('⚠️ Message already exists, skipping');
                    return prev;
                }

                // Check if this is replacement for temp message
                const tempIndex = prev.findIndex(m =>
                    !m.id &&
                    m.senderId === message.senderId &&
                    m.content === message.content &&
                    m.conversationId === message.conversationId
                );

                if (tempIndex !== -1) {
                    console.log('✅ Replaced temp message with server message');
                    return prev.map((msg, idx) =>
                        idx === tempIndex ? message : msg
                    );
                } else {
                    console.log('✅ Added new message to chat');
                    return [...prev, message];
                }
            });
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="vet-chat-container">
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
                    top: '10px',
                    right: '10px',
                    padding: '8px 16px',
                    background: '#ffc107',
                    color: '#000',
                    borderRadius: '4px',
                    fontSize: '14px',
                    zIndex: 1000
                }}>
                    🔄 Đang kết nối WebSocket...
                </div>
            )}
            <div className="chat-sidebar">
                <h3>Tin nhắn</h3>
                {conversations.map(conv => (
                    <div key={conv.id} className="conversation-item" onClick={() => loadMessages(conv.conversationId, conv.userId)}>
                        <div className="user-avatar">
                            {(conv.userName || 'User')?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="conversation-info">
                            <div className="user-name">{conv.userName || 'User'}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="chat-main">
                {selectedConversation ? (
                    <>
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={msg.id || msg.tempTimestamp || index}
                                    className={`message ${msg.senderId === getUserId(currentVet) ? 'sent' : 'received'}`}>
                                    <div className="message-content">{msg.content}</div>
                                    <div className="message-time">
                                        {new Date(msg.createdAt).toLocaleTimeString()}
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
                            <button onClick={sendMessage}>Gửi</button>
                        </div>
                    </>
                ) : (
                    <div className="no-conversation">
                        <p>Chọn cuộc trò chuyện</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VetChat;