package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.ProductDTO.ProductRequest;
import com.example.petcaremanagement.Dto.ProductDTO.ProductResponse;
import com.example.petcaremanagement.Entity.Product;
import com.example.petcaremanagement.Mapper.ProductMapper;
import com.example.petcaremanagement.Repository.ProductRepository;
import com.example.petcaremanagement.Service.CloudinaryService;
import com.example.petcaremanagement.Service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j  // Thêm annotation này
public class ProductServiceIplm implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Cacheable(value = "products", key = "'all'")
    @Override
    public List<ProductResponse> GetAllProduct() {
        log.info("========== FETCHING FROM DATABASE: GetAllProduct ==========");
        var listProducts = productRepository.findAll();
        return listProducts.stream().map(s -> productMapper.toProductResponse(s)).toList();
    }

    @Cacheable(value = "products", key = "'page-' + #pageNo + '-' + #pageSize")
    @Override
    public Page<ProductResponse> GetAllProductPagination(int pageNo, int pageSize) {
        log.info("========== FETCHING FROM DATABASE: Pagination page={}, size={} ==========", pageNo, pageSize);
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        return productRepository.findAll(pageable).map(s -> productMapper.toProductResponse(s));
    }

    @Cacheable(value = "products", key = "#id")
    @Override
    public ProductResponse FindSpById(long id) {
        log.info("========== FETCHING FROM DATABASE: FindById id={} ==========", id);
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return productMapper.toProductResponse(product);
    }

    @Cacheable(value = "products", key = "'search-' + #keyword")
    @Override
    public List<ProductResponse> FindSpByKeyword(String keyword) {
        log.info("========== FETCHING FROM DATABASE: Search keyword={} ==========", keyword);
        List<Product> products = productRepository.searchSP(keyword);
        return products.stream().map(s -> productMapper.toProductResponse(s)).toList();
    }

    @CacheEvict(value = "products", allEntries = true)
    @Override
    public ProductResponse CreateProduct(ProductRequest request, MultipartFile multipartFile) {
        log.info("========== CACHE EVICTED: CreateProduct ==========");
        try {
            String imageUrl = handleImageUpload(multipartFile);
            Product product = productMapper.toProduct(request);
            product.setImage(imageUrl);
            Product savedProduct = productRepository.save(product);
            return productMapper.toProductResponse(savedProduct);
        } catch (Exception e) {
            throw new RuntimeException("Error creating product: " + e.getMessage());
        }
    }

    @CacheEvict(value = "products", allEntries = true)
    @Override
    public ProductResponse UpdateProduct(long id, ProductRequest request, MultipartFile multipartFile) {
        log.info("========== CACHE EVICTED: UpdateProduct id={} ==========", id);
        try {
            Product existingProduct = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

            String imageUrl = handleImageUpload(multipartFile);
            if (imageUrl != null) {
                existingProduct.setImage(imageUrl);
            }

            existingProduct.setName(request.getName());
            existingProduct.setDescription(request.getDescription());
            existingProduct.setType(request.getType());
            existingProduct.setQuantity(request.getQuantity());
            existingProduct.setPrice(request.getPrice());
            existingProduct.setSalePercent(request.getSalePercent());

            Product updatedProduct = productRepository.save(existingProduct);
            return productMapper.toProductResponse(updatedProduct);
        } catch (Exception e) {
            throw new RuntimeException("Error updating product: " + e.getMessage());
        }
    }

    @CacheEvict(value = "products", allEntries = true)
    @Override
    public void DeleteProduct(long id) {
        log.info("========== CACHE EVICTED: DeleteProduct id={} ==========", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.delete(product);
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
