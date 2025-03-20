package com.example.petcaremanagement.Entity;

import com.example.petcaremanagement.Enum.NotificationStatus;
import com.example.petcaremanagement.Enum.NotificationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    private String message;
    @Enumerated(EnumType.STRING)
    private NotificationType type = NotificationType.SYSTEM;
    @Enumerated(EnumType.STRING)
    private NotificationStatus status = NotificationStatus.PENDING;
}
