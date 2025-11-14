package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.PaymentDTO.VNPayRequest;
import com.example.petcaremanagement.Dto.PaymentDTO.VNPayResponse;
import com.example.petcaremanagement.Service.OrderService;
import com.example.petcaremanagement.Service.VNPayService;
import com.example.petcaremanagement.config.VNPayConfig;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayServiceImpl implements VNPayService {

    private final VNPayConfig vnPayConfig;
    private final OrderService orderService;

    @Override
    public VNPayResponse createPayment(VNPayRequest request, HttpServletRequest httpRequest) {
        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
            String vnp_IpAddr = getIpAddress(httpRequest);
            String vnp_TmnCode = vnPayConfig.getTmnCode();
            String orderType = request.getOrderType() != null ? request.getOrderType() : "other";

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(request.getAmount() * 100)); // VNPay yêu cầu số tiền * 100
            vnp_Params.put("vnp_CurrCode", "VND");

            if (request.getBankCode() != null && !request.getBankCode().isEmpty()) {
                vnp_Params.put("vnp_BankCode", request.getBankCode());
            }

            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", request.getOrderInfo());
            vnp_Params.put("vnp_OrderType", orderType);
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    // Build hash data - PLAIN TEXT (NO encoding)
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(fieldValue);

                    // Build query - URL encoded
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));

                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }

            String queryUrl = query.toString();
            String hashDataString = hashData.toString();

            log.info("=== VNPay Payment Debug ===");
            log.info("Hash Secret: {}", vnPayConfig.getHashSecret());
            log.info("Hash Data (plain text): {}", hashDataString);

            String vnp_SecureHash = VNPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashDataString);
            log.info("Generated SecureHash: {}", vnp_SecureHash);

            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
            String paymentUrl = vnPayConfig.getVnpUrl() + "?" + queryUrl;

            log.info("Final Payment URL: {}", paymentUrl);
            log.info("========================");

            return VNPayResponse.builder()
                    .code("00")
                    .message("success")
                    .paymentUrl(paymentUrl)
                    .build();

        } catch (Exception e) {
            return VNPayResponse.builder()
                    .code("99")
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public int orderReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        String hashData = VNPayConfig.hashAllFields(fields);
        String signValue = VNPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData);

        log.info("=== VNPay Return Verification ===");
        log.info("Hash Data: {}", hashData);
        log.info("Received SecureHash: {}", vnp_SecureHash);
        log.info("Calculated SecureHash: {}", signValue);
        log.info("Match: {}", signValue.equals(vnp_SecureHash));
        log.info("================================");

        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                // Payment success - update order status
                try {
                    String vnpTxnRef = request.getParameter("vnp_TxnRef");
                    String orderInfo = request.getParameter("vnp_OrderInfo");

                    // Extract orderId from orderInfo (format: "Thanh toán đơn hàng #123")
                    if (orderInfo != null && orderInfo.contains("#")) {
                        String orderIdStr = orderInfo.substring(orderInfo.lastIndexOf("#") + 1);
                        Long orderId = Long.parseLong(orderIdStr);

                        orderService.updateOrderPaymentStatus(orderId, "PAID", vnpTxnRef);
                        log.info("Updated order {} to PAID status", orderId);
                    }
                } catch (Exception e) {
                    log.error("Error updating order status", e);
                }
                return 1; // Success
            } else {
                return 0; // Failed
            }
        } else {
            return -1; // Invalid signature
        }
    }

    @Override
    public Map<String, String> getVNPayReturn(HttpServletRequest request) {
        Map<String, String> result = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            result.put(fieldName, fieldValue);
        }
        return result;
    }

    private String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAdress = "Invalid IP:" + e.getMessage();
        }
        return ipAdress;
    }
}
