package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.PetDTO.PetRequest;
import com.example.petcaremanagement.Dto.PetDTO.PetResponse;
import com.example.petcaremanagement.Service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pet")
public class PetController {
    @Autowired
    private PetService petService;


    @GetMapping("/getPet/{id}")
    public ResponseEntity<PetResponse> GetPets(@PathVariable long id){
        return ResponseEntity.ok().body(petService.GetPetById(id));
    }
    @GetMapping("/getPets")
    public ResponseEntity<Page<PetResponse>> GetAllPets(@RequestParam int pageNo,
             @RequestParam(defaultValue = "2") int pageSize){
        return ResponseEntity.ok().body(petService.Pagination(pageNo, pageSize));
    }


    @PostMapping("/create")
    public ResponseEntity<PetResponse> CreatePet(@RequestBody PetRequest request){
        System.out.println("IN");
        return ResponseEntity.ok().body(petService.CreatePet(request));
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<PetResponse> UpdatePet(@PathVariable long id,
               @RequestBody PetRequest request){
        return ResponseEntity.ok().body(petService.UpdatePet(id, request));
    }
    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> DeletePet(@PathVariable long id){
        petService.DeletePet(id);
        return ResponseEntity.ok().build();
    }







}
