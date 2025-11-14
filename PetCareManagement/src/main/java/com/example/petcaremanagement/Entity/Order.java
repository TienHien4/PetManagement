package com.example.petcaremanagement.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    private int totalQuantity;
    private double totalPrice;
    private LocalDateTime orderDate;

    @Column(name = "status", length = 20)
    private String status; // PENDING, PAID, CANCELLED, COMPLETED

    @Column(name = "payment_method", length = 20)
    private String paymentMethod; // VNPAY, COD

    @Column(name = "vnpay_txn_ref", length = 50)
    private String vnpayTxnRef; // VNPay transaction reference

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;
}
