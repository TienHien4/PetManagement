package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Entity.Appointment;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Service.EmailProducerService;
import com.example.petcaremanagement.Service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class EmailServiceIplm implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceIplm.class);

    @Autowired
    private EmailProducerService emailProducerService;
    @Autowired
    private JavaMailSender mailSender;

    @Value("classpath:templates/email/appointment-confirmation.html")
    private Resource appointmentConfirmationTemplate;

    @Value("classpath:templates/email/appointment-status-update.html")
    private Resource appointmentStatusUpdateTemplate;


    /**
     * Gửi email xác nhận đặt lịch khám (qua Kafka - BẤT ĐỒNG BỘ)
     */
    @Override
    public void sendAppointmentConfirmation(Appointment appointment, User user, Pet pet) {
        try {
            logger.info("=== SENDING APPOINTMENT CONFIRMATION VIA KAFKA ===");
            logger.info("User: {} (ID: {}, Email: {})", user.getUserName(), user.getId(), user.getEmail());
            logger.info("Pet: {} ({})", pet.getName(), pet.getSpecies());
            logger.info("Appointment ID: {}, Date: {}", appointment.getId(), appointment.getDate());
            logger.info("Status: {}", appointment.getStatus());
            logger.info("=========================================================");

            // Validate
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                logger.warn("User {} has no email address. Email notification skipped.", user.getUserName());
                return;
            }
            // Gửi vào Kafka (BẤT ĐỒNG BỘ - không chờ)
            emailProducerService.sendAppointmentConfirmationEmail(user, pet, appointment);
            logger.info("Appointment confirmation email event sent to Kafka successfully");

        } catch (Exception e) {
            logger.error("Failed to send appointment confirmation event to Kafka", e);
        }
    }


    @Override
    public void sendAppointmentStatusUpdate(Appointment appointment, User user, Pet pet,
                                            String oldStatus, String newStatus) {
        try {
            logger.info("User: {} ({})", user.getUserName(), user.getEmail());
            logger.info("Pet: {}", pet.getName());
            logger.info("Appointment ID: {}", appointment.getId());
            logger.info("Status Change: {} → {}", oldStatus, newStatus);
            logger.info("==========================================");

            // Validate
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                logger.warn("User {} has no email address. Email notification skipped.", user.getUserName());
                return;
            }

            // Gửi vào Kafka
            emailProducerService.sendAppointmentStatusUpdateEmail(user, pet, appointment, oldStatus, newStatus);

            logger.info("Status update email event sent to Kafka successfully");

        } catch (Exception e) {
            logger.error("Failed to send status update event to Kafka", e);
            logger.warn("Status updated successfully but email notification may fail");
        }
    }

    @Override
    public void sendAppointmentStatusUpdate(Appointment appointment, String oldStatus, String newStatus) {
        logger.warn("sendAppointmentStatusUpdate called without user/pet info. Email not sent.");
    }

    /**
     * Gửi email xác nhận đặt lịch khám trực tiếp qua SMTP (ĐỒNG BỘ)
     */
    @Override
    public void sendAppointmentConfirmationDirect(Appointment appointment, User user, Pet pet) {
        try {
            logger.info("=== SENDING APPOINTMENT CONFIRMATION VIA SMTP ===");
            logger.info("User: {} (ID: {}, Email: {})", user.getUserName(), user.getId(), user.getEmail());
            logger.info("Pet: {} ({})", pet.getName(), pet.getSpecies());
            logger.info("Appointment ID: {}, Date: {}", appointment.getId(), appointment.getDate());

            // Validate
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                logger.warn("User {} has no email address. Email notification skipped.", user.getUserName());
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận đặt lịch khám cho thú cưng");

            // Đọc template từ file
            String emailContent = loadTemplate(appointmentConfirmationTemplate);
            emailContent = populateAppointmentConfirmationTemplate(emailContent, appointment, user, pet);

            helper.setText(emailContent, true);

            mailSender.send(message);
            logger.info("Appointment confirmation email sent successfully via SMTP");

        } catch (MessagingException | IOException e) {
            logger.error("Failed to send appointment confirmation email via SMTP", e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Gửi email cập nhật trạng thái lịch hẹn trực tiếp qua SMTP (ĐỒNG BỘ)
     */
    @Override
    public void sendAppointmentStatusUpdateDirect(Appointment appointment, User user, Pet pet,
                                                  String oldStatus, String newStatus) {
        try {
            logger.info("=== SENDING STATUS UPDATE VIA SMTP ===");
            logger.info("User: {} ({})", user.getUserName(), user.getEmail());
            logger.info("Status Change: {} → {}", oldStatus, newStatus);

            // Validate
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                logger.warn("User {} has no email address. Email notification skipped.", user.getUserName());
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Cập nhật trạng thái lịch khám - " + pet.getName());

            // Đọc template từ file
            String emailContent = loadTemplate(appointmentStatusUpdateTemplate);
            emailContent = populateStatusUpdateTemplate(emailContent, appointment, user, pet, oldStatus, newStatus);

            helper.setText(emailContent, true);

            mailSender.send(message);
            logger.info("Status update email sent successfully via SMTP");

        } catch (MessagingException | IOException e) {
            logger.error("Failed to send status update email via SMTP", e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Đọc nội dung template từ file resource
     */
    private String loadTemplate(Resource resource) throws IOException {
        return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
    }

    /**
     * Thay thế các placeholder trong template xác nhận lịch hẹn
     */
    private String populateAppointmentConfirmationTemplate(String template, Appointment appointment, User user, Pet pet) {
        return template
                .replace("{{userName}}", user.getUserName())
                .replace("{{petName}}", pet.getName())
                .replace("{{appointmentId}}", String.valueOf(appointment.getId()))
                .replace("{{petSpecies}}", pet.getSpecies())
                .replace("{{appointmentDate}}", appointment.getDate().toString())
                .replace("{{appointmentStatus}}", appointment.getStatus());
    }

    /**
     * Thay thế các placeholder trong template cập nhật trạng thái
     */
    private String populateStatusUpdateTemplate(String template, Appointment appointment, User user, Pet pet,
                                                String oldStatus, String newStatus) {
        return template
                .replace("{{userName}}", user.getUserName())
                .replace("{{petName}}", pet.getName())
                .replace("{{appointmentId}}", String.valueOf(appointment.getId()))
                .replace("{{oldStatus}}", oldStatus)
                .replace("{{newStatus}}", newStatus)
                .replace("{{appointmentDate}}", appointment.getDate().toString());
    }
}