package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.EmailDTO.EmailEvent;
import com.example.petcaremanagement.Entity.Appointment;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Enum.EmailEventType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailProducerService {

    private static final Logger logger = LoggerFactory.getLogger(EmailProducerService.class);

    @Autowired
    private KafkaTemplate<String, EmailEvent> kafkaTemplate;

    /**
     * Gửi email event vào topic tương ứng
     */
    public void sendEmailEvent(EmailEvent event) {
        String topic = getTopicByEventType(event.getEventType());


        CompletableFuture<SendResult<String, EmailEvent>> future =
                kafkaTemplate.send(topic, event.getUserId().toString(), event);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                logger.info("Sent {} email event to Kafka topic '{}': user={}, email={}, offset={}",
                        event.getEventType(),
                        topic,
                        event.getUserName(),
                        event.getUserEmail(),
                        result.getRecordMetadata().offset());
            } else {
                logger.error("Failed to send {} email event to Kafka: user={}, error={}",
                        event.getEventType(),
                        event.getUserEmail(),
                        ex.getMessage());
            }
        });
    }

    /**
     * 🐾 Gửi email xác nhận đặt lịch khám
     */
    public void sendAppointmentConfirmationEmail(User user, Pet pet, Appointment appointment) {
        logger.info("Preparing appointment confirmation email for user: {}", user.getUserName());

        // Validate
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            logger.warn(" User {} has no email. Skipping.", user.getUserName());
            return;
        }

        // Tạo EmailEvent
        EmailEvent event = new EmailEvent(
                EmailEventType.APPOINTMENT_CONFIRMATION.getEventName(),
                user.getId(),
                user.getEmail(),
                user.getUserName(),
                "Xác nhận đặt lịch khám - Pet Care Management",
                EmailEventType.APPOINTMENT_CONFIRMATION.getTemplatePath()
        );

        // Thêm dữ liệu động cho template
        event.addTemplateData("petName", pet.getName())
                .addTemplateData("petSpecies", pet.getSpecies())
                .addTemplateData("petBreed", pet.getBreed() != null ? pet.getBreed() : "Không rõ")
                .addTemplateData("appointmentDate", appointment.getDate().toString())
                .addTemplateData("services", appointment.getServices())
                .addTemplateData("reason", appointment.getServices())
                .addTemplateData("status", getStatusText(appointment.getStatus()))
                .addTemplateData("statusColor", getStatusColor(appointment.getStatus()))
                .addTemplateData("appointmentId", appointment.getId());

        // Gửi vào Kafka
        sendEmailEvent(event);

        logger.info("Appointment confirmation email event queued for user: {} ({})",
                user.getUserName(), user.getEmail());
    }

    /**
     * Gửi email cập nhật trạng thái đặt lịch
     */
    public void sendAppointmentStatusUpdateEmail(User user, Pet pet, Appointment appointment,
                                                 String oldStatus, String newStatus) {
        logger.info("Preparing appointment status update email for user: {}", user.getUserName());

        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            logger.warn("⚠ User {} has no email. Skipping.", user.getUserName());
            return;
        }

        EmailEvent event = new EmailEvent(
                EmailEventType.APPOINTMENT_STATUS_UPDATE.getEventName(),
                user.getId(),
                user.getEmail(),
                user.getUserName(),
                "Cập nhật trạng thái lịch khám - Pet Care Management",
                EmailEventType.APPOINTMENT_STATUS_UPDATE.getTemplatePath()
        );

        event.addTemplateData("petName", pet.getName())
                .addTemplateData("appointmentDate", appointment.getDate().toString())
                .addTemplateData("oldStatus", getStatusText(oldStatus))
                .addTemplateData("newStatus", getStatusText(newStatus))
                .addTemplateData("oldStatusColor", getStatusColor(oldStatus))
                .addTemplateData("newStatusColor", getStatusColor(newStatus))
                .addTemplateData("appointmentId", appointment.getId())
                .addTemplateData("statusMessage", getStatusMessage(newStatus));

        sendEmailEvent(event);

        logger.info("Status update email event queued for user: {} ({})",
                user.getUserName(), user.getEmail());
    }

    /**
     * Gửi email khuyến mãi
     */
    public void sendPromotionEmail(User user, String title, String description,
                                   String discount, String validUntil, String promoCode) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            logger.warn("⚠User {} has no email. Skipping promotion.", user.getUserName());
            return;
        }

        EmailEvent event = new EmailEvent(
                EmailEventType.PROMOTION.getEventName(),
                user.getId(),
                user.getEmail(),
                user.getUserName(),
                 title,
                EmailEventType.PROMOTION.getTemplatePath()
        );

        event.addTemplateData("title", title)
                .addTemplateData("description", description)
                .addTemplateData("discount", discount)
                .addTemplateData("validUntil", validUntil)
                .addTemplateData("promotionCode", promoCode);

        sendEmailEvent(event);
    }

    /**
     * Gửi email hàng loạt
     */
    public void sendBulkEmailEvents(List<User> users, String eventType, String subject,
                                    String templateName, Map<String, Object> templateData) {
        logger.info(" Sending bulk {} emails to {} users", eventType, users.size());

        int successCount = 0;
        int skipCount = 0;

        for (User user : users) {
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                skipCount++;
                continue;
            }

            EmailEvent event = new EmailEvent(
                    eventType,
                    user.getId(),
                    user.getEmail(),
                    user.getUserName(),
                    subject,
                    templateName
            );

            event.addAllTemplateData(templateData);
            sendEmailEvent(event);
            successCount++;
        }

        logger.info(" Bulk email summary: {} queued, {} skipped (no email)",
                successCount, skipCount);
    }

    /**
     * Xác định topic dựa trên event type
     */
    private String getTopicByEventType(String eventType) {
        return switch (eventType) {
            case "appointment-confirmation", "appointment-status-update", "appointment-reminder"
                    -> "appointment-email-events";
            case "promotion", "new-year-promotion"
                    -> "promotion-email-events";
            case "system-upgrade", "password-reset", "welcome"
                    -> "system-email-events";
            default -> "appointment-email-events";
        };
    }

    /**
     * Format date
     */
    private String formatDate(java.time.LocalDateTime date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return date.format(formatter);
    }

    /**
     * Chuyển đổi status code sang text tiếng Việt
     */
    private String getStatusText(String status) {
        return switch (status) {
            case "PENDING" -> "Chờ xác nhận";
            case "CONFIRMED" -> "Đã xác nhận";
            case "COMPLETED" -> "Đã hoàn thành";
            case "CANCELLED" -> "Đã hủy";
            default -> status;
        };
    }

    /**
     * Lấy màu cho status
     */
    private String getStatusColor(String status) {
        return switch (status) {
            case "PENDING" -> "#ffa500";
            case "CONFIRMED" -> "#28a745";
            case "COMPLETED" -> "#007bff";
            case "CANCELLED" -> "#dc3545";
            default -> "#6c757d";
        };
    }

    /**
     * Lấy message cho status
     */
    private String getStatusMessage(String status) {
        return switch (status) {
            case "PENDING" -> "Lịch hẹn của bạn đang chờ xác nhận từ phòng khám.";
            case "CONFIRMED" -> "Lịch hẹn của bạn đã được xác nhận. Vui lòng đến đúng giờ!";
            case "COMPLETED" -> "Lịch hẹn đã hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ!";
            case "CANCELLED" -> "Lịch hẹn đã bị hủy. Vui lòng đặt lịch mới nếu cần.";
            default -> "";
        };
    }
}