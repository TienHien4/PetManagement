package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.Request.VaccinationRequest;
import com.example.petcaremanagement.Dto.Response.VaccinationResponse;
import com.example.petcaremanagement.Service.VaccinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/vaccinations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class VaccinationController {

    private final VaccinationService vaccinationService;

    // Only VET can create vaccination records
    @PreAuthorize("hasRole('VET')")
    @PostMapping
    public ResponseEntity<VaccinationResponse> createVaccination(@RequestBody VaccinationRequest request) {
        try {
            VaccinationResponse response = vaccinationService.createVaccination(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Only VET can update vaccination records
    @PreAuthorize("hasRole('VET')")
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

    // VET and USER can view vaccination records
    @PreAuthorize("hasAnyRole('VET', 'USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<VaccinationResponse> getVaccinationById(@PathVariable Long id) {
        try {
            VaccinationResponse response = vaccinationService.getVaccinationById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // VET and USER can view vaccination records by pet
    @PreAuthorize("hasAnyRole('VET', 'USER', 'ADMIN')")
    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<VaccinationResponse>> getVaccinationsByPetId(@PathVariable Long petId) {
        try {
            List<VaccinationResponse> vaccinations = vaccinationService.getVaccinationsByPetId(petId);
            return ResponseEntity.ok(vaccinations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // VET and USER can view vaccination records by user
    @PreAuthorize("hasAnyRole('VET', 'USER', 'ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VaccinationResponse>> getVaccinationsByUserId(@PathVariable Long userId) {
        try {
            List<VaccinationResponse> vaccinations = vaccinationService.getVaccinationsByUserId(userId);
            return ResponseEntity.ok(vaccinations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // VET can view upcoming vaccinations
    @PreAuthorize("hasAnyRole('VET', 'ADMIN')")
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

    // Only VET can delete vaccination records
    @PreAuthorize("hasRole('VET')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVaccination(@PathVariable Long id) {
        try {
            vaccinationService.deleteVaccination(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // VET and USER can view count
    @PreAuthorize("hasAnyRole('VET', 'USER', 'ADMIN')")
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
