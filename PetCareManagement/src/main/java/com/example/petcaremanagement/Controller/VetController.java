package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.VetDTO.VetResponse;
import com.example.petcaremanagement.Service.VetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vet")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class VetController {
    @Autowired
    private VetService vetService;

    @GetMapping("/getAllVet")
    public ResponseEntity<List<VetResponse>> GetAllVet(){
        var result = vetService.GetAllVet();
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/getByUserId/{userId}")
    public org.springframework.http.ResponseEntity<VetResponse> GetVetByUserId(@PathVariable long userId){
        var result = vetService.getVetByUserId(userId);
        return org.springframework.http.ResponseEntity.ok().body(result);
    }
}
