package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.ChatDTO.ChatMessageDTO;
import com.example.petcaremanagement.Entity.ChatMessage;
import com.example.petcaremanagement.Entity.Conversation;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Repository.ChatMessageRepository;
import com.example.petcaremanagement.Repository.ConversationRepository;
import com.example.petcaremanagement.Repository.UserRepository;
import com.example.petcaremanagement.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatMessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ChatMessage saveMessage(ChatMessageDTO dto) {
        ChatMessage message = new ChatMessage();
        message.setConversationId(dto.getConversationId());
        message.setSenderId(dto.getSenderId());
        message.setSenderName(dto.getSenderName());
        message.setRecipientId(dto.getRecipientId());
        message.setContent(dto.getContent());
        message.setType(ChatMessage.MessageType.valueOf(dto.getType()));
        message.setIsRead(false);

        ChatMessage saved = messageRepository.save(message);
        updateConversation(dto.getConversationId(), dto.getContent());

        return saved;
    }

    @Override
    public String createOrGetConversation(Long userId, Long vetId) {
        return conversationRepository.findByUserIdAndVetId(userId, vetId)
                .map(Conversation::getConversationId)
                .orElseGet(() -> {
                    Conversation conv = new Conversation();
                    conv.setConversationId(UUID.randomUUID().toString());
                    conv.setUserId(userId);
                    conv.setVetId(vetId);
                    return conversationRepository.save(conv).getConversationId();
                });
    }

    @Override
    public List<ChatMessage> getConversationMessages(String conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    @Override
    public List<Conversation> getUserConversations(Long userId) {
        List<Conversation> conversations = conversationRepository.findByUserId(userId);
        // Populate vet names
        conversations.forEach(conv -> {
            userRepository.findById(conv.getVetId()).ifPresent(vet -> {
                conv.setVetName(vet.getUserName());
            });
        });
        return conversations;
    }

    @Override
    public List<Conversation> getVetConversations(Long vetId) {
        List<Conversation> conversations = conversationRepository.findByVetId(vetId);
        // Populate user names
        conversations.forEach(conv -> {
            userRepository.findById(conv.getUserId()).ifPresent(user -> {
                conv.setUserName(user.getUserName());
            });
        });
        return conversations;
    }

    @Override
    public List<ChatMessage> getUnreadMessages(Long userId) {
        return messageRepository.findByRecipientIdAndIsReadFalse(userId);
    }

    @Override
    public void markAsRead(Long messageId) {
        messageRepository.findById(messageId).ifPresent(msg -> {
            msg.setIsRead(true);
            messageRepository.save(msg);
        });
    }

    private void updateConversation(String conversationId, String lastMessage) {
        conversationRepository.findByConversationId(conversationId).ifPresent(conv -> {
            conv.setLastMessage(lastMessage);
            conv.setLastMessageTime(LocalDateTime.now());
            conversationRepository.save(conv);
        });
    }
}