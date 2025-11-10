package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(String conversationId);
    List<ChatMessage> findByRecipientIdAndIsReadFalse(Long recipientId);
}
