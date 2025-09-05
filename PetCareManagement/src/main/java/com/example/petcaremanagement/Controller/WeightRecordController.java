package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.Request.WeightRecordRequest;
import com.example.petcaremanagement.Dto.Response.WeightRecordResponse;
import com.example.petcaremanagement.Service.WeightRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weight-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class WeightRecordController {

    private final WeightRecordService weightRecordService;

    @PostMapping
    public ResponseEntity<WeightRecordResponse> createWeightRecord(@RequestBody WeightRecordRequest request) {
        try {
            WeightRecordResponse response = weightRecordService.createWeightRecord(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeightRecordResponse> updateWeightRecord(
            @PathVariable Long id,
            @RequestBody WeightRecordRequest request) {
        try {
            WeightRecordResponse response = weightRecordService.updateWeightRecord(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeightRecordResponse> getWeightRecordById(@PathVariable Long id) {
        try {
            WeightRecordResponse response = weightRecordService.getWeightRecordById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<WeightRecordResponse>> getWeightRecordsByPetId(@PathVariable Long petId) {
        try {
            List<WeightRecordResponse> records = weightRecordService.getWeightRecordsByPetId(petId);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WeightRecordResponse>> getWeightRecordsByUserId(@PathVariable Long userId) {
        try {
            List<WeightRecordResponse> records = weightRecordService.getWeightRecordsByUserId(userId);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/pet/{petId}/latest")
    public ResponseEntity<WeightRecordResponse> getLatestWeightByPetId(@PathVariable Long petId) {
        try {
            WeightRecordResponse response = weightRecordService.getLatestWeightByPetId(petId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeightRecord(@PathVariable Long id) {
        try {
            weightRecordService.deleteWeightRecord(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pet/{petId}/count")
    public ResponseEntity<Long> countWeightRecordsByPetId(@PathVariable Long petId) {
        try {
            Long count = weightRecordService.countWeightRecordsByPetId(petId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
