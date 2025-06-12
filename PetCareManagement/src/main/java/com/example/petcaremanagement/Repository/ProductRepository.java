package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE p.name LIKE CONCAT('%', ?1, '%')" +
            " OR p.description LIKE CONCAT('%', ?1, '%')" +
            " OR p.type LIKE CONCAT('%', ?1, '%')")
    List<Product> searchSP(String keyword);
}
