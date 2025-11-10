package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByConversationId(String conversationId);
    List<Conversation> findByUserId(Long userId);
    List<Conversation> findByVetId(Long vetId);
    Optional<Conversation> findByUserIdAndVetId(Long userId, Long vetId);
}
