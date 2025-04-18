package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.VetDTO.VetRequest;
import com.example.petcaremanagement.Dto.VetDTO.VetResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface VetService {
    VetResponse CreateVet(VetRequest request);
    VetResponse UpdateVet(long id,VetRequest request);
    void DeleteVet(long id);
    List<VetResponse> GetAllVet();
    VetResponse GetVetById(long id);
    Page<VetResponse> Pagination(int pageNo, int pageSize);
}
