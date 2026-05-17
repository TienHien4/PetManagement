package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.Request.VaccinationRequest;
import com.example.petcaremanagement.Dto.Response.VaccinationResponse;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Entity.Vaccination;
import com.example.petcaremanagement.Entity.Vet;
import com.example.petcaremanagement.Repository.PetRepository;
import com.example.petcaremanagement.Repository.UserRepository;
import com.example.petcaremanagement.Repository.VaccinationRepository;
import com.example.petcaremanagement.Service.VaccinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VaccinationServiceImpl implements VaccinationService {

    private final VaccinationRepository vaccinationRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    @Override
    public VaccinationResponse createVaccination(VaccinationRequest request) {
        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        String veterinarian = request.getVeterinarian();
        String clinic = request.getClinic();

        try {
            var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null) {
                String username = authentication.getName();
                User user = userRepository.findUserByUserName(username);
                if (user != null && user.getVet() != null) {
                    Vet vet = user.getVet();
                    if (veterinarian == null || veterinarian.trim().isEmpty() || veterinarian.equals("Veterinary Clinic") || veterinarian.equalsIgnoreCase(user.getUserName())) {
                        veterinarian = vet.getName();
                    }
                    if (clinic == null || clinic.trim().isEmpty() || clinic.equals("Veterinary Clinic")) {
                        clinic = vet.getClinicAddress();
                    }
                }
            }
        } catch (Exception e) {
            // fallback
        }

        Vaccination vaccination = Vaccination.builder()
                .pet(pet)
                .vaccineName(request.getVaccineName())
                .vaccinationDate(request.getVaccinationDate())
                .nextDueDate(request.getNextDueDate())
                .veterinarian(veterinarian)
                .clinic(clinic)
                .batchNumber(request.getBatchNumber())
                .notes(request.getNotes())
                .createdAt(new Date())
                .build();

        Vaccination saved = vaccinationRepository.save(vaccination);
        return convertToResponse(saved);
    }

    @Override
    public VaccinationResponse updateVaccination(Long id, VaccinationRequest request) {
        Vaccination vaccination = vaccinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaccination not found"));

        String veterinarian = request.getVeterinarian();
        String clinic = request.getClinic();

        try {
            var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null) {
                String username = authentication.getName();
                User user = userRepository.findUserByUserName(username);
                if (user != null && user.getVet() != null) {
                    Vet vet = user.getVet();
                    if (veterinarian == null || veterinarian.trim().isEmpty() || veterinarian.equals("Veterinary Clinic") || veterinarian.equalsIgnoreCase(user.getUserName())) {
                        veterinarian = vet.getName();
                    }
                    if (clinic == null || clinic.trim().isEmpty() || clinic.equals("Veterinary Clinic")) {
                        clinic = vet.getClinicAddress();
                    }
                }
            }
        } catch (Exception e) {
            // fallback
        }

        vaccination.setVaccineName(request.getVaccineName());
        vaccination.setVaccinationDate(request.getVaccinationDate());
        vaccination.setNextDueDate(request.getNextDueDate());
        vaccination.setVeterinarian(veterinarian);
        vaccination.setClinic(clinic);
        vaccination.setBatchNumber(request.getBatchNumber());
        vaccination.setNotes(request.getNotes());

        Vaccination updated = vaccinationRepository.save(vaccination);
        return convertToResponse(updated);
    }

    @Override
    public VaccinationResponse getVaccinationById(Long id) {
        Vaccination vaccination = vaccinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaccination not found"));
        return convertToResponse(vaccination);
    }

    @Override
    public List<VaccinationResponse> getVaccinationsByPetId(Long petId) {
        List<Vaccination> vaccinations = vaccinationRepository.findByPetIdOrderByVaccinationDateDesc(petId);
        return vaccinations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<VaccinationResponse> getVaccinationsByUserId(Long userId) {
        List<Vaccination> vaccinations = vaccinationRepository.findByUserIdOrderByVaccinationDateDesc(userId);
        return vaccinations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<VaccinationResponse> getUpcomingVaccinations(Date beforeDate) {
        List<Vaccination> vaccinations = vaccinationRepository.findUpcomingVaccinations(beforeDate);
        return vaccinations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteVaccination(Long id) {
        if (!vaccinationRepository.existsById(id)) {
            throw new RuntimeException("Vaccination not found");
        }
        vaccinationRepository.deleteById(id);
    }

    @Override
    public Long countVaccinationsByPetId(Long petId) {
        return vaccinationRepository.countByPetId(petId);
    }

    private VaccinationResponse convertToResponse(Vaccination vaccination) {
        return VaccinationResponse.builder()
                .id(vaccination.getId())
                .petId(vaccination.getPet().getId())
                .petName(vaccination.getPet().getName())
                .vaccineName(vaccination.getVaccineName())
                .vaccinationDate(vaccination.getVaccinationDate())
                .nextDueDate(vaccination.getNextDueDate())
                .veterinarian(vaccination.getVeterinarian())
                .clinic(vaccination.getClinic())
                .batchNumber(vaccination.getBatchNumber())
                .notes(vaccination.getNotes())
                .createdAt(vaccination.getCreatedAt())
                .build();
    }
}
