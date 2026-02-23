package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.ChatDTO.ChatRequest;
import com.example.petcaremanagement.Dto.ChatDTO.ChatResponse;
import com.example.petcaremanagement.Service.ChatbotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        log.info("Received chat request: {}", request.getMessage());

        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ChatResponse.builder()
                    .success(false)
                    .error("Vui lòng nhập tin nhắn!")
                    .build();
        }

        return chatbotService.chat(request);
    }

    @GetMapping("/health")
    public String health() {
        return "Chatbot is running!";
    }
}
