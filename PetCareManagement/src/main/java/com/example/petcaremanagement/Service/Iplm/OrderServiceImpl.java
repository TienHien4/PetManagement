package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.OrderItemDTO.OrderItemRequest;
import com.example.petcaremanagement.Dto.OrderDTO.OrderRequest;
import com.example.petcaremanagement.Dto.OrderItemDTO.OrderItemResponse;
import com.example.petcaremanagement.Dto.OrderDTO.OrderResponse;
import com.example.petcaremanagement.Entity.*;
import com.example.petcaremanagement.Repository.*;
import com.example.petcaremanagement.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow();
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING"); // Set trạng thái ban đầu
        order.setPaymentMethod("VNPAY"); // Mặc định là VNPay

        // Tính tổng trước
        double totalPrice = 0;
        int totalQuantity = 0;
        List<OrderItem> orderItemList = new ArrayList<>();
        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow();
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(product.getPrice());
            // Chưa set order ở đây
            orderItemList.add(orderItem);
            totalQuantity += itemReq.getQuantity();
            totalPrice += itemReq.getQuantity() * product.getPrice();
        }
        order.setTotalQuantity(totalQuantity);
        order.setTotalPrice(totalPrice);
        // Lưu order trước để có orderId
        orderRepository.save(order);
        // Sau khi order đã có ID, set order cho từng orderItem
        for (OrderItem orderItem : orderItemList) {
            orderItem.setOrder(order);
        }
        order.setOrderItems(orderItemList);
        // Lưu lại order để cascade lưu orderItem
        orderRepository.save(order);
        // Xử lý giỏ hàng sau khi order đã lưu thành công
        ShoppingCart shoppingCart = user.getShoppingCart();
        if (shoppingCart != null) {
            List<CartItem> items = shoppingCart.getCartItem();
            if (items != null) {
                items.clear();
            }
            shoppingCart.setTotalPrices(0);
            shoppingCart.setTotalItems(0);
            shoppingCartRepository.save(shoppingCart);
        }
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setUserId(user.getId());
        response.setOrderDate(order.getOrderDate());
        response.setTotalQuantity(totalQuantity);
        response.setTotalPrice(totalPrice);
        response.setStatus(order.getStatus());
        response.setPaymentMethod(order.getPaymentMethod());
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for (OrderItem item : order.getOrderItems()) {
            OrderItemResponse itemResponse = new OrderItemResponse();
            itemResponse.setProductId(item.getProduct().getId());
            itemResponse.setProductName(item.getProduct().getName());
            itemResponse.setQuantity(item.getQuantity());
            itemResponse.setPrice(item.getPrice());
            itemResponses.add(itemResponse);
        }
        response.setItems(itemResponses);
        return response;
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderResponse> result = new ArrayList<>();
        for (Order order : orders) {
            OrderResponse orderResponse = new OrderResponse();
            orderResponse.setOrderId(order.getOrderId());
            orderResponse.setUserId(order.getUser().getId());
            orderResponse.setOrderDate(order.getOrderDate());
            orderResponse.setTotalQuantity(order.getTotalQuantity());
            orderResponse.setTotalPrice(order.getTotalPrice());
            List<OrderItemResponse> itemResponses = new ArrayList<>();
            for (OrderItem item : order.getOrderItems()) {
                OrderItemResponse itemResponse = new OrderItemResponse();
                itemResponse.setProductId(item.getProduct().getId());
                itemResponse.setProductName(item.getProduct().getName());
                itemResponse.setQuantity(item.getQuantity());
                itemResponse.setPrice(item.getPrice());
                itemResponses.add(itemResponse);
            }
            orderResponse.setItems(itemResponses);
            result.add(orderResponse);
        }
        return result;
    }

    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    public Page<OrderResponse> pagination(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        Page<Order> page = orderRepository.findAll(pageable);
        List<OrderResponse> content = new ArrayList<>();
        for (Order order : page.getContent()) {
            OrderResponse orderResponse = new OrderResponse();
            orderResponse.setOrderId(order.getOrderId());
            orderResponse.setUserId(order.getUser().getId());
            orderResponse.setOrderDate(order.getOrderDate());
            orderResponse.setTotalQuantity(order.getTotalQuantity());
            orderResponse.setTotalPrice(order.getTotalPrice());
            List<OrderItemResponse> itemResponses = new ArrayList<>();
            for (OrderItem item : order.getOrderItems()) {
                OrderItemResponse itemResponse = new OrderItemResponse();
                itemResponse.setProductId(item.getProduct().getId());
                itemResponse.setProductName(item.getProduct().getName());
                itemResponse.setQuantity(item.getQuantity());
                itemResponse.setPrice(item.getPrice());
                itemResponses.add(itemResponse);
            }
            orderResponse.setItems(itemResponses);
            content.add(orderResponse);
        }
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    public OrderResponse searchOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setOrderId(order.getOrderId());
        orderResponse.setUserId(order.getUser().getId());
        orderResponse.setOrderDate(order.getOrderDate());
        orderResponse.setTotalQuantity(order.getTotalQuantity());
        orderResponse.setTotalPrice(order.getTotalPrice());
        orderResponse.setStatus(order.getStatus());
        orderResponse.setPaymentMethod(order.getPaymentMethod());
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for (OrderItem item : order.getOrderItems()) {
            OrderItemResponse itemResponse = new OrderItemResponse();
            itemResponse.setProductId(item.getProduct().getId());
            itemResponse.setProductName(item.getProduct().getName());
            itemResponse.setQuantity(item.getQuantity());
            itemResponse.setPrice(item.getPrice());
            itemResponses.add(itemResponse);
        }
        orderResponse.setItems(itemResponses);
        return orderResponse;
    }

    @Override
    public List<OrderResponse> findOrderByUser(long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found !"));
        var listOrders = orderRepository.findByUser(user);
        var response = listOrders.stream().map(
                order -> {
                    OrderResponse orderResponse = new OrderResponse();
                    orderResponse.setOrderId(order.getOrderId());
                    orderResponse.setUserId(order.getUser().getId());
                    orderResponse.setOrderDate(order.getOrderDate());
                    orderResponse.setTotalQuantity(order.getTotalQuantity());
                    orderResponse.setTotalPrice(order.getTotalPrice());
                    List<OrderItemResponse> itemResponses = new ArrayList<>();
                    for (OrderItem item : order.getOrderItems()) {
                        OrderItemResponse itemResponse = new OrderItemResponse();
                        itemResponse.setProductId(item.getProduct().getId());
                        itemResponse.setProductName(item.getProduct().getName());
                        itemResponse.setQuantity(item.getQuantity());
                        itemResponse.setPrice(item.getPrice());
                        itemResponses.add(itemResponse);
                    }
                    orderResponse.setItems(itemResponses);
                    return orderResponse;
                }).toList();
        return response;
    }

    @Override
    @Transactional
    public void updateOrderPaymentStatus(Long orderId, String status, String vnpayTxnRef) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        if (vnpayTxnRef != null) {
            order.setVnpayTxnRef(vnpayTxnRef);
        }
        orderRepository.save(order);
    }
}
