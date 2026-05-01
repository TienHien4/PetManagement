package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.EmailDTO.EmailEvent;
import com.example.petcaremanagement.Entity.Appointment;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Enum.EmailEventType;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailProducerService {

    private static final Logger logger = LoggerFactory.getLogger(EmailProducerService.class);

    @Autowired
    private KafkaTemplate<String, EmailEvent> emailKafkaTemplate;

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Gửi email event vào topic tương ứng
     */
    public void sendEmailEvent(EmailEvent event) {
        String topic = getTopicByEventType(event.getEventType());
        CompletableFuture<SendResult<String, EmailEvent>> future = emailKafkaTemplate.send(topic,
                event.getUserId().toString(), event);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                // ĐẢM BẢO BẠN CÓ ĐỦ 5 ĐỐI SỐ Ở ĐÂY
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
     * Gửi email xác nhận đặt lịch khám
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
                EmailEventType.APPOINTMENT_CONFIRMATION.getTemplatePath());

        // Định dạng ngày giờ
        java.text.SimpleDateFormat dateFormatter = new java.text.SimpleDateFormat("dd/MM/yyyy");
        java.text.SimpleDateFormat timeFormatter = new java.text.SimpleDateFormat("HH:mm");
        String formattedDate = dateFormatter.format(appointment.getDate());
        String formattedTime = timeFormatter.format(appointment.getDate());

        // Lấy danh sách dịch vụ (lý do khám)
        String reason = "Khám tổng quát";
        if (appointment.getServices() != null && !appointment.getServices().isEmpty()) {
            reason = appointment.getServices().stream()
                    .map(com.example.petcaremanagement.Entity.ServicesType::getName)
                    .collect(java.util.stream.Collectors.joining(", "));
        }

        // Thêm dữ liệu động cho template
        event.addTemplateData("petName", pet.getName())
                .addTemplateData("petSpecies", pet.getSpecies())
                .addTemplateData("petBreed", pet.getBreed() != null ? pet.getBreed() : "Không rõ")
                .addTemplateData("appointmentDate", formattedDate)
                .addTemplateData("appointmentTime", formattedTime)
                .addTemplateData("reason", reason)
                .addTemplateData("status", getStatusText(appointment.getStatus()))
                .addTemplateData("statusColor", getStatusColor(appointment.getStatus()))
                .addTemplateData("appointmentId", appointment.getId());

        // Gửi vào Kafka
        sendEmailEvent(event);

        logger.info("Appointment confirmation email event queued for user: {} ({})",
                user.getUserName(), user.getEmail());

        // Gửi email thông báo cho bác sĩ thú y
        if (appointment.getVet() != null && appointment.getVet().getUser() != null) {
            User vetUser = appointment.getVet().getUser();
            if (vetUser.getEmail() != null && !vetUser.getEmail().isEmpty()) {
                EmailEvent vetEvent = new EmailEvent(
                        EmailEventType.VET_APPOINTMENT_NOTIFICATION.getEventName(),
                        vetUser.getId(),
                        vetUser.getEmail(),
                        vetUser.getUserName(),
                        "Thông báo lịch khám mới - Pet Care Management",
                        EmailEventType.VET_APPOINTMENT_NOTIFICATION.getTemplatePath());

                vetEvent.addTemplateData("vetName", vetUser.getUserName())
                        .addTemplateData("customerName", user.getUserName())
                        .addTemplateData("customerEmail", user.getEmail() != null ? user.getEmail() : "Không có")
                        .addTemplateData("petName", pet.getName())
                        .addTemplateData("petSpecies", pet.getSpecies())
                        .addTemplateData("appointmentDate", formattedDate)
                        .addTemplateData("appointmentTime", formattedTime)
                        .addTemplateData("reason", reason)
                        .addTemplateData("appointmentId", appointment.getId());

                sendEmailEvent(vetEvent);
                logger.info("Vet appointment notification email event queued for vet: {} ({})",
                        vetUser.getUserName(), vetUser.getEmail());
            } else {
                logger.warn("Vet user {} has no email. Skipping vet notification.", vetUser.getUserName());
            }
        }
    }

    /**
     * Gửi email cập nhật trạng thái đặt lịch
     */
    public void sendAppointmentStatusUpdateEmail(User user, Pet pet, Appointment appointment,
            String oldStatus, String newStatus) {
        logger.info("Preparing appointment status update email for user: {}", user.getUserName());

        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            logger.warn("User {} has no email. Skipping.", user.getUserName());
            return;
        }

        EmailEvent event = new EmailEvent(
                EmailEventType.APPOINTMENT_STATUS_UPDATE.getEventName(),
                user.getId(),
                user.getEmail(),
                user.getUserName(),
                "Cập nhật trạng thái lịch khám - Pet Care Management",
                EmailEventType.APPOINTMENT_STATUS_UPDATE.getTemplatePath());

        // Định dạng ngày giờ
        java.text.SimpleDateFormat dateFormatter = new java.text.SimpleDateFormat("dd/MM/yyyy");
        java.text.SimpleDateFormat timeFormatter = new java.text.SimpleDateFormat("HH:mm");
        String formattedDate = dateFormatter.format(appointment.getDate());
        String formattedTime = timeFormatter.format(appointment.getDate());

        // Lấy danh sách dịch vụ (lý do khám)
        String reason = "Khám tổng quát";
        if (appointment.getServices() != null && !appointment.getServices().isEmpty()) {
            reason = appointment.getServices().stream()
                    .map(com.example.petcaremanagement.Entity.ServicesType::getName)
                    .collect(java.util.stream.Collectors.joining(", "));
        }

        event.addTemplateData("petName", pet.getName())
                .addTemplateData("appointmentDate", formattedDate)
                .addTemplateData("appointmentTime", formattedTime)
                .addTemplateData("reason", reason)
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
            logger.warn("User {} has no email. Skipping promotion.", user.getUserName());
            return;
        }

        EmailEvent event = new EmailEvent(
                EmailEventType.PROMOTION.getEventName(),
                user.getId(),
                user.getEmail(),
                user.getUserName(),
                title,
                EmailEventType.PROMOTION.getTemplatePath());

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
                    templateName);

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
            case "appointment-confirmation", "vet-appointment-notification", "appointment-status-update",
                    "appointment-reminder" ->
                "appointment-email-events";
            case "promotion", "new-year-promotion", "year-end-sale" -> "promotion-email-events";
            case "system-upgrade", "password-reset", "welcome" -> "system-email-events";
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

    @Autowired
    private SpringTemplateEngine templateEngine;

    /**
     * Gửi email xác nhận appointment trực tiếp (không qua Kafka) - TRUE ASYNC
     * Gửi ngay lập tức trong background thread, không đợi
     *
     * @param user        User nhận email
     * @param pet         Thông tin thú cưng
     * @param appointment Thông tin cuộc hẹn
     * @return CompletableFuture với kết quả gửi email
     */
    public CompletableFuture<Boolean> sendDirectAppointmentConfirmationEmail(User user, Pet pet,
            Appointment appointment) {

        // Chạy ngay trong thread pool riêng, trả về CompletableFuture ngay lập tức
        return CompletableFuture.supplyAsync(() -> {
            try {
                logger.info("Sending direct appointment confirmation email to: {}", user.getEmail());

                if (user.getEmail() == null || user.getEmail().isEmpty()) {
                    logger.warn("User {} has no email. Cannot send direct email.", user.getUserName());
                    return false;
                }

                // Định dạng ngày giờ
                java.text.SimpleDateFormat dateFormatter = new java.text.SimpleDateFormat("dd/MM/yyyy");
                java.text.SimpleDateFormat timeFormatter = new java.text.SimpleDateFormat("HH:mm");
                String formattedDate = dateFormatter.format(appointment.getDate());
                String formattedTime = timeFormatter.format(appointment.getDate());

                // Lấy danh sách dịch vụ (lý do khám)
                String reason = "Khám tổng quát";
                if (appointment.getServices() != null && !appointment.getServices().isEmpty()) {
                    reason = appointment.getServices().stream()
                            .map(com.example.petcaremanagement.Entity.ServicesType::getName)
                            .collect(java.util.stream.Collectors.joining(", "));
                }

                // Tạo context cho template Thymeleaf
                Context context = new Context();
                context.setVariable("userName", user.getUserName());
                context.setVariable("userEmail", user.getEmail());
                context.setVariable("petName", pet.getName());
                context.setVariable("petSpecies", pet.getSpecies());
                context.setVariable("petBreed", pet.getBreed() != null ? pet.getBreed() : "Không rõ");
                context.setVariable("appointmentDate", formattedDate);
                context.setVariable("appointmentTime", formattedTime);
                context.setVariable("reason", reason);
                context.setVariable("status", getStatusText(appointment.getStatus()));
                context.setVariable("statusColor", getStatusColor(appointment.getStatus()));
                context.setVariable("appointmentId", appointment.getId());

                // Render template HTML
                String htmlContent = templateEngine.process("email/appointment-confirmation", context);

                // Tạo và gửi email
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setTo(user.getEmail());
                helper.setSubject("Xác nhận đặt lịch khám - Pet Care Management");
                helper.setText(htmlContent, true);

                // mailSender.send(message);

                logger.info("Direct appointment confirmation email sent successfully to: {}", user.getEmail());
                return true;

            } catch (Exception e) {
                logger.error("Failed to send direct appointment confirmation email: {}", e.getMessage(), e);
                return false;
            }
        });
    }

    /**
     * Gửi email trực tiếp với nội dung text thuần - TRUE ASYNC
     * Gửi ngay lập tức trong background thread, không đợi
     * 
     * @param to          Email người nhận
     * @param subject     Tiêu đề email
     * @param textContent Nội dung text thuần
     * @return CompletableFuture với kết quả gửi email
     */
    public CompletableFuture<Boolean> sendDirectTextEmail(String to, String subject, String textContent) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                logger.info("Sending direct text email to: {}", to);

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(textContent, false); // false = plain text

                mailSender.send(message);

                logger.info("Direct text email sent successfully to: {}", to);
                return true;
            } catch (Exception e) {
                logger.error("Failed to send direct text email to {}: {}", to, e.getMessage(), e);
                return false;
            }
        });
    }

    /**
     * Gửi email trực tiếp với HTML content (đồng bộ - chỉ dùng khi cần blocking)
     * 
     * @param to      Email người nhận
     * @param subject Tiêu đề email
     * @param content Nội dung HTML
     * @return true nếu gửi thành công, false nếu thất bại
     */
    public boolean sendDirectEmailSync(String to, String subject, String content) {
        try {
            logger.info("Sending direct email (sync) to: {}", to);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);

            logger.info("Direct email sent successfully (sync) to: {}", to);
            return true;
        } catch (Exception e) {
            logger.error("Failed to send direct email (sync) to {}: {}", to, e.getMessage(), e);
            return false;
        }
    }

}