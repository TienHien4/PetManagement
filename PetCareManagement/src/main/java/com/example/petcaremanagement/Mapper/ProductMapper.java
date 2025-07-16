package com.example.petcaremanagement.Mapper;

import com.example.petcaremanagement.Dto.ProductDTO.ProductRequest;
import com.example.petcaremanagement.Dto.ProductDTO.ProductResponse;
import com.example.petcaremanagement.Entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductRequest request);

    @Mapping(target = "imageUrl", expression = "java(buildImageUrl(product.getImage()))")
    ProductResponse toProductResponse(Product product);

    @Mapping(target = "image", ignore = true)
    void updateProduct(@MappingTarget Product product, ProductRequest request);


    @Named("buildImageUrl")
    default String buildImageUrl(String imageName) {
        if (imageName == null || imageName.isEmpty()) {
            return null;
        }
        String baseUrl = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .build()
                .toUriString();
        return baseUrl + "/uploads/products/" + imageName;
    }
}
