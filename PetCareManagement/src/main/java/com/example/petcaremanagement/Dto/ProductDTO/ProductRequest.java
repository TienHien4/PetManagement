package com.example.petcaremanagement.Dto.ProductDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequest {
    private long id;
    private String name;
    private String description;
    private String type;
    private int quantity;
    private float price;
    private float salePercent;
}
