# 🎄 Hệ thống Email Campaign với Kafka

## 📋 Tổng quan

Hệ thống gửi email tự động theo lịch trình (cron job) sử dụng **Spring Scheduler** và **Apache Kafka** để xử lý bất đồng bộ.

## 🎯 Các Campaign Email

### 1. **Khuyến mãi Năm Mới** 🎊
- **Thời gian**: 00:01 ngày 1/1 hàng năm
- **Mã giảm giá**: 20%
- **Cron**: `0 1 0 1 1 *`
- **Event Type**: `NEW_YEAR_PROMOTION`
- **Template**: `email/new-year-promotion.html`

### 2. **Sale Cuối Năm** 🎁
- **Thời gian**: 00:01 ngày 20/12 hàng năm
- **Mã giảm giá**: 30%
- **Cron**: `0 1 0 20 12 *`
- **Event Type**: `YEAR_END_SALE`
- **Template**: `email/year-end-sale.html`

## 🔧 Cấu hình

### 1. Enable Scheduling
```java
@SpringBootApplication
@EnableScheduling  // ✅ Đã enable
@EnableKafka       // ✅ Đã enable
public class PetCareManagementApplication { }
```

### 2. Kafka Configuration
```properties
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.group-id=pet-care-email-group
spring.kafka.consumer.auto-offset-reset=earliest
```

### 3. Kafka Topics
- `appointment-email-events` - Email lịch hẹn
- `promotion-email-events` - Email khuyến mãi (NEW_YEAR, YEAR_END_SALE)
- `system-email-events` - Email hệ thống

## 📊 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────────┐
│  1. SCHEDULER (Cron Job)                                        │
│     - EmailSchedulerService.sendYearEndSaleEmails()             │
│     - Chạy tự động lúc 00:01 ngày 20/12                         │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. TẠO EMAIL EVENT                                             │
│     - Lấy danh sách users từ Database                           │
│     - Tạo EmailEvent cho từng user                              │
│     - Event type: "year-end-sale"                               │
│     - Template: "email/year-end-sale"                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. KAFKA PRODUCER                                              │
│     - EmailProducerService.sendEmailEvent(event)                │
│     - Gửi event vào topic "promotion-email-events"              │
│     - Non-blocking, trả về ngay lập tức                         │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. KAFKA BROKER                                                │
│     - Lưu trữ message trong partition                           │
│     - Đảm bảo message không bị mất                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. KAFKA CONSUMER                                              │
│     - EmailConsumerService.consumePromotionEmailEvent()         │
│     - @KafkaListener lắng nghe topic                            │
│     - Xử lý từng event một                                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. RENDER TEMPLATE & SEND EMAIL                                │
│     - Thymeleaf render HTML từ template                         │
│     - JavaMailSender gửi email qua SMTP                         │
│     - Acknowledge message                                       │
└─────────────────────────────────────────────────────────────────┘
```

## 🧪 Test Campaign

### 1. Start Kafka
```bash
# Start Zookeeper
docker-compose up zookeeper -d

