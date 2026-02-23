package com.example.petcaremanagement.Service.job;

import com.example.petcaremanagement.Dto.EmailDTO.EmailEvent;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Enum.EmailEventType;
import com.example.petcaremanagement.Repository.UserRepository;
import com.example.petcaremanagement.Service.EmailProducerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class EmailSchedulerService {

        private static final Logger logger = LoggerFactory.getLogger(EmailSchedulerService.class);

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private EmailProducerService emailProducerService;

        /**
         * Campaign 1: Khuyến mãi năm mới (00:01 ngày 1/1)
         * Cron format: second minute hour day month day-of-week
         * "0 1 0 1 1 *" = 00:01:00 ngày 1 tháng 1
         */
        @Scheduled(cron = "0 1 0 1 1 *", zone = "Asia/Ho_Chi_Minh")
        public void sendNewYearPromotionEmails() {
                logger.info("Date: {}", LocalDate.now());

                // Lấy tất cả users có email
                List<User> users = userRepository.findAll().stream()
                                .filter(user -> user.getEmail() != null && !user.getEmail().isEmpty())
                                .toList();

                logger.info("Total users to send promotion: {}", users.size());

                int year = LocalDate.now().getYear();
                String validUntil = "31/01/" + year;
                String promotionCode = "NEWYEAR" + year;

                // Gửi từng event vào Kafka với EmailEvent động
                for (User user : users) {
                        EmailEvent event = new EmailEvent(
                                        EmailEventType.PROMOTION.getEventName(),
                                        user.getId(),
                                        user.getEmail(),
                                        user.getUserName(),
                                        " CHÚC MỪNG NĂM MỚI " + year + " - GIẢM 20% DỊCH VỤ!",
                                        EmailEventType.PROMOTION.getTemplatePath());

                        // Thêm dữ liệu động vào Map
                        event.addTemplateData("promotionTitle", "Khuyến Mãi Đặc Biệt Đầu Năm " + year)
                                        .addTemplateData("promotionDescription",
                                                        " Pet Care Management xin gửi tặng bạn mã giảm giá 20% cho TẤT CẢ dịch vụ đặt lịch khám!")
                                        .addTemplateData("discountPercent", "20%")
                                        .addTemplateData("validUntil", validUntil)
                                        .addTemplateData("promotionCode", promotionCode);

                        // Gửi event vào Kafka (không chờ xử lý email)
                        emailProducerService.sendEmailEvent(event);
                }

                logger.info("All New Year promotion email events sent to Kafka successfully!");
                logger.info("Total events sent: {}", users.size());
        }

        /**
         * Campaign 2: Khuyến mãi cuối năm (00:01 ngày 20/12)
         * Cron format: second minute hour day month day-of-week
         * "0 1 0 20 12 *" = 00:01:00 ngày 20 tháng 12
         * 
         * Test: Chạy mỗi phút - "0 * * * * *"
         * Thực tế: "0 1 0 20 12 *"
         */
        @Scheduled(cron = "0 1 0 20 12 *", zone = "Asia/Ho_Chi_Minh")
        public void sendYearEndSaleEmails() {
                logger.info("========== YEAR-END SALE EMAIL CAMPAIGN STARTED ==========");
                logger.info("Date: {}", LocalDate.now());

                // Lấy tất cả users có email
                List<User> users = userRepository.findAll().stream()
                                .filter(user -> user.getEmail() != null && !user.getEmail().isEmpty())
                                .toList();

                logger.info("Total users to send year-end sale promotion: {}", users.size());

                int year = LocalDate.now().getYear();
                String validUntil = "31/12/" + year;
                String promotionCode = "YEAREND" + year;

                int successCount = 0;

                // Gửi từng event vào Kafka
                for (User user : users) {
                        try {
                                EmailEvent event = new EmailEvent(
                                                EmailEventType.YEAR_END_SALE.getEventName(),
                                                user.getId(),
                                                user.getEmail(),
                                                user.getUserName(),
                                                "SALE CUỐI NĂM " + year + " - GIẢM 30% TẤT CẢ DỊCH VỤ!",
                                                EmailEventType.YEAR_END_SALE.getTemplatePath());

                                // Thêm dữ liệu động vào Map
                                event.addTemplateData("promotionTitle", "SALE CUỐI NĂM " + year)
                                                .addTemplateData("promotionDescription",
                                                                "Chào mừng mùa lễ hội! Pet Care Management tri ân khách hàng với mã giảm giá 30% "
                                                                                + "cho TẤT CẢ dịch vụ chăm sóc thú cưng. Hãy để chúng tôi đồng hành cùng bạn và "
                                                                                + "thú cưng của bạn trong những ngày cuối năm!")
                                                .addTemplateData("discountPercent", "30%")
                                                .addTemplateData("validUntil", validUntil)
                                                .addTemplateData("promotionCode", promotionCode)
                                                .addTemplateData("year", String.valueOf(year));

                                // Gửi event vào Kafka
                                emailProducerService.sendEmailEvent(event);
                                successCount++;

                                // Log mỗi 50 users
                                if (successCount % 50 == 0) {
                                        logger.info("Sent {} email events so far...", successCount);
                                }

                        } catch (Exception e) {
                                logger.error("Failed to send email event for user {}: {}",
                                                user.getUserName(), e.getMessage());
                        }
                }

                logger.info("Year-end sale email campaign completed!");
                logger.info("Total events sent successfully: {}/{}", successCount, users.size());
                logger.info("========== YEAR-END SALE EMAIL CAMPAIGN ENDED ==========");
        }

}