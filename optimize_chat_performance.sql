-- Optimize Chat Performance
-- Add indexes to improve query speed

-- Index for finding messages by conversationId (used frequently in loadMessages)
CREATE INDEX IF NOT EXISTS idx_chat_message_conversation_id 
ON chat_message(conversation_id);

-- Index for finding messages by createdAt (used in ORDER BY)
CREATE INDEX IF NOT EXISTS idx_chat_message_created_at 
ON chat_message(created_at);

-- Index for finding unread messages by recipientId
CREATE INDEX IF NOT EXISTS idx_chat_message_recipient_read 
ON chat_message(recipient_id, is_read);

-- Index for finding conversations by userId
CREATE INDEX IF NOT EXISTS idx_conversation_user_id 
ON conversation(user_id);

-- Index for finding conversations by vetId
CREATE INDEX IF NOT EXISTS idx_conversation_vet_id 
ON conversation(vet_id);

-- Composite index for finding conversation by userId and vetId
CREATE INDEX IF NOT EXISTS idx_conversation_user_vet 
ON conversation(user_id, vet_id);

-- Show index information
SHOW INDEX FROM chat_message;
SHOW INDEX FROM conversation;
