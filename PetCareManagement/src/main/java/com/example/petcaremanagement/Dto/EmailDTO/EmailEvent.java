package com.example.petcaremanagement.Dto.EmailDTO;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class EmailEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String eventType;
    private Long userId;
    private String userEmail;
    private String userName;
    private String subject;
    private String templateName;
    private Map<String, Object> templateData;

    public EmailEvent() {
        this.templateData = new HashMap<>();
    }

    public EmailEvent(String eventType, Long userId, String userEmail, String userName,
                      String subject, String templateName) {
        this.eventType = eventType;
        this.userId = userId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.subject = subject;
        this.templateName = templateName;
        this.templateData = new HashMap<>();
    }

    public EmailEvent addTemplateData(String key, Object value) {
        this.templateData.put(key, value);
        return this;
    }

    public EmailEvent addAllTemplateData(Map<String, Object> data) {
        this.templateData.putAll(data);
        return this;
    }

    // Getters and Setters
    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public Map<String, Object> getTemplateData() {
        return templateData;
    }

    public void setTemplateData(Map<String, Object> templateData) {
        this.templateData = templateData;
    }

    @Override
    public String toString() {
        return "EmailEvent{" +
                "eventType='" + eventType + '\'' +
                ", userId=" + userId +
                ", userEmail='" + userEmail + '\'' +
                ", userName='" + userName + '\'' +
                ", subject='" + subject + '\'' +
                ", templateName='" + templateName + '\'' +
                '}';
    }
}