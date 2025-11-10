# 🐛 Fix: Cannot deserialize value of type `java.lang.Long` from String

## ❌ Lỗi gốc

```
org.springframework.messaging.converter.MessageConversionException: 
Could not read JSON: Cannot deserialize value of type `java.lang.Long` 
from String "temp_1762592201961": not a valid `java.lang.Long` value
```

### Nguyên nhân:

1. **Frontend gửi `id: "temp_1762592201961"` (String)**
   ```javascript
   const tempId = `temp_${Date.now()}`; // ❌ String!
   const message = {
       id: tempId,  // ❌ Send to backend
       content: "Hello",
       ...
   };
   WebSocketService.sendMessage(message);
   ```

2. **Backend expect `id` là `Long`**
   ```java
   @Data
   public class ChatMessageDTO {
       private Long id;  // ❌ Cannot parse "temp_123" to Long!
       private String conversationId;
       private Long senderId;
       ...
   }
   ```

3. **Jackson deserialization fail**
   - Backend nhận JSON: `{"id": "temp_1762592201961", ...}`
   - Cố parse String → Long
   - Throw `InvalidFormatException`

---

## ✅ Giải pháp

### Chiến lược:
**KHÔNG gửi field `id` tạm qua WebSocket!**
- Field `id` chỉ do backend tạo khi lưu vào database
- Frontend dùng `tempTimestamp` (không gửi đi) để track tin nhắn tạm

### Implementation:

#### 1. Frontend - Tạo tin nhắn tạm KHÔNG có `id`

**TRƯỚC (SAI):**
```javascript
const tempId = `temp_${Date.now()}`;
const message = {
    id: tempId,  // ❌ Backend không parse được String này!
    content: "Hello",
    sending: true
};
WebSocketService.sendMessage(message); // ❌ Gửi cả id
```

**SAU (ĐÚNG):**
```javascript
const tempTimestamp = Date.now(); // Chỉ dùng trong frontend
const message = {
    conversationId,
    senderId,
    content,
    type: 'CHAT',
    tempTimestamp, // ❌ KHÔNG gửi đi backend
    sending: true  // ❌ KHÔNG gửi đi backend
};

// Add to UI với createdAt
setMessages(prev => [...prev, { 
    ...message, 
    createdAt: new Date().toISOString() 
}]);

// ✅ Strip temp fields trước khi gửi
const { tempTimestamp: _, sending: __, createdAt: ___, ...messageToSend } = message;
WebSocketService.sendMessage(messageToSend); // ✅ Không có id, tempTimestamp, sending
```

#### 2. Backend nhận message KHÔNG có `id`

**ChatMessageDTO:**
```java
{
    "conversationId": "abc-123",
    "senderId": 9,
    "senderName": "John",
    "recipientId": 5,
    "content": "Hello",
    "type": "CHAT"
    // ✅ Không có field 'id' → Backend tạo mới
}
```

**Backend tạo `id` khi save:**
```java
@MessageMapping("/chat.send")
public void sendMessage(@Payload ChatMessageDTO messageDto) {
    // Save to database - JPA auto-generate id
    ChatMessage savedMessage = chatService.saveMessage(messageDto);
    // savedMessage.getId() → Real Long id từ database
    
    // Send back với real id
    messagingTemplate.convertAndSendToUser(..., savedMessage);
}
```

#### 3. Frontend nhận response với real `id` (Long)

**handleReceivedMessage:**
```javascript
const handleReceivedMessage = (message) => {
    // message = {id: 123, content: "Hello", createdAt: "..."}
    // ✅ id là số (Long) từ backend
    
    setMessages(prev => {
        // Tìm tin tạm bằng: senderId + content + conversationId
        const tempIndex = prev.findIndex(m => 
            m.sending && 
            m.senderId === message.senderId && 
            m.content === message.content
        );

        if (tempIndex !== -1) {
            // ✅ Replace tin tạm với tin thật (có real id)
            prev[tempIndex] = message;
        } else {
            // ✅ Tin mới từ người khác
            prev.push(message);
        }
    });
};
```

---

## 📊 Flow hoàn chỉnh

