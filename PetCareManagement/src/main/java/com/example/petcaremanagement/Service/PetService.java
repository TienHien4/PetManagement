package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.PetDTO.PetRequest;
import com.example.petcaremanagement.Dto.PetDTO.PetResponse;
import com.example.petcaremanagement.Mapper.PetMapper;
import com.example.petcaremanagement.Repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PetService {
    PetResponse CreatePet(PetRequest request, MultipartFile imageFile);
    PetResponse UpdatePet(long id, PetRequest request, MultipartFile imageFile);
    List<PetResponse> GetAllPet();
    PetResponse GetPetById(long id);
    List<PetResponse> GetPetByKeyword(String keyword);
    List<PetResponse> GetPetBySpecies(String species);
    void DeletePet(long id);
    Page<PetResponse> Pagination(int pageNo, int pageSize);
    List<PetResponse> GetPetsByUser(long userId);
}