package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.ProductDTO.ProductRequest;
import com.example.petcaremanagement.Dto.ProductDTO.ProductResponse;
import com.example.petcaremanagement.Entity.Product;
import com.example.petcaremanagement.Mapper.ProductMapper;
import com.example.petcaremanagement.Repository.ProductRepository;
import com.example.petcaremanagement.Service.CloudinaryService;
import com.example.petcaremanagement.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ProductServiceIplm implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public ProductResponse CreateProduct(ProductRequest request, MultipartFile multipartFile) {
        try {
            Product p = productMapper.toProduct(request);

            // Upload image to Cloudinary if provided
            if (multipartFile != null && !multipartFile.isEmpty()) {
                String imageUrl = handleImageUpload(multipartFile);
                p.setImage(imageUrl);
            }

            productRepository.save(p);
            return productMapper.toProductResponse(p);
        } catch (Exception e) {
            throw new RuntimeException("Error creating product: " + e.getMessage(), e);
        }
    }

    @Override
    public ProductResponse UpdateProduct(long id, ProductRequest request, MultipartFile multipartFile) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

            productMapper.updateProduct(product, request);

            // Upload new image to Cloudinary if provided
            if (multipartFile != null && !multipartFile.isEmpty()) {
                String imageUrl = handleImageUpload(multipartFile);
                product.setImage(imageUrl);
            }

            productRepository.save(product);
            return productMapper.toProductResponse(product);
        } catch (Exception e) {
            throw new RuntimeException("Error updating product: " + e.getMessage(), e);
        }
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

    /**
     * Private method to handle image upload with validation
     * 
     * @param imageFile The image file to upload
     * @return The URL of uploaded image or null if no file provided
     */
    private String handleImageUpload(MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            return null;
        }

        try {
            // Validate file size (max 5MB)
            long maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (imageFile.getSize() > maxSize) {
                throw new RuntimeException("Image size must be less than 5MB");
            }

            // Validate file type
            String contentType = imageFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("File must be an image (jpg, png, etc.)");
            }

            // Upload to Cloudinary in product_images folder
            return cloudinaryService.uploadImage(imageFile, "product_images");

        } catch (Exception e) {
            throw new RuntimeException("Error uploading image: " + e.getMessage(), e);
        }
    }
}
