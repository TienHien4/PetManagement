package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.Request.WeightRecordRequest;
import com.example.petcaremanagement.Dto.Response.WeightRecordResponse;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.WeightRecord;
import com.example.petcaremanagement.Repository.PetRepository;
import com.example.petcaremanagement.Repository.WeightRecordRepository;
import com.example.petcaremanagement.Service.WeightRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeightRecordServiceImpl implements WeightRecordService {

    private final WeightRecordRepository weightRecordRepository;
    private final PetRepository petRepository;

    @Override
    public WeightRecordResponse createWeightRecord(WeightRecordRequest request) {
        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        WeightRecord weightRecord = WeightRecord.builder()
                .pet(pet)
                .weight(request.getWeight())
                .recordDate(request.getRecordDate())
                .notes(request.getNotes())
                .createdAt(new Date())
                .build();

        WeightRecord saved = weightRecordRepository.save(weightRecord);
        return convertToResponse(saved);
    }

    @Override
    public WeightRecordResponse updateWeightRecord(Long id, WeightRecordRequest request) {
        WeightRecord weightRecord = weightRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Weight record not found"));

        weightRecord.setWeight(request.getWeight());
        weightRecord.setRecordDate(request.getRecordDate());
        weightRecord.setNotes(request.getNotes());

        WeightRecord updated = weightRecordRepository.save(weightRecord);
        return convertToResponse(updated);
    }

    @Override
    public WeightRecordResponse getWeightRecordById(Long id) {
        WeightRecord weightRecord = weightRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Weight record not found"));
        return convertToResponse(weightRecord);
    }

    @Override
    public List<WeightRecordResponse> getWeightRecordsByPetId(Long petId) {
        List<WeightRecord> records = weightRecordRepository.findByPetIdOrderByRecordDateDesc(petId);
        return records.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<WeightRecordResponse> getWeightRecordsByUserId(Long userId) {
        List<WeightRecord> records = weightRecordRepository.findByUserIdOrderByRecordDateDesc(userId);
        return records.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WeightRecordResponse getLatestWeightByPetId(Long petId) {
        WeightRecord weightRecord = weightRecordRepository.findLatestByPetId(petId)
                .orElseThrow(() -> new RuntimeException("No weight record found for this pet"));
        return convertToResponse(weightRecord);
    }

    @Override
    public void deleteWeightRecord(Long id) {
        if (!weightRecordRepository.existsById(id)) {
            throw new RuntimeException("Weight record not found");
        }
        weightRecordRepository.deleteById(id);
    }

    @Override
    public Long countWeightRecordsByPetId(Long petId) {
        return weightRecordRepository.countByPetId(petId);
    }

    private WeightRecordResponse convertToResponse(WeightRecord weightRecord) {
        return WeightRecordResponse.builder()
                .id(weightRecord.getId())
                .petId(weightRecord.getPet().getId())
                .petName(weightRecord.getPet().getName())
                .weight(weightRecord.getWeight())
                .recordDate(weightRecord.getRecordDate())
                .notes(weightRecord.getNotes())
                .createdAt(weightRecord.getCreatedAt())
                .build();
    }
}
