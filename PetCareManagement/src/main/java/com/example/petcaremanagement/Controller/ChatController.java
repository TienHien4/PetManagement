package com.example.petcaremanagement.Controller;


import com.example.petcaremanagement.Entity.ChatMessage;
import com.example.petcaremanagement.Entity.Conversation;
import com.example.petcaremanagement.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/conversations/user/{userId}")
    public List<Conversation> getUserConversations(@PathVariable Long userId) {
        return chatService.getUserConversations(userId);
    }

    @GetMapping("/conversations/vet/{vetId}")
    public List<Conversation> getVetConversations(@PathVariable Long vetId) {
        return chatService.getVetConversations(vetId);
    }

    @GetMapping("/messages/{conversationId}")
    public List<ChatMessage> getConversationMessages(@PathVariable String conversationId) {
        return chatService.getConversationMessages(conversationId);
    }

    @PostMapping("/conversations/create")
    public String createConversation(@RequestParam Long userId, @RequestParam Long vetId) {
        return chatService.createOrGetConversation(userId, vetId);
    }

    @GetMapping("/unread/{userId}")
    public List<ChatMessage> getUnreadMessages(@PathVariable Long userId) {
        return chatService.getUnreadMessages(userId);
    }

    @PutMapping("/messages/{messageId}/read")
    public void markAsRead(@PathVariable Long messageId) {
        chatService.markAsRead(messageId);
    }
}
