package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.EmailDTO.EmailEvent;
import com.example.petcaremanagement.Enum.EmailEventType;
import com.example.petcaremanagement.Service.EmailProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestKafkaController {

    @Autowired
    private EmailProducerService emailProducerService;

    /**
     * Test gửi email qua Kafka
     * GET:
     * http://localhost:8080/api/test/kafka-email?email=your@email.com&name=YourName
     */
    @GetMapping("/kafka-email")
    public ResponseEntity<?> testKafkaEmail(
            @RequestParam String email,
            @RequestParam(defaultValue = "Test User") String name) {

        try {
            // Tạo EmailEvent test
            EmailEvent event = new EmailEvent(
                    EmailEventType.PROMOTION.getEventName(),
                    1L,
                    email,
                    name,
                    "🧪 [TEST] Email qua Kafka - Pet Care",
                    EmailEventType.PROMOTION.getTemplatePath());

            // Thêm dữ liệu test
            event.addTemplateData("title", "Test Email từ Kafka")
                    .addTemplateData("description", "Đây là email test để kiểm tra hệ thống Kafka hoạt động.")
                    .addTemplateData("discount", "10%")
                    .addTemplateData("validUntil", LocalDate.now().plusDays(7).toString())
                    .addTemplateData("promotionCode", "TEST" + System.currentTimeMillis() % 1000);

            // Gửi vào Kafka
            emailProducerService.sendEmailEvent(event);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Email event sent to Kafka successfully");
            response.put("email", email);
            response.put("eventType", event.getEventType());
            response.put("topic", "promotion-email-events");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "Failed to send email event: " + e.getMessage());
            error.put("error", e.getClass().getSimpleName());

            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Test Kafka connection
     * GET: http://localhost:8080/api/test/kafka-status
     */
    @GetMapping("/kafka-status")
    public ResponseEntity<?> checkKafkaStatus() {
        Map<String, Object> status = new HashMap<>();

        try {
            // Thử gửi một event test nhỏ
            EmailEvent testEvent = new EmailEvent(
                    "TEST",
                    999L,
                    "test@test.com",
                    "Test",
                    "Test Connection",
                    "email/test");

            emailProducerService.sendEmailEvent(testEvent);

            status.put("kafka", "✅ CONNECTED");
            status.put("message", "Kafka is running and accepting messages");
            status.put("bootstrap-servers", "localhost:9092");

            return ResponseEntity.ok(status);

        } catch (Exception e) {
            status.put("kafka", "❌ DISCONNECTED");
            status.put("message", "Kafka connection failed: " + e.getMessage());
            status.put("error", e.getClass().getSimpleName());
            status.put("solution", "Run start-kafka.bat to start Kafka services");

            return ResponseEntity.status(503).body(status);
        }
    }

    /**
     * Hướng dẫn sử dụng
     * GET: http://localhost:8080/api/test/kafka-help
     */
    @GetMapping("/kafka-help")
    public ResponseEntity<?> kafkaHelp() {
        Map<String, Object> help = new HashMap<>();

        help.put("title", "🚀 Kafka Email System - Test Endpoints");

        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("Check Status", "GET /api/test/kafka-status");
        endpoints.put("Send Test Email", "GET /api/test/kafka-email?email=your@email.com&name=YourName");
        endpoints.put("Help", "GET /api/test/kafka-help");
        help.put("endpoints", endpoints);

        Map<String, String> setup = new HashMap<>();
        setup.put("1. Start Kafka", "Run: start-kafka.bat");
        setup.put("2. Verify", "GET /api/test/kafka-status");
        setup.put("3. Test Email", "GET /api/test/kafka-email?email=your@email.com");
        setup.put("4. Check Logs", "See console for consumer processing");
        help.put("setup", setup);

        Map<String, String> topics = new HashMap<>();
        topics.put("email-events", "General email events");
        topics.put("promotion-email-events", "Promotion emails (high throughput)");
        topics.put("system-email-events", "System notifications");
        help.put("topics", topics);

        return ResponseEntity.ok(help);
    }
}
