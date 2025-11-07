package com.example.petcaremanagement.Enum;

public enum EmailEventType {
    APPOINTMENT_CONFIRMATION("appointment-confirmation", "email/appointment-confirmation"),
    APPOINTMENT_STATUS_UPDATE("appointment-status-update", "email/appointment-status-update"),
    APPOINTMENT_REMINDER("appointment-reminder", "email/appointment-reminder"),
    PROMOTION("promotion", "email/promotion"),
    NEW_YEAR_PROMOTION("new-year-promotion", "email/new-year-promotion"),
    SYSTEM_UPGRADE("system-upgrade", "email/system-upgrade"),
    WELCOME_EMAIL("welcome", "email/welcome"),
    PASSWORD_RESET("password-reset", "email/password-reset");

    private final String eventName;
    private final String templatePath;

    EmailEventType(String eventName, String templatePath) {
        this.eventName = eventName;
        this.templatePath = templatePath;
    }

    public String getEventName() {
        return eventName;
    }

    public String getTemplatePath() {
        return templatePath;
    }
}