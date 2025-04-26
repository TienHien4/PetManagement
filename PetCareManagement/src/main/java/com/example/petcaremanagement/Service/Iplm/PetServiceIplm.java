package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.PetDTO.PetRequest;
import com.example.petcaremanagement.Dto.PetDTO.PetResponse;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Mapper.PetMapper;
import com.example.petcaremanagement.Mapper.UserMapper;
import com.example.petcaremanagement.Repository.PetRepository;
import com.example.petcaremanagement.Repository.UserRepository;
import com.example.petcaremanagement.Service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceIplm implements PetService {
    @Autowired
    private PetRepository petRepo;

    @Autowired
    private UserRepository userRepo;
   @Autowired
   private  PetMapper petMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    public PetResponse CreatePet(PetRequest request) {
          Pet pet = petMapper.toPet(request);
          User owner = userRepo.findById(request.getOwnerId()).orElseThrow(() -> new RuntimeException("Owner not found with id: " + request.getOwnerId()));
          pet.setOwner(owner);
          petRepo.save(pet);
          var response = petMapper.toPetResponse(pet);
          response.setOwnerId(pet.getOwner().getId());
        return response;
    }

    @Override
    public PetResponse UpdatePet(long id, PetRequest request) {
        Pet pet = petRepo.findById(id).orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
        petMapper.updatePet(pet, request);
        return petMapper.toPetResponse(petRepo.save(pet));
    }

    @Override
    public List<PetResponse> GetAllPet() {
        List<Pet> listPets = petRepo.findAll();
        List<PetResponse> listResponse = listPets.stream()
                .map(pet -> {
                    PetResponse petResponse = petMapper.toPetResponse(pet);
                    petResponse.setOwnerId(pet.getOwner().getId());
                    return petResponse;
                })
                .toList();

        return listResponse;
    }

    @Override
    public PetResponse GetPetById(long id) {
        Pet pet = petRepo.findById(id).orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
        PetResponse response = petMapper.toPetResponse(pet);
        response.setOwnerId(pet.getOwner().getId());
        return response;
    }

    @Override
    public List<PetResponse> GetPetByKeyword(String keyword) {
        List<Pet> listPets = petRepo.searchSP(keyword);
        List<PetResponse> listResponse = listPets.stream()
                .map(pet -> {
                    PetResponse petResponse = petMapper.toPetResponse(pet);
                    petResponse.setOwnerId(pet.getOwner().getId());
                    return petResponse;
                })
                .toList();

        return listResponse;
    }

    @Override
    public List<PetResponse> GetPetBySpecies(String species) {
        List<Pet> listPets = petRepo.findPetsBySpecies(species);
        return listPets.stream().map(s -> petMapper.toPetResponse(s)).toList();
    }


    @Override
    public void DeletePet(long id) {
        Pet pet = petRepo.findById(id).orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
        petRepo.delete(pet);
    }

    @Override
    public Page<PetResponse> Pagination(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo-1, pageSize);
        return petRepo.findAll(pageable).map(s -> {
            PetResponse petResponse = petMapper.toPetResponse(s);
            petResponse.setOwnerId(s.getOwner().getId());
            return petResponse;
        });
    }

    @Override
    public List<PetResponse> GetPetsByUser(long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        var listPets = petRepo.findByOwner(user);
        var response = listPets.stream().map(
                s -> {
                    PetResponse petResponse = petMapper.toPetResponse(s);
                    petResponse.setOwnerId(userId);
                    return petResponse;
                }
        ).toList();
        return response;
    }
}
