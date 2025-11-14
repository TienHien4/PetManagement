package com.example.petcaremanagement.Dto.PaymentDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VNPayRequest {
    private Long orderId;
    private Long amount; // VND
    private String orderInfo;
    private String orderType;
    private String bankCode;
}