# Start Kafka
docker-compose up kafka -d
```

### 2. Test API Endpoints

#### Test Year-End Sale Campaign
```bash
curl http://localhost:8080/api/email-test/year-end-sale
```

Response:
```json
{
  "success": true,
  "message": "Year-End Sale emails sent successfully!",
  "campaign": "YEAR_END_SALE_2025",
  "discount": "30%"
}
```

#### Test New Year Campaign
```bash
curl http://localhost:8080/api/email-test/new-year-promotion
```

#### Check Status
```bash
curl http://localhost:8080/api/email-test/status
```

## 📝 Cấu trúc Code

```
PetCareManagement/
├── src/main/java/com/example/petcaremanagement/
│   ├── Service/
│   │   ├── job/
│   │   │   └── EmailSchedulerService.java      # ⏰ Cron Jobs
│   │   ├── EmailProducerService.java           # 📤 Kafka Producer
│   │   └── EmailConsumerService.java           # 📥 Kafka Consumer
│   ├── Controller/
│   │   └── EmailTestController.java            # 🧪 Test API
│   ├── Dto/EmailDTO/
│   │   └── EmailEvent.java                     # 📦 Email Event DTO
│   └── Enum/
│       └── EmailEventType.java                 # 📋 Event Types
├── src/main/resources/
│   └── templates/email/
│       ├── year-end-sale.html                  # 🎄 Template cuối năm
│       └── new-year-promotion.html             # 🎊 Template năm mới
└── docker-compose.yml                          # 🐳 Kafka setup
```

## 🎨 Template Variables

Template `year-end-sale.html` sử dụng các biến:

```html
${userName}              - Tên người dùng
${promotionTitle}        - Tiêu đề khuyến mãi
${promotionDescription}  - Mô tả chi tiết
${discountPercent}       - Phần trăm giảm giá (VD: "30%")
${promotionCode}         - Mã giảm giá (VD: "YEAREND2025")
${validUntil}            - Ngày hết hạn (VD: "31/12/2025")
${year}                  - Năm hiện tại
```

## ⚙️ Cấu hình Cron Expression

Format: `second minute hour day month day-of-week`

| Campaign | Cron | Giải thích |
|----------|------|------------|
| Year-End Sale | `0 1 0 20 12 *` | 00:01:00 ngày 20 tháng 12 |
| New Year | `0 1 0 1 1 *` | 00:01:00 ngày 1 tháng 1 |

### Ví dụ Cron khác:
```java
// Mỗi phút (test)
@Scheduled(cron = "0 * * * * *")

// Mỗi ngày lúc 8h sáng
@Scheduled(cron = "0 0 8 * * *")

// Thứ 2 đầu tiên mỗi tháng lúc 9h sáng
@Scheduled(cron = "0 0 9 1-7 * MON")

// Mỗi 30 phút
@Scheduled(cron = "0 */30 * * * *")
```

## 📊 Monitoring

### Kafka Topic Messages
```bash
# Xem messages trong topic
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic promotion-email-events \
  --from-beginning
```

### Application Logs
```
🎄 ========== YEAR-END SALE EMAIL CAMPAIGN STARTED ==========
📅 Date: 2025-12-20
👥 Total users to send year-end sale promotion: 150
📤 Sent 50 email events so far...
📤 Sent 100 email events so far...
📤 Sent 150 email events so far...
✅ Year-end sale email campaign completed!
📧 Total events sent successfully: 150/150
🎄 ========== YEAR-END SALE EMAIL CAMPAIGN ENDED ==========
```

## 🔐 Security Notes

⚠️ **QUAN TRỌNG**: 
- `EmailTestController` chỉ dùng để test
- Nên disable hoặc xóa trên môi trường production
- Thêm authentication nếu cần giữ lại

```java
@PreAuthorize("hasRole('ADMIN')")  // Thêm security
@GetMapping("/year-end-sale")
public ResponseEntity<?> testYearEndSale() { ... }
```

## 🚀 Deployment

### Production Checklist:
- [ ] Disable/Remove `EmailTestController`
- [ ] Cấu hình SMTP server thật
- [ ] Set đúng timezone: `Asia/Ho_Chi_Minh`
- [ ] Test Kafka connection
- [ ] Enable consumer (`@KafkaListener`)
- [ ] Set up monitoring & alerting
- [ ] Backup email templates
- [ ] Test cron schedule

## 📚 Tài liệu tham khảo

- [Spring Scheduling](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#scheduling)
- [Spring Kafka](https://docs.spring.io/spring-kafka/reference/html/)
- [Cron Expression](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/support/CronExpression.html)
- [Thymeleaf](https://www.thymeleaf.org/doc/tutorials/3.0/thymeleafspring.html)

## 🐛 Troubleshooting

### Scheduler không chạy
```java
// Kiểm tra @EnableScheduling
@SpringBootApplication
@EnableScheduling  // ← Phải có
```

### Kafka connection error
```bash
# Kiểm tra Kafka đang chạy
docker ps | grep kafka

# Restart Kafka
docker-compose restart kafka
```

### Email không gửi
- Kiểm tra SMTP config trong `application.properties`
- Kiểm tra consumer có enable không
- Xem logs để tìm lỗi

---

**Tạo bởi**: Pet Care Management Team
**Ngày**: 22/12/2025
**Version**: 1.0
