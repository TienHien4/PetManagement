package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.PaymentDTO.VNPayRequest;
import com.example.petcaremanagement.Dto.PaymentDTO.VNPayResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

public interface VNPayService {
    VNPayResponse createPayment(VNPayRequest request, HttpServletRequest httpRequest);
    int orderReturn(HttpServletRequest request);
    Map<String, String> getVNPayReturn(HttpServletRequest request);
}
