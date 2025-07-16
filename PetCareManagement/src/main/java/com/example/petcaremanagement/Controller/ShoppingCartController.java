package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.ShoppingCartDTO.ShoppingCartRequest;
import com.example.petcaremanagement.Dto.CartItemDTO.CartItemResponse;
import com.example.petcaremanagement.Service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shopping-cart")
public class ShoppingCartController {
    @Autowired
    private ShoppingCartService shoppingCartService;

    @PostMapping("/add")
    public CartItemResponse addItem(@RequestBody ShoppingCartRequest request,
            @RequestParam long userId,
            @RequestParam long productId) {
        return shoppingCartService.addItem(request, userId, productId);
    }

    @DeleteMapping("/delete")
    public void deleteItem(@RequestParam long userId, @RequestParam long productId) {
        shoppingCartService.deleteItem(userId, productId);
    }

    @GetMapping("/items")
    public List<CartItemResponse> getAllItems(@RequestParam long userId) {
        return shoppingCartService.getAllItem(userId);
    }

    @PostMapping("/reduce")
    public CartItemResponse reduceItem(@RequestParam long userId, @RequestParam long productId) {
        return shoppingCartService.reduceItem(userId, productId);
    }
}
