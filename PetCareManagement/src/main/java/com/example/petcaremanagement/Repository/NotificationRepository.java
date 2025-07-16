package com.example.petcaremanagement.repository;

import com.example.petcaremanagement.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
