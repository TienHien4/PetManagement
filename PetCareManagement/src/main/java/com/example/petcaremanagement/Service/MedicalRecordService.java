package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.Request.MedicalRecordRequest;
import com.example.petcaremanagement.Dto.Response.MedicalRecordResponse;

import java.util.List;

public interface MedicalRecordService {
    MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request);

    MedicalRecordResponse updateMedicalRecord(Long id, MedicalRecordRequest request);

    MedicalRecordResponse getMedicalRecordById(Long id);

    List<MedicalRecordResponse> getMedicalRecordsByPetId(Long petId);

    List<MedicalRecordResponse> getMedicalRecordsByUserId(Long userId);

    void deleteMedicalRecord(Long id);

    Long countMedicalRecordsByPetId(Long petId);
}
