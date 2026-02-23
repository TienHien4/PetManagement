package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.ChatDTO.ChatRequest;
import com.example.petcaremanagement.Dto.ChatDTO.ChatResponse;
import com.example.petcaremanagement.Service.ChatbotService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
public class ChatbotServiceImpl implements ChatbotService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.0-flash}")
    private String model;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

    private static final String SYSTEM_PROMPT = """
            Bạn là trợ lý ảo thông minh của hệ thống quản lý chăm sóc thú cưng.

            NHIỆM VỤ:
            - Tư vấn về các dịch vụ chăm sóc thú cưng: khám bệnh, tiêm phòng, spa, grooming
            - Hướng dẫn sử dụng website
            - Tư vấn chăm sóc sức khỏe thú cưng cơ bản
            - Giải đáp thắc mắc về đặt lịch, thanh toán

            DỊCH VỤ CỦA CHÚNG TÔI:
            1. Khám tổng quát - 200,000đ
            2. Tiêm phòng - 150,000đ - 300,000đ (tùy loại vaccine)
            3. Tắm và cắt tỉa lông - 150,000đ - 500,000đ (tùy kích thước)
            4. Phẫu thuật - Tùy ca (liên hệ bác sĩ)
            5. Nha khoa - 300,000đ - 1,000,000đ
            6. Siêu âm - 400,000đ
            7. X-quang - 350,000đ
            8. Xét nghiệm máu - 250,000đ

            LỊCH TIÊM PHÒNG:
            - Chó: 6-8 tuần tuổi (mũi đầu), nhắc lại sau 3-4 tuần
            - Mèo: 8 tuần tuổi (mũi đầu), nhắc lại sau 3-4 tuần

            GIỜ LÀM VIỆC: 8:00 - 20:00 (Thứ 2 - Chủ Nhật)

            CÁCH ĐẶT LỊCH:
            1. Vào mục "Dịch vụ"
            2. Chọn thú cưng và dịch vụ cần đặt
            3. Chọn ngày giờ và bác sĩ
            4. Xác nhận đặt lịch

            THANH TOÁN:
            - Tại phòng khám (tiền mặt)
            - Online qua VNPay

            PHONG CÁCH:
            - Lịch sự, thân thiện, chuyên nghiệp
            - Trả lời ngắn gọn, dễ hiểu
            - Sử dụng emoji phù hợp 🐕🐈
            - Nếu không chắc chắn, gợi ý liên hệ trực tiếp với bác sĩ
            """;

    @Override
    public ChatResponse chat(ChatRequest request) {
        if (apiKey == null || apiKey.isEmpty()) {
            log.error("Gemini API key not configured");
            return ChatResponse.builder()
                    .success(false)
                    .error("Chatbot chưa được cấu hình. Vui lòng liên hệ admin!")
                    .build();
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            // Tạo URL với API key
            String url = GEMINI_API_URL + model + ":generateContent?key=" + apiKey;

            // Tạo headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Tạo request body theo format Gemini API
            Map<String, Object> requestBody = new HashMap<>();

            // System instruction
            Map<String, Object> systemInstruction = new HashMap<>();
            Map<String, String> systemPart = new HashMap<>();
            systemPart.put("text", SYSTEM_PROMPT);
            systemInstruction.put("parts", List.of(systemPart));
            requestBody.put("systemInstruction", systemInstruction);

            // Contents (user message)
            Map<String, Object> content = new HashMap<>();
            content.put("role", "user");
            Map<String, String> part = new HashMap<>();
            part.put("text", request.getMessage());
            content.put("parts", List.of(part));
            requestBody.put("contents", List.of(content));

            // Generation config
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.7);
            generationConfig.put("maxOutputTokens", 500);
            generationConfig.put("topP", 0.95);
            requestBody.put("generationConfig", generationConfig);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            log.info("Sending request to Gemini API (model: {})...", model);

            // Gọi Gemini API
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    Map.class);

            log.info("Received response from Gemini API");

            // Parse response Gemini
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> contentResponse = (Map<String, Object>) candidate.get("content");
                    if (contentResponse != null) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) contentResponse.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            String reply = (String) parts.get(0).get("text");

                            return ChatResponse.builder()
                                    .reply(reply.trim())
                                    .success(true)
                                    .conversationId(request.getConversationId())
                                    .build();
                        }
                    }
                }
            }

            return ChatResponse.builder()
                    .success(false)
                    .error("Không nhận được phản hồi từ chatbot")
                    .build();

        } catch (HttpClientErrorException e) {
            String responseBody = e.getResponseBodyAsString();
            log.error("Gemini API error - Status: {}, Body: {}", e.getStatusCode(), responseBody);

            String errorMsg;
            if (e.getStatusCode().value() == 400) {
                errorMsg = "Yêu cầu không hợp lệ. Vui lòng thử lại!";
            } else if (e.getStatusCode().value() == 403) {
                errorMsg = "API key không có quyền truy cập. Kiểm tra lại API key!";
            } else if (e.getStatusCode().value() == 429) {
                errorMsg = "Đã vượt quá giới hạn request. Vui lòng thử lại sau!";
            } else if (e.getStatusCode().value() == 404) {
                errorMsg = "Model không tìm thấy. Kiểm tra lại tên model!";
            } else {
                errorMsg = "Lỗi Gemini API: " + e.getStatusCode() + " - " + responseBody;
            }

            return ChatResponse.builder()
                    .success(false)
                    .error(errorMsg)
                    .build();
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            return ChatResponse.builder()
                    .success(false)
                    .error("Xin lỗi, chatbot đang gặp sự cố: " + e.getMessage())
                    .build();
        }
    }
}
