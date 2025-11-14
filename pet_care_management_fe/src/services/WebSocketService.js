// src/services/WebSocketService.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.client = null;
        this.userId = null;
        this.messageQueue = []; // Queue messages while connecting
    }

    connect(userId, onMessageReceived) {
        if (this.client && this.client.connected) {

            return;
        }

        this.userId = userId;
        const socket = new SockJS('http://localhost:8080/ws');
        this.client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => { },
        });

        this.client.onConnect = (frame) => {


            // Subscribe to personal message queue
            this.client.subscribe(`/user/${userId}/queue/messages`, (message) => {
                const receivedMessage = JSON.parse(message.body);

                onMessageReceived(receivedMessage);
            });

            // Send any queued messages
            this.flushMessageQueue();
        };

        this.client.onStompError = (frame) => {
            console.error('STOMP error:', frame.headers.message);
            console.error('Error details:', frame.body);
        };

        this.client.onWebSocketError = (event) => {
            console.error('WebSocket connection error:', event);
        };

        this.client.onDisconnect = () => {
            console.warn('WebSocket disconnected');
        };

        this.client.activate();
    }

    sendMessage(message) {
        if (!this.client) {
            console.error('WebSocket client not initialized');
            return false;
        }

        if (!this.client.connected) {
            console.warn('WebSocket not connected yet, queuing message...');
            this.messageQueue.push(message);
            return false;
        }

        try {
            this.client.publish({
                destination: '/app/chat.send',
                body: JSON.stringify(message),
            });

            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    }

    flushMessageQueue() {
        if (this.messageQueue.length > 0) {

            this.messageQueue.forEach(msg => this.sendMessage(msg));
            this.messageQueue = [];
        }
    }

    isConnected() {
        return this.client && this.client.connected;
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;

        }
    }
}

// Export singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;