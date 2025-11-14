package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.PaymentDTO.VNPayRequest;
import com.example.petcaremanagement.Dto.PaymentDTO.VNPayResponse;
import com.example.petcaremanagement.Service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PaymentController {

    private final VNPayService vnPayService;

    @PostMapping("/vnpay/create")
    public ResponseEntity<VNPayResponse> createPayment(
            @RequestBody VNPayRequest request,
            HttpServletRequest httpRequest) {
        log.info("Creating VNPay payment for order: {}, amount: {} VND", request.getOrderId(), request.getAmount());
        VNPayResponse response = vnPayService.createPayment(request, httpRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay/return")
    public ResponseEntity<Map<String, String>> vnpayReturn(HttpServletRequest request) {
        int paymentStatus = vnPayService.orderReturn(request);
        Map<String, String> returnData = vnPayService.getVNPayReturn(request);
        returnData.put("status", String.valueOf(paymentStatus));

        log.info("VNPay return - Status: {}, TxnRef: {}",
                paymentStatus, returnData.get("vnp_TxnRef"));

        return ResponseEntity.ok(returnData);
    }
}