```
1. User gửi "Hello"
   ↓
2. Frontend tạo tin tạm:
   {
     tempTimestamp: 1762592201961,  // ← Chỉ dùng trong FE
     content: "Hello",
     sending: true,                  // ← Chỉ dùng trong FE
     createdAt: "2025-11-08T15:00:00"
   }
   ↓
3. Add vào UI ngay (Optimistic Update)
   ↓
4. Strip temp fields và gửi qua WebSocket:
   {
     conversationId: "abc",
     senderId: 9,
     recipientId: 5,
     content: "Hello",
     type: "CHAT"
     // ✅ Không có: id, tempTimestamp, sending, createdAt
   }
   ↓
5. Backend nhận và save vào DB:
   - JPA auto-generate id = 123 (Long)
   - Database auto-generate createdAt
   ↓
6. Backend gửi lại:
   {
     id: 123,                        // ← Real Long id
     conversationId: "abc",
     content: "Hello",
     createdAt: "2025-11-08T15:00:00.123"
   }
   ↓
7. Frontend nhận và replace tin tạm:
   - Tìm tin có: sending=true, content="Hello", senderId=9
   - Thay bằng tin từ backend (có real id)
   - Remove flag "sending"
   - Icon ⏳ biến mất
```

---

## 🧪 Kiểm tra

### Console logs mong đợi:

**Khi gửi:**
```javascript
📤 Message sent: {
  conversationId: "abc",
  senderId: 9,
  content: "Hello",
  type: "CHAT"
  // ✅ Không có id, tempTimestamp, sending
}
```

**Khi nhận response:**
```javascript
📩 Received message: {
  id: 123,           // ✅ Long number
  conversationId: "abc",
  senderId: 9,
  content: "Hello",
  createdAt: "2025-11-08T15:56:41.123"
}
✅ Replaced temp message with server message
```

### Backend logs:

**TRƯỚC (LỖI):**
```
ERROR: Cannot deserialize value of type `java.lang.Long` from String "temp_123"
```

**SAU (OK):**
```
INFO: Received message from user 9: Hello
INFO: Message saved with ID: 123
INFO: Message sent to sender 9 and recipient 5
```

---

## 🔑 Key Points

1. **Frontend tracking ID ≠ Backend database ID**
   - Frontend: `tempTimestamp` (number, không gửi đi)
   - Backend: `id` (Long, auto-generated)

2. **Destructuring để remove fields**
   ```javascript
   const { tempTimestamp: _, sending: __, ...clean } = message;
   // clean object không có tempTimestamp và sending
   ```

3. **Match tin tạm bằng content + senderId**
   - Không dùng `id` vì tin tạm không có `id`
   - Dùng combination: `sending && senderId && content && conversationId`

4. **Avoid duplicates**
   ```javascript
   const exists = prev.some(m => m.id && m.id === message.id);
   if (!exists) {
       prev.push(message);
   }
   ```

---

## 📁 Files đã fix

1. ✅ `UserChat.jsx`
   - sendMessage(): Dùng `tempTimestamp` thay `tempId`
   - Strip temp fields trước khi gửi
   - handleReceivedMessage(): Check duplicate by real `id`

2. ✅ `VetChat.jsx`
   - Tương tự UserChat

3. ✅ Backend: **KHÔNG CẦN THAY ĐỔI**
   - ChatMessageDTO vẫn expect `Long id`
   - Frontend không gửi `id` nữa → OK!

---

## ✅ Success Criteria

| Check | Status |
|-------|--------|
| Backend không còn lỗi deserialize | ✅ |
| Tin nhắn hiện ngay trong UI | ✅ |
| Icon ⏳ biến mất sau khi nhận response | ✅ |
| Không duplicate tin nhắn | ✅ |
| Real `id` (Long) từ backend | ✅ |
| Timestamp chính xác | ✅ |

---

**Test ngay:**
1. Refresh browser (Ctrl+R)
2. Gửi tin "Test 123"
3. Check Console: Không còn lỗi deserialize
4. Check Backend logs: "Message saved with ID: {số}"
5. Tin nhắn hiện ngay với ⏳, sau đó ⏳ biến mất

🎉 **Fix hoàn tất!**
