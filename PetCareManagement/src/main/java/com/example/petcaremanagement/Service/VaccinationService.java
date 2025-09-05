package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.Request.VaccinationRequest;
import com.example.petcaremanagement.Dto.Response.VaccinationResponse;

import java.util.Date;
import java.util.List;

public interface VaccinationService {
    VaccinationResponse createVaccination(VaccinationRequest request);

    VaccinationResponse updateVaccination(Long id, VaccinationRequest request);

    VaccinationResponse getVaccinationById(Long id);

    List<VaccinationResponse> getVaccinationsByPetId(Long petId);

    List<VaccinationResponse> getVaccinationsByUserId(Long userId);

    List<VaccinationResponse> getUpcomingVaccinations(Date beforeDate);

    void deleteVaccination(Long id);

    Long countVaccinationsByPetId(Long petId);
}
