package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.VetDTO.VetResponse;
import com.example.petcaremanagement.Service.VetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vet")
public class VetController {
    @Autowired
    private VetService vetService;

    @GetMapping("/getAllVet")
    public ResponseEntity<List<VetResponse>> GetAllVet(){
        var result = vetService.GetAllVet();
        return ResponseEntity.ok().body(result);
    }
}
