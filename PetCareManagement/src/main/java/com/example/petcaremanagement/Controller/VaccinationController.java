package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.Request.VaccinationRequest;
import com.example.petcaremanagement.Dto.Response.VaccinationResponse;
import com.example.petcaremanagement.Service.VaccinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/vaccinations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class VaccinationController {

    private final VaccinationService vaccinationService;

    @PostMapping
    public ResponseEntity<VaccinationResponse> createVaccination(@RequestBody VaccinationRequest request) {
        try {
            VaccinationResponse response = vaccinationService.createVaccination(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<VaccinationResponse> updateVaccination(
            @PathVariable Long id,
            @RequestBody VaccinationRequest request) {
        try {
            VaccinationResponse response = vaccinationService.updateVaccination(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<VaccinationResponse> getVaccinationById(@PathVariable Long id) {
        try {
            VaccinationResponse response = vaccinationService.getVaccinationById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<VaccinationResponse>> getVaccinationsByPetId(@PathVariable Long petId) {
        try {
            List<VaccinationResponse> vaccinations = vaccinationService.getVaccinationsByPetId(petId);
            return ResponseEntity.ok(vaccinations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VaccinationResponse>> getVaccinationsByUserId(@PathVariable Long userId) {
        try {
            List<VaccinationResponse> vaccinations = vaccinationService.getVaccinationsByUserId(userId);
            return ResponseEntity.ok(vaccinations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<VaccinationResponse>> getUpcomingVaccinations(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date beforeDate) {
        try {
            List<VaccinationResponse> vaccinations = vaccinationService.getUpcomingVaccinations(beforeDate);
            return ResponseEntity.ok(vaccinations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVaccination(@PathVariable Long id) {
        try {
            vaccinationService.deleteVaccination(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pet/{petId}/count")
    public ResponseEntity<Long> countVaccinationsByPetId(@PathVariable Long petId) {
        try {
            Long count = vaccinationService.countVaccinationsByPetId(petId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
