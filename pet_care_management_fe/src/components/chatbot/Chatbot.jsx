import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, User, Bot, Sparkles, ChevronRight } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Chào bạn! Mình là PetCare AI. Mình có thể giúp gì cho bé cưng của bạn hôm nay? 🐶🐱',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const quickSuggestions = [
        { label: '🐾 Thú cưng của tôi', query: 'Tôi có những thú cưng nào?' },
        { label: '📅 Lịch hẹn của tôi', query: 'Lịch hẹn sắp tới của tôi là khi nào?' },
        { label: '💉 Giá tiêm phòng', query: 'Bảng giá tiêm phòng cho chó mèo như thế nào?' },
        { label: '🍽️ Chế độ dinh dưỡng', query: 'Thú cưng không nên ăn những gì?' },
        { label: '💊 Tìm thuốc/phụ kiện', query: 'Cho tôi xem các sản phẩm thuốc và phụ kiện' },
        { label: '🚑 Dấu hiệu khẩn cấp', query: 'Khi nào cần đưa thú cưng đi cấp cứu ngay?' },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text) => {
        const messageText = text || input;
        if (!messageText.trim()) return;

        const userMessage = {
            role: 'user',
            content: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.post('http://localhost:8080/api/chatbot/chat', {
                message: messageText,
                userId: userId ? parseInt(userId) : null
            });

            if (response.data.success) {
                const assistantMessage = {
                    role: 'assistant',
                    content: response.data.reply,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                throw new Error(response.data.error || 'Lỗi hệ thống');
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            let errorMessageText = 'Xin lỗi, mình đang gặp chút trục trặc. Bạn vui lòng thử lại sau hoặc liên hệ hotline 0382562504 nhé! 🙏';
            
            if (error.response && error.response.status === 429) {
                errorMessageText = '⚠️ Hệ thống AI hiện đang hết hạn mức sử dụng miễn phí trong hôm nay. Vui lòng thử lại vào ngày mai hoặc nâng cấp API Key! 🙏';
            }

            const errorMessage = {
                role: 'assistant',
                content: errorMessageText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessageContent = (content) => {
        if (!content) return '';
        const lines = content.split('\n');
        return lines.map((line, lineIndex) => {
            const parts = line.split('**');
            const formattedLine = parts.map((part, partIndex) => {
                if (partIndex % 2 === 1) {
                    return <strong key={partIndex}>{part}</strong>;
                }
                return part;
            });
            return (
                <div key={lineIndex} style={{ minHeight: '1.2em' }}>
                    {formattedLine}
                </div>
            );
        });
    };

    return (
        <div className="chatbot-container">
            <button 
                className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-content">
                            <div className="chatbot-avatar">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="chatbot-title">PetCare AI</h3>
                                <p className="chatbot-status">
                                    <span className="status-dot"></span>
                                    Trực tuyến
                                </p>
                            </div>
                        </div>
                        <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <div className="message-avatar">
                                    {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                                </div>
                                <div className="message-content">
                                    <div className="message-bubble">
                                        {renderMessageContent(msg.content)}
                                    </div>
                                    <div className="message-time">{msg.time}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message assistant">
                                <div className="message-avatar">
                                    <Bot size={20} />
                                </div>
                                <div className="message-content">
                                    <div className="message-bubble typing">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {!isLoading && messages.length < 5 && (
                        <div className="quick-questions">
                            <p className="quick-questions-title">Gợi ý cho bạn:</p>
                            <div className="quick-questions-grid">
                                {quickSuggestions.map((suggestion, index) => (
                                    <button 
                                        key={index}
                                        className="quick-question-btn"
                                        onClick={() => handleSend(suggestion.query)}
                                    >
                                        {suggestion.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="chatbot-input-container">
                        <textarea 
                            className="chatbot-input"
                            placeholder="Nhập câu hỏi của bạn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            disabled={isLoading}
                        />
                        <button 
                            className="chatbot-send"
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;


