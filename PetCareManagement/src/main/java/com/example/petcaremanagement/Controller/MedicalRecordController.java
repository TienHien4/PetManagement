package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.Request.MedicalRecordRequest;
import com.example.petcaremanagement.Dto.Response.MedicalRecordResponse;
import com.example.petcaremanagement.Service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    // Only VET can create medical records
    @PreAuthorize("hasRole('VET')")
    @PostMapping
    public ResponseEntity<?> createMedicalRecord(@RequestBody MedicalRecordRequest request) {
        try {
            MedicalRecordResponse response = medicalRecordService.createMedicalRecord(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    // Only VET can update medical records
    @PreAuthorize("hasRole('VET')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicalRecord(
            @PathVariable Long id,
            @RequestBody MedicalRecordRequest request) {
        try {
            MedicalRecordResponse response = medicalRecordService.updateMedicalRecord(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    // VET and USER can view medical records
    @PreAuthorize("hasAnyRole('VET', 'USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordResponse> getMedicalRecordById(@PathVariable Long id) {
        try {
            MedicalRecordResponse response = medicalRecordService.getMedicalRecordById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // VET and USER can view medical records by pet
    @PreAuthorize("hasAnyRole('VET', 'USER', 'ADMIN')")
    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPetId(@PathVariable Long petId) {
        try {
            List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByPetId(petId);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // VET and USER can view medical records by user
    @PreAuthorize("hasAnyRole('VET', 'USER', 'ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByUserId(@PathVariable Long userId) {
        try {
            List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByUserId(userId);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Only VET can delete medical records
    @PreAuthorize("hasRole('VET')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicalRecord(@PathVariable Long id) {
        try {
            medicalRecordService.deleteMedicalRecord(id);
            return ResponseEntity.ok().body("Medical record deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @GetMapping("/pet/{petId}/count")
    public ResponseEntity<Long> countMedicalRecordsByPetId(@PathVariable Long petId) {
        try {
            Long count = medicalRecordService.countMedicalRecordsByPetId(petId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
