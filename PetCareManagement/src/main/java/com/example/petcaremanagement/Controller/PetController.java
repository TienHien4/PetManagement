package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.PetDTO.PetRequest;
import com.example.petcaremanagement.Dto.PetDTO.PetResponse;
import com.example.petcaremanagement.Service.PetService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pet")
public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping("/getPet/{id}")
    public ResponseEntity<PetResponse> GetPet(@PathVariable long id) {
        return ResponseEntity.ok().body(petService.GetPetById(id));
    }

    @GetMapping("/getAllPet")
    public ResponseEntity<List<PetResponse>> GetAllPet() {
        return ResponseEntity.ok().body(petService.GetAllPet());
    }
    @GetMapping("/getPets/{keyword}")
    public ResponseEntity<List<PetResponse>> GetPetsByKeyword(@PathVariable String keyword) {
        var result = petService.GetPetByKeyword(keyword);
        return ResponseEntity.ok().body(result);
    }
    @GetMapping("/getPets")
    public ResponseEntity<Page<PetResponse>> GetAllPets(@RequestParam int pageNo,
                                                        @RequestParam(defaultValue = "5") int pageSize) {
        return ResponseEntity.ok().body(petService.Pagination(pageNo, pageSize));
    }
    @GetMapping("/getPetsByUser/{userId}")
    public ResponseEntity<List<PetResponse>> GetPetsByUserId(@PathVariable long userId) {
        var result = petService.GetPetsByUser(userId);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/create")
    public ResponseEntity<PetResponse> CreatePet(@RequestParam("imageFile") MultipartFile imageFile,
                                                 @RequestParam("petRequest") String petRequestJson) {
        try {
            PetRequest petRequest = new ObjectMapper().readValue(petRequestJson, PetRequest.class);
            PetResponse petResponse = petService.CreatePet(petRequest, imageFile);

            return ResponseEntity.ok().body(petResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<PetResponse> UpdatePet(@PathVariable long id,
                                                 @RequestParam("imageFile") MultipartFile imageFile,
                                                 @RequestParam("petRequest") String petRequestJson) {
        try {
            // Convert JSON string to PetRequest object
            PetRequest petRequest = new ObjectMapper().readValue(petRequestJson, PetRequest.class);

            // Call service to handle updating of Pet and image
            PetResponse petResponse = petService.UpdatePet(id, petRequest, imageFile);

            return ResponseEntity.ok().body(petResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Delete Pet by ID
    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> DeletePet(@PathVariable long id) {
        petService.DeletePet(id);
        return ResponseEntity.ok().build();
    }
}
