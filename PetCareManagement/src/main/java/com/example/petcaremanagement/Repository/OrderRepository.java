package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.Order;
import com.example.petcaremanagement.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
