package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.Request.MedicalRecordRequest;
import com.example.petcaremanagement.Dto.Response.MedicalRecordResponse;
import com.example.petcaremanagement.Entity.MedicalRecord;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Repository.MedicalRecordRepository;
import com.example.petcaremanagement.Repository.PetRepository;
import com.example.petcaremanagement.Service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PetRepository petRepository;

    @Override
    public MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request) {
        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        MedicalRecord medicalRecord = MedicalRecord.builder()
                .pet(pet)
                .visitDate(request.getRecordDate())
                .diagnosis(request.getDiagnosis())
                .treatment(request.getTreatment())
                .veterinarian(request.getVeterinarian())
                .clinic(request.getClinic())
                .symptoms(request.getSymptoms())
                .notes(request.getNotes())
                .createdAt(new Date())
                .build();

        MedicalRecord saved = medicalRecordRepository.save(medicalRecord);
        return convertToResponse(saved);
    }

    @Override
    public MedicalRecordResponse updateMedicalRecord(Long id, MedicalRecordRequest request) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        medicalRecord.setVisitDate(request.getRecordDate());
        medicalRecord.setDiagnosis(request.getDiagnosis());
        medicalRecord.setTreatment(request.getTreatment());
        medicalRecord.setVeterinarian(request.getVeterinarian());
        medicalRecord.setClinic(request.getClinic());
        medicalRecord.setSymptoms(request.getSymptoms());
        medicalRecord.setNotes(request.getNotes());

        MedicalRecord updated = medicalRecordRepository.save(medicalRecord);
        return convertToResponse(updated);
    }

    @Override
    public MedicalRecordResponse getMedicalRecordById(Long id) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
        return convertToResponse(medicalRecord);
    }

    @Override
    public List<MedicalRecordResponse> getMedicalRecordsByPetId(Long petId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPetIdOrderByVisitDateDesc(petId);
        return records.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicalRecordResponse> getMedicalRecordsByUserId(Long userId) {
        List<MedicalRecord> records = medicalRecordRepository.findByUserIdOrderByVisitDateDesc(userId);
        return records.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteMedicalRecord(Long id) {
        if (!medicalRecordRepository.existsById(id)) {
            throw new RuntimeException("Medical record not found");
        }
        medicalRecordRepository.deleteById(id);
    }

    @Override
    public Long countMedicalRecordsByPetId(Long petId) {
        return medicalRecordRepository.countByPetId(petId);
    }

    private MedicalRecordResponse convertToResponse(MedicalRecord medicalRecord) {
        return MedicalRecordResponse.builder()
                .id(medicalRecord.getId())
                .petId(medicalRecord.getPet().getId())
                .petName(medicalRecord.getPet().getName())
                .recordDate(medicalRecord.getVisitDate())
                .diagnosis(medicalRecord.getDiagnosis())
                .treatment(medicalRecord.getTreatment())
                .veterinarian(medicalRecord.getVeterinarian())
                .clinic(medicalRecord.getClinic())
                .symptoms(medicalRecord.getSymptoms())
                .notes(medicalRecord.getNotes())
                .createdAt(medicalRecord.getCreatedAt())
                .build();
    }
}
