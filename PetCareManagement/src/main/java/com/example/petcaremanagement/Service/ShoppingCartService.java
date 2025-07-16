package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.ShoppingCartDTO.ShoppingCartRequest;
import com.example.petcaremanagement.Dto.CartItemDTO.CartItemResponse;

import java.util.List;

public interface ShoppingCartService {
    CartItemResponse addItem(ShoppingCartRequest request, long userId, long productId);

    void deleteItem(long userId, long productId);

    List<CartItemResponse> getAllItem(long userId);

    CartItemResponse reduceItem(long userId, long productId);
}
