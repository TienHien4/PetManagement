package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.ProductDTO.ProductRequest;
import com.example.petcaremanagement.Dto.ProductDTO.ProductResponse;
import com.example.petcaremanagement.Entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ProductResponse CreateProduct(ProductRequest request, MultipartFile multipartFile);
    ProductResponse UpdateProduct(long id, ProductRequest request, MultipartFile multipartFile);
    void DeleteProduct(long id);
    List<ProductResponse> GetAllProduct();
    Page<ProductResponse> GetAllProductPagination(int pageNo, int pageSize);
    ProductResponse FindSpById(long id);
    List<ProductResponse> FindSpByKeyword(String keyword);
}
