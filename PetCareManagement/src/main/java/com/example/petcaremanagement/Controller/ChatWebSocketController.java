package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.ChatDTO.ChatMessageDTO;
import com.example.petcaremanagement.Entity.ChatMessage;
import com.example.petcaremanagement.Service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(ChatWebSocketController.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageDTO messageDto) {
        try {
            logger.info("Received message from user {}: {}", messageDto.getSenderId(), messageDto.getContent());

            // Save message to database
            ChatMessage savedMessage = chatService.saveMessage(messageDto);
            logger.info("Message saved with ID: {}", savedMessage.getId());

            // Send to both sender and recipient via WebSocket
            // This ensures both sides see the message immediately
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(messageDto.getRecipientId()),
                    "/queue/messages",
                    savedMessage);

            messagingTemplate.convertAndSendToUser(
                    String.valueOf(messageDto.getSenderId()),
                    "/queue/messages",
                    savedMessage);

            logger.info("Message sent to sender {} and recipient {}",
                    messageDto.getSenderId(), messageDto.getRecipientId());

        } catch (Exception e) {
            logger.error("Error processing message: ", e);
        }
    }

    @MessageMapping("/chat.join")
    public void joinConversation(@Payload String conversationId) {
        logger.info("User joined conversation: {}", conversationId);
        // You can add logic here if needed
    }
}
