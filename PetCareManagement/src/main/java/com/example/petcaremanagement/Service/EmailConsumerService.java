package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.EmailDTO.EmailEvent;
import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
public class EmailConsumerService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailConsumerService() {
        System.out.println("EmailConsumerService CONSTRUCTOR called");
    }


//    @KafkaListener(
//            topics = "appointment-email-events",
//            groupId = "${spring.kafka.consumer.group-id}",
//            containerFactory = "emailKafkaListenerFactory"
//    )
    public void consumeAppointmentEmailEvent(EmailEvent event, Acknowledgment acknowledgment) {
        System.out.println("MESSAGE RECEIVED FROM KAFKA!");
        System.out.println("User: " + event.getUserName());
        System.out.println("Email: " + event.getUserEmail());

        processEmailEvent(event, acknowledgment);
    }
    
//    @KafkaListener(
//            topics = "string-test-topic",
//            groupId = "test-group-string",
//            containerFactory = "stringKafkaListenerFactory"
//    )
    public void listenStringTest(String message) {
        System.out.println("============================================");
        System.out.println("Nội dung: " + message);
        System.out.println("============================================");
    }

    private void processEmailEvent(EmailEvent event, Acknowledgment acknowledgment) {
        try {
            if (event.getUserEmail() == null || event.getUserEmail().isEmpty()) {
                if (acknowledgment != null) acknowledgment.acknowledge();
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(event.getUserEmail());
            helper.setSubject(event.getSubject());

            Context context = new Context();
            context.setVariable("userName", event.getUserName());
            context.setVariable("userEmail", event.getUserEmail());

            if (event.getTemplateData() != null) {
                event.getTemplateData().forEach(context::setVariable);
            }

            String htmlContent = templateEngine.process(event.getTemplateName(), context);
            helper.setText(htmlContent, true);

            System.out.println("Sending email to: " + event.getUserEmail());
            mailSender.send(message);
            System.out.println("Email sent successfully!");

            if (acknowledgment != null) {
                acknowledgment.acknowledge();
            }

            Thread.sleep(500);

        } catch (MessagingException e) {
            System.err.println("SMTP Error: " + e.getMessage());
            e.printStackTrace();

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}