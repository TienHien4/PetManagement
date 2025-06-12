package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.ProductDTO.ProductRequest;
import com.example.petcaremanagement.Dto.ProductDTO.ProductResponse;
import com.example.petcaremanagement.Service.ProductService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/product")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping("/getAllProduct")
    public ResponseEntity<List<ProductResponse>> GetAllProduct(){
        var result = productService.GetAllProduct();
        return ResponseEntity.ok().body(result);
    }
    @GetMapping("/getProducts")
    public ResponseEntity<Page<ProductResponse>> GetProductPagination(@RequestParam int pageNo,
                                                                      @RequestParam(defaultValue = "5") int pageSize){
        var result = productService.GetAllProductPagination(pageNo, pageSize);
        return ResponseEntity.ok().body(result);
    }
    @PostMapping("/createProduct")
    public ResponseEntity<ProductResponse> CreateProduct(@RequestParam("imageFile") MultipartFile imageFile,
                                                         @RequestParam("productRequest") String productRequestJson) throws JsonProcessingException {
        ProductRequest productRequest = new ObjectMapper().readValue(productRequestJson, ProductRequest.class);
        ProductResponse productResponse = productService.CreateProduct(productRequest, imageFile);
        return ResponseEntity.ok().body(productResponse);
    }
    @PostMapping("/update/{id}")
    public ResponseEntity<ProductResponse> UpdateProduct(@PathVariable  long id,
                                                         @RequestParam("imageFile") MultipartFile imageFile,
                                                         @RequestParam("productRequest") String productRequestJson) throws JsonProcessingException{
        ProductRequest productRequest = new ObjectMapper().readValue(productRequestJson, ProductRequest.class);
        ProductResponse productResponse = productService.UpdateProduct(id, productRequest, imageFile);
        return ResponseEntity.ok().body(productResponse);
    }
    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> DeleteProduct(@PathVariable  long id){
        productService.DeleteProduct(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/getProductById/{id}")
    public ResponseEntity<ProductResponse> GetProductById(@PathVariable long id){
        var result = productService.FindSpById(id);
        return ResponseEntity.ok().body(result);
    }
    @GetMapping("/getProductByKeyword/{keyword}")
    public ResponseEntity<List<ProductResponse>> GetProductByKeyword(@PathVariable String keyword){
        var result = productService.FindSpByKeyword(keyword);
        return  ResponseEntity.ok().body(result);
    }

}
