package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Service.job.EmailSchedulerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller để test các chức năng email campaign
 * CHỈ SỬ DỤNG CHO MỤC ĐÍCH TEST - NÊN XÓA HOẶC DISABLE TRÊN PRODUCTION
 */
@RestController
@RequestMapping("/api/email-test")
@CrossOrigin(origins = "*")
public class EmailTestController {

    private static final Logger logger = LoggerFactory.getLogger(EmailTestController.class);

    @Autowired
    private EmailSchedulerService emailSchedulerService;

    /**
     * Test gửi email khuyến mãi năm mới
     * GET http://localhost:8080/api/email-test/new-year-promotion
     */
    @GetMapping("/new-year-promotion")
    public ResponseEntity<Map<String, Object>> testNewYearPromotion() {
        logger.info("TEST: Manually triggering New Year promotion email campaign");

        try {
            emailSchedulerService.sendNewYearPromotionEmails();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "New Year promotion emails sent successfully!");
            response.put("campaign", "NEW_YEAR_2025");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to send New Year promotion emails", e);

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send emails: " + e.getMessage());

            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Test gửi email khuyến mãi cuối năm
     * GET http://localhost:8080/api/email-test/year-end-sale
     */
    @GetMapping("/year-end-sale")
    public ResponseEntity<Map<String, Object>> testYearEndSale() {
        logger.info("TEST: Manually triggering Year-End Sale email campaign");

        try {
            emailSchedulerService.sendYearEndSaleEmails();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Year-End Sale emails sent successfully!");
            response.put("campaign", "YEAR_END_SALE_2025");
            response.put("discount", "30%");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to send Year-End Sale emails", e);

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send emails: " + e.getMessage());

            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Kiểm tra trạng thái scheduler service
     * GET http://localhost:8080/api/email-test/status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("schedulerEnabled", true);
        response.put("campaigns", new String[] {
                "New Year Promotion - Runs at 00:01 on January 1st",
                "Year-End Sale - Runs at 00:01 on December 20th"
        });
        response.put("kafkaEnabled", true);
        response.put("topics", new String[] {
                "appointment-email-events",
                "promotion-email-events",
                "system-email-events"
        });

        return ResponseEntity.ok(response);
    }
}
