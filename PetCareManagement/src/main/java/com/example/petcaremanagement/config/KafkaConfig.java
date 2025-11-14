package com.example.petcaremanagement.config;

// (Giữ nguyên các import của bạn)
import com.example.petcaremanagement.Dto.EmailDTO.EmailEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import java.util.HashMap;
import java.util.Map;

@Configuration // BẬT LẠI CẤU HÌNH
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id:pet-care-email-group}")
    private String groupId;


    @Bean
    public ProducerFactory<String, EmailEvent> emailProducerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

        // **FIX 1: BẮT BUỘC PRODUCER KHÔNG GỬI HEADER KIỂU**
        config.put(JsonSerializer.ADD_TYPE_INFO_HEADERS, false);

        config.put(ProducerConfig.ACKS_CONFIG, "all");
        config.put(ProducerConfig.RETRIES_CONFIG, 3);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, EmailEvent> emailKafkaTemplate() {
        // Bean này sẽ được tiêm (inject) vào EmailProducerService
        return new KafkaTemplate<>(emailProducerFactory());
    }


    @Bean
    public ConsumerFactory<String, EmailEvent> emailConsumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false); // Vì dùng AckMode.MANUAL

        // **FIX 2: SỬ DỤNG CẤU HÌNH DESERIALIZER BAN ĐẦU CỦA BẠN (NÓ ĐÃ GẦN ĐÚNG)**
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer.class);
        config.put(ErrorHandlingDeserializer.VALUE_DESERIALIZER_CLASS, JsonDeserializer.class.getName());

        // **FIX 3: CÁC CÀI ĐẶT QUAN TRỌNG CHO JSONDESERIALIZER**
        // Bảo nó tin tưởng tất cả các package
        config.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        // Bảo nó không tìm header kiểu (khớp với FIX 1 của Producer)
        config.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);
        // Nếu không có header, bảo nó dùng class EmailEvent mặc định
        config.put(JsonDeserializer.VALUE_DEFAULT_TYPE, "com.example.petcaremanagement.Dto.EmailDTO.EmailEvent");

        return new DefaultKafkaConsumerFactory<>(config);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, EmailEvent> emailKafkaListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, EmailEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(emailConsumerFactory());
        factory.setConcurrency(3); // Giữ nguyên cài đặt của bạn
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE); // Cần cho Acknowledgment
        factory.setAutoStartup(true);

        return factory;
    }


    @Bean
    public ConsumerFactory<String, String> stringConsumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "test-group-string"); // Group ID cho phép thử
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        // **QUAN TRỌNG: Dùng StringDeserializer cho giá trị**
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(config);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> stringKafkaListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(stringConsumerFactory());
        factory.setAutoStartup(true);
        // Không cần AckMode.MANUAL ở đây
        return factory;
    }
}