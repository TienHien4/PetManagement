package com.example.petcaremanagement.Service;


import com.example.petcaremanagement.Dto.OrderDTO.OrderRequest;
import com.example.petcaremanagement.Dto.OrderDTO.OrderResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(OrderRequest request);

    List<OrderResponse> getAllOrders();

    void deleteOrder(Long orderId);

    Page<OrderResponse> pagination(int pageNo, int pageSize);

    OrderResponse searchOrderById(Long orderId);
    List<OrderResponse> findOrderByUser(long userId);
}
