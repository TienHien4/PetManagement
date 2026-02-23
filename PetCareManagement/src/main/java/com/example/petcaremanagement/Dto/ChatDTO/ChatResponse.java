package com.example.petcaremanagement.Dto.ChatDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatResponse {
    private String reply;
    private String conversationId;
    private boolean success;
    private String error;
}
