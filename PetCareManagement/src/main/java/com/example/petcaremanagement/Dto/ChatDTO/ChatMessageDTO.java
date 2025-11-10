package com.example.petcaremanagement.Dto.ChatDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private Long id;
    private String conversationId;
    private Long senderId;
    private String senderName;
    private Long recipientId;
    private String content;
    private String type;
    private String createdAt;
    private Boolean isRead;
}
