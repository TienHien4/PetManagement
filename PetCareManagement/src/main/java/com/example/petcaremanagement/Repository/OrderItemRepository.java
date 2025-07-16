package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
