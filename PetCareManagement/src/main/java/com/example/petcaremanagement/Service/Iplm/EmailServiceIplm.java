package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Entity.Appointment;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Service.EmailProducerService;
import com.example.petcaremanagement.Service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceIplm implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceIplm.class);

    @Autowired
    private EmailProducerService emailProducerService;

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
                logger.warn("⚠ User {} has no email address. Email notification skipped.", user.getUserName());
                return;
            }
            // Gửi vào Kafka (BẤT ĐỒNG BỘ - không chờ)
            emailProducerService.sendAppointmentConfirmationEmail(user, pet, appointment);
            logger.info("Appointment confirmation email event sent to Kafka successfully");

        } catch (Exception e) {
            logger.error("Failed to send appointment confirmation event to Kafka", e);
        }
    }

    /**
     * 🔔 Gửi email cập nhật trạng thái (qua Kafka - BẤT ĐỒNG BỘ)
     */
    @Override
    public void sendAppointmentStatusUpdate(Appointment appointment, User user, Pet pet,
                                            String oldStatus, String newStatus) {
        try {
            logger.info("=== 🔔 SENDING STATUS UPDATE VIA KAFKA ===");
            logger.info("User: {} ({})", user.getUserName(), user.getEmail());
            logger.info("Pet: {}", pet.getName());
            logger.info("Appointment ID: {}", appointment.getId());
            logger.info("Status Change: {} → {}", oldStatus, newStatus);
            logger.info("==========================================");

            // Validate
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                logger.warn("⚠️ User {} has no email address. Email notification skipped.", user.getUserName());
                return;
            }

            // Gửi vào Kafka
            emailProducerService.sendAppointmentStatusUpdateEmail(user, pet, appointment, oldStatus, newStatus);

            logger.info("✅ Status update email event sent to Kafka successfully");

        } catch (Exception e) {
            logger.error("❌ Failed to send status update event to Kafka", e);
            logger.warn("⚠️ Status updated successfully but email notification may fail");
        }
    }

    @Override
    public void sendAppointmentStatusUpdate(Appointment appointment, String oldStatus, String newStatus) {
        logger.warn("⚠️ sendAppointmentStatusUpdate called without user/pet info. Email not sent.");
    }
}