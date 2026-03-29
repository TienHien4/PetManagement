# 🤖 Hướng dẫn tích hợp ChatGPT API

## ✅ Đã tích hợp thành công!

### Backend:
- ✅ ChatbotController - API endpoint `/api/chatbot/chat`
- ✅ ChatbotService - Xử lý logic gọi OpenAI API
- ✅ DTO: ChatRequest, ChatResponse

### Frontend:
- ✅ Chatbot component với UI đẹp
- ✅ Realtime chat với typing animation
- ✅ Quick questions gợi ý
- ✅ Responsive mobile

## 🔑 Cấu hình API Key

### Bước 1: Lấy OpenAI API Key

1. Truy cập: https://platform.openai.com/api-keys
2. Đăng nhập hoặc tạo tài khoản OpenAI
3. Click **"Create new secret key"**
4. Copy API key (dạng: `sk-...`)

### Bước 2: Cấu hình trong project

Mở file `application.properties` và thay thế:

```properties
openai.api.key=YOUR_OPENAI_API_KEY_HERE
```

Thành:

```properties
openai.api.key=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

⚠️ **LƯU Ý**: 
- Không commit API key lên Git
- Nên dùng environment variables cho production

### Bước 3: Chạy ứng dụng

```bash
# Backend
cd PetCareManagement
mvn spring-boot:run

# Frontend (terminal mới)
cd pet_care_management_fe
npm start
```

## 🎨 Tính năng Chatbot

### ✨ Có thể trả lời:

1. **Thông tin dịch vụ**
   - "Giá khám bệnh bao nhiêu?"
   - "Các dịch vụ có gì?"
   - "Giờ làm việc thế nào?"

2. **Hướng dẫn sử dụng**
   - "Làm sao đặt lịch?"
   - "Cách thanh toán online?"
   - "Tạo thông tin thú cưng như thế nào?"

3. **Tư vấn chăm sóc**
   - "Chó con bao nhiêu tháng tuổi tiêm phòng?"
   - "Mèo bị nôn phải làm gì?"
   - "Thức ăn cho chó con nào tốt?"

4. **Quick Questions**
   - 💉 Lịch tiêm phòng
   - 💰 Giá dịch vụ
   - 📅 Cách đặt lịch
   - 🏥 Giờ làm việc

## 📊 Chi phí

**GPT-3.5 Turbo** (Khuyến nghị):
- Input: $0.50 / 1M tokens
- Output: $1.50 / 1M tokens
- ~500 tin nhắn = $0.01

**GPT-4** (Thông minh hơn nhưng đắt):
- Input: $5.00 / 1M tokens
- Output: $15.00 / 1M tokens

💡 **Khuyến nghị**: Bắt đầu với GPT-3.5 Turbo, đủ tốt cho hầu hết trường hợp.

## 🛠️ Custom Chatbot

### Thay đổi System Prompt

File: `ChatbotServiceImpl.java` - dòng 27

```java
private static final String SYSTEM_PROMPT = """
    // Thay đổi tại đây để custom hành vi của chatbot
    """;
```

### Thêm context từ database

```java
@Override
public ChatResponse chat(ChatRequest request) {
    // Lấy thông tin user từ DB
    String userContext = getUserContext(userId);
    
    // Thêm vào system prompt
    String enhancedPrompt = SYSTEM_PROMPT + "\n\n" + userContext;
    
    // ...
}
```

### Lưu lịch sử chat

Tạo Entity:

```java
@Entity
public class ChatHistory {
    @Id
    @GeneratedValue
    private Long id;
    
    private Long userId;
    private String message;
    private String reply;
    private LocalDateTime timestamp;
}
```

## 🔒 Bảo mật

### 1. Rate Limiting

```java
@RateLimiter(name = "chatbot", fallbackMethod = "chatFallback")
public ChatResponse chat(ChatRequest request) {
    // ...
}
```

### 2. Authentication

```java
@PreAuthorize("isAuthenticated()")
@PostMapping("/chat")
public ChatResponse chat(@RequestBody ChatRequest request) {
    // Chỉ user đã đăng nhập mới chat được
}
```

### 3. Input Validation

```java
if (request.getMessage().length() > 500) {
    throw new IllegalArgumentException("Tin nhắn quá dài!");
}
```

## 📱 UI Customization

File: `Chatbot.css`

### Thay đổi màu sắc

```css
/* Gradient chính */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Thay bằng màu của bạn */
background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
```

### Vị trí chatbot

```css
.chatbot-toggle {
  bottom: 30px;  /* Khoảng cách từ đáy */
  right: 30px;   /* Khoảng cách từ phải */
}
```

## 🚀 Nâng cấp

### Thêm Voice Chat

```bash
npm install react-speech-recognition
```

### Thêm File Upload

```javascript
const sendImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('message', 'Thú cưng của tôi có vấn đề gì?');
  
  // Call API with image
};
```

### Multi-language

```java
@Value("${chatbot.language:vi}")
private String language;

// Adjust system prompt based on language
```

## 🐛 Troubleshooting

### Lỗi 401 Unauthorized
```
→ Kiểm tra API key đúng chưa
→ API key còn hạn không
→ Tài khoản OpenAI còn credit không
```

### Chatbot không trả lời
```
→ Check logs backend
→ Kiểm tra network tab trong browser
→ Verify CORS đã cấu hình
```

### Response chậm
```
→ Giảm max_tokens xuống 300
→ Dùng gpt-3.5-turbo thay vì gpt-4
→ Cache câu hỏi phổ biến
```

## 📚 Tài liệu tham khảo

- OpenAI API: https://platform.openai.com/docs/api-reference
- Pricing: https://openai.com/pricing
- Best Practices: https://platform.openai.com/docs/guides/production-best-practices

## 🎯 Roadmap

- [ ] Lưu lịch sử chat vào database
- [ ] Thêm feedback thumbs up/down
- [ ] Analytics: track câu hỏi phổ biến
- [ ] Multi-language support
- [ ] Voice chat
- [ ] Image recognition

---

**Tạo bởi**: GitHub Copilot 🤖
**Version**: 1.0.0
**Last Updated**: February 20, 2026
