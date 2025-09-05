package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.Request.MedicalRecordRequest;
import com.example.petcaremanagement.Dto.Response.MedicalRecordResponse;
import com.example.petcaremanagement.Service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<MedicalRecordResponse> createMedicalRecord(@RequestBody MedicalRecordRequest request) {
        try {
            MedicalRecordResponse response = medicalRecordService.createMedicalRecord(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecordResponse> updateMedicalRecord(
            @PathVariable Long id,
            @RequestBody MedicalRecordRequest request) {
        try {
            MedicalRecordResponse response = medicalRecordService.updateMedicalRecord(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordResponse> getMedicalRecordById(@PathVariable Long id) {
        try {
            MedicalRecordResponse response = medicalRecordService.getMedicalRecordById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPetId(@PathVariable Long petId) {
        try {
            List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByPetId(petId);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByUserId(@PathVariable Long userId) {
        try {
            List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByUserId(userId);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        try {
            medicalRecordService.deleteMedicalRecord(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
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
