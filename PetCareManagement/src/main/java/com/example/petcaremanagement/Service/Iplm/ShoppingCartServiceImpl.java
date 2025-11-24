package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.ShoppingCartDTO.ShoppingCartRequest;
import com.example.petcaremanagement.Dto.CartItemDTO.CartItemResponse;
import com.example.petcaremanagement.Repository.ProductRepository;
import com.example.petcaremanagement.Repository.UserRepository;
import com.example.petcaremanagement.Service.ShoppingCartService;
import com.example.petcaremanagement.Entity.CartItem;
import com.example.petcaremanagement.Entity.Product;
import com.example.petcaremanagement.Entity.ShoppingCart;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Repository.CartItemRepository;
import com.example.petcaremanagement.Repository.ShoppingCartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {
    @Autowired
    private ShoppingCartRepository shoppingCartRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public CartItemResponse addItem(ShoppingCartRequest request, long userId, long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        ShoppingCart shoppingCart = user.getShoppingCart();
        if (shoppingCart == null) {
            shoppingCart = new ShoppingCart();
            shoppingCart.setUser(user);
            shoppingCart.setCartItem(new ArrayList<>());
            shoppingCartRepository.save(shoppingCart);
        }

        List<CartItem> items = shoppingCart.getCartItem();
        CartItem existing = items.stream()
                .filter(i -> i.getProduct().getId() == productId)
                .findFirst().orElse(null);

        CartItem itemToReturn;
        if (existing == null) {
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setCart(shoppingCart);
            newItem.setQuantity(request.getQuantity());
            newItem.setTotalPrice(product.getPrice() * request.getQuantity());
            cartItemRepository.save(newItem);
            items.add(newItem);
            itemToReturn = newItem;
        } else {
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
            existing.setTotalPrice(existing.getProduct().getPrice() * existing.getQuantity());
            cartItemRepository.save(existing);
            itemToReturn = existing;
        }

        shoppingCart.setTotalItems(items.stream().mapToInt(CartItem::getQuantity).sum());
        shoppingCart.setTotalPrices(items.stream().mapToDouble(CartItem::getTotalPrice).sum());
        shoppingCartRepository.save(shoppingCart);
        // Xóa cache nếu có

        CartItemResponse res = new CartItemResponse();
        res.setProductId(itemToReturn.getProduct().getId());
        res.setProductName(itemToReturn.getProduct().getName());
        res.setProductImage(itemToReturn.getProduct().getImage());
        res.setQuantity(itemToReturn.getQuantity());
        res.setTotalPrice(itemToReturn.getTotalPrice());
        
        System.out.println("=== ADD ITEM RESPONSE ===");
        System.out.println("Product ID: " + res.getProductId());
        System.out.println("Product Name: " + res.getProductName());
        System.out.println("Product Image: " + res.getProductImage());
        System.out.println("Quantity: " + res.getQuantity());
        System.out.println("Total Price: " + res.getTotalPrice());
        
        return res;
    }

    @Override
    public void deleteItem(long userId, long productId) {
        User user = userRepository.findById(userId).orElseThrow();
        ShoppingCart shoppingCart = user.getShoppingCart();
        List<CartItem> items = shoppingCart.getCartItem();
        CartItem item = items.stream().filter(i -> i.getProduct().getId() == productId).findFirst().orElse(null);
        if (item != null) {
            items.remove(item);
            cartItemRepository.delete(item);
        }
        shoppingCart.setTotalItems(items.stream().mapToInt(CartItem::getQuantity).sum());
        shoppingCart.setTotalPrices(items.stream().mapToDouble(CartItem::getTotalPrice).sum());
        shoppingCartRepository.save(shoppingCart);
        // Xóa cache nếu có
    }

    @Override
    public List<CartItemResponse> getAllItem(long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        ShoppingCart shoppingCart = user.getShoppingCart();
        List<CartItem> items = shoppingCart.getCartItem();
        List<CartItemResponse> response = new ArrayList<>();
        for (CartItem item : items) {
            CartItemResponse res = new CartItemResponse();
            res.setProductId(item.getProduct().getId());
            res.setProductName(item.getProduct().getName());
            res.setProductImage(item.getProduct().getImage());
            res.setQuantity(item.getQuantity());
            res.setTotalPrice(item.getTotalPrice());
            response.add(res);
        }
        return response;
    }

    @Override
    public CartItemResponse reduceItem(long userId, long productId) {
        User user = userRepository.findById(userId).orElseThrow();
        ShoppingCart shoppingCart = user.getShoppingCart();
        List<CartItem> items = shoppingCart.getCartItem();
        CartItem item = items.stream().filter(i -> i.getProduct().getId() == productId).findFirst().orElse(null);
        if (item != null && item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
            item.setTotalPrice(item.getProduct().getPrice() * item.getQuantity());
            cartItemRepository.save(item);
        }
        shoppingCart.setTotalItems(items.stream().mapToInt(CartItem::getQuantity).sum());
        shoppingCart.setTotalPrices(items.stream().mapToDouble(CartItem::getTotalPrice).sum());
        shoppingCartRepository.save(shoppingCart);
        // Xóa cache nếu có
        if (item == null)
            return null;
        CartItemResponse res = new CartItemResponse();
        res.setProductId(item.getProduct().getId());
        res.setProductName(item.getProduct().getName());
        res.setProductImage(item.getProduct().getImage());
        res.setQuantity(item.getQuantity());
        res.setTotalPrice(item.getTotalPrice());
        return res;
    }
}