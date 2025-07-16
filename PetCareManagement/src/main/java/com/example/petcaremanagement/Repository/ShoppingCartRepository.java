package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Integer> {
}
