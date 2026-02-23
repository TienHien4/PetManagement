package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.ChatDTO.ChatRequest;
import com.example.petcaremanagement.Dto.ChatDTO.ChatResponse;

public interface ChatbotService {
    ChatResponse chat(ChatRequest request);
}
