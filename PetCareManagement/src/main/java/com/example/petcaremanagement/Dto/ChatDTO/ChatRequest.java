package com.example.petcaremanagement.Dto.ChatDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequest {
    private String message;
    private String conversationId; // Optional: để track conversation
}
