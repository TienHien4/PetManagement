package com.example.petcaremanagement.Dto.OrderDTO;

import com.example.petcaremanagement.Dto.OrderItemDTO.OrderItemRequest;

import java.util.List;

public class OrderRequest {
    private Long userId;
    private List<OrderItemRequest> items;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}
