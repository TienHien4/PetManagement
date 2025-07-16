package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.OrderDTO.OrderRequest;
import com.example.petcaremanagement.Dto.OrderDTO.OrderResponse;
import com.example.petcaremanagement.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public OrderResponse placeOrder(@RequestBody OrderRequest request) {
        return orderService.placeOrder(request);
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return orderService.searchOrderById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }

    @GetMapping("/page")
    public Page<OrderResponse> getOrdersPage(@RequestParam int pageNo, @RequestParam int pageSize) {
        return orderService.pagination(pageNo, pageSize);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable long userId) {
        var result = orderService.findOrderByUser(userId);
        return ResponseEntity.ok().body(result);
    }
}
