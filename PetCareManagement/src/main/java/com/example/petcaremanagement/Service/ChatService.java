package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.ChatDTO.ChatMessageDTO;
import com.example.petcaremanagement.Entity.ChatMessage;
import com.example.petcaremanagement.Entity.Conversation;
import java.util.List;

public interface ChatService {
    ChatMessage saveMessage(ChatMessageDTO dto);
    String createOrGetConversation(Long userId, Long vetId);
    List<ChatMessage> getConversationMessages(String conversationId);
    List<Conversation> getUserConversations(Long userId);
    List<Conversation> getVetConversations(Long vetId);
    List<ChatMessage> getUnreadMessages(Long userId);
    void markAsRead(Long messageId);
}
