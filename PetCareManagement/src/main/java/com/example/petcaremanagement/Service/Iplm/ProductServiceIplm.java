package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.ProductDTO.ProductRequest;
import com.example.petcaremanagement.Dto.ProductDTO.ProductResponse;
import com.example.petcaremanagement.Entity.Product;
import com.example.petcaremanagement.Mapper.ProductMapper;
import com.example.petcaremanagement.Repository.ProductRepository;
import com.example.petcaremanagement.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceIplm implements ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductMapper productMapper;
    @Override
    public ProductResponse CreateProduct(ProductRequest request, MultipartFile multipartFile) {
        Product p = productMapper.toProduct(request);
        if(multipartFile != null && !multipartFile.isEmpty()){
            String imagePath = saveImage(multipartFile);
            p.setImage(imagePath);
        }
        productRepository.save(p);
        var response = productMapper.toProductResponse(p);
        return response;
    }

    @Override
    public ProductResponse UpdateProduct(long id, ProductRequest request, MultipartFile multipartFile) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        productMapper.updateProduct(product, request);
        if(multipartFile != null && !multipartFile.isEmpty()){
            String imagePath = saveImage(multipartFile);
            product.setImage(imagePath);
        }
        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    @Override
    public void DeleteProduct(long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    @Override
    public List<ProductResponse> GetAllProduct() {
        var listProducts = productRepository.findAll();
        return listProducts.stream().map(s -> productMapper.toProductResponse(s)).toList();
    }

    @Override
    public Page<ProductResponse> GetAllProductPagination(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        return productRepository.findAll(pageable).map(s -> productMapper.toProductResponse(s));
    }

    @Override
    public ProductResponse FindSpById(long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return productMapper.toProductResponse(product);
    }

    @Override
    public List<ProductResponse> FindSpByKeyword(String keyword) {
        List<Product> products = productRepository.searchSP(keyword);
        return products.stream().map(s -> productMapper.toProductResponse(s)).toList();
    }

    private String saveImage(MultipartFile imageFile) {
        try {
            String originalFilename = imageFile.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String imageName = UUID.randomUUID().toString() + extension;
            Path imagePath = Paths.get("uploads/products", imageName);
            Files.createDirectories(imagePath.getParent());
            Files.write(imagePath, imageFile.getBytes());
            return imageName;
        } catch (IOException e) {
            throw new RuntimeException("Could not save image file: " + e.getMessage());
        }
    }
}
