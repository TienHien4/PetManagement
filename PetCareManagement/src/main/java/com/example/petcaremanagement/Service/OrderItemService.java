package com.example.petcaremanagement.Service;


import com.example.petcaremanagement.Dto.OrderItemDTO.OrderItemRequest;
import com.example.petcaremanagement.Dto.OrderItemDTO.OrderItemResponse;

import java.util.List;

public interface OrderItemService {
    List<OrderItemResponse> findAll();

    OrderItemResponse findById(Long id);

    OrderItemResponse save(OrderItemRequest orderItemRequest);

    void deleteById(Long id);
}
