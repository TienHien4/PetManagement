package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.Request.WeightRecordRequest;
import com.example.petcaremanagement.Dto.Response.WeightRecordResponse;

import java.util.List;

public interface WeightRecordService {
    WeightRecordResponse createWeightRecord(WeightRecordRequest request);

    WeightRecordResponse updateWeightRecord(Long id, WeightRecordRequest request);

    WeightRecordResponse getWeightRecordById(Long id);

    List<WeightRecordResponse> getWeightRecordsByPetId(Long petId);

    List<WeightRecordResponse> getWeightRecordsByUserId(Long userId);

    WeightRecordResponse getLatestWeightByPetId(Long petId);

    void deleteWeightRecord(Long id);

    Long countWeightRecordsByPetId(Long petId);
}
