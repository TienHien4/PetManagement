package com.example.petcaremanagement.Mapper;

import com.example.petcaremanagement.Dto.ProductDTO.ProductRequest;
import com.example.petcaremanagement.Dto.ProductDTO.ProductResponse;
import com.example.petcaremanagement.Entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "image", ignore = true)
    Product toProduct(ProductRequest request);

    ProductResponse toProductResponse(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "image", ignore = true)
    void updateProduct(@MappingTarget Product product, ProductRequest request);
}
