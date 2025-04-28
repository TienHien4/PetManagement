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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


import java.util.List;
import java.util.UUID;

@Service
public class PetServiceIplm implements PetService {
    @Autowired
    private PetRepository petRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PetMapper petMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    public PetResponse CreatePet(PetRequest request, MultipartFile imageFile) {
        Pet pet = petMapper.toPet(request);
        User owner = userRepo.findById(request.getOwnerId()).orElseThrow(() ->
                new RuntimeException("Owner not found with id: " + request.getOwnerId()));

        pet.setOwner(owner);

        // Xử lý ảnh nếu có
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            pet.setImage(imagePath);  // Set đường dẫn ảnh vào Pet
        }

        petRepo.save(pet);

        PetResponse response = petMapper.toPetResponse(pet);
        response.setOwnerId(pet.getOwner().getId());
        return response;
    }

    // Phương thức cập nhật Pet với ảnh
    @Override
    public PetResponse UpdatePet(long id, PetRequest request, MultipartFile imageFile) {
        Pet pet = petRepo.findById(id).orElseThrow(() ->
                new RuntimeException("Pet not found with id: " + id));

        petMapper.updatePet(pet, request);

        // Xử lý ảnh nếu có
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            pet.setImage(imagePath);  // Cập nhật ảnh mới vào Pet
        }

        petRepo.save(pet);
        return petMapper.toPetResponse(pet);
    }

    // Lưu ảnh vào thư mục và trả về đường dẫn ảnh
    private String saveImage(MultipartFile imageFile) {
        try {
            // Lấy phần mở rộng của file (extension)
            String originalFilename = imageFile.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // Tạo tên ảnh mới với phần mở rộng đúng
            String imageName = UUID.randomUUID().toString() + extension;

            Path imagePath = Paths.get("uploads/pets", imageName);

            // Tạo thư mục nếu chưa có
            Files.createDirectories(imagePath.getParent());

            // Ghi file vào thư mục
            Files.write(imagePath, imageFile.getBytes());

            return imageName;
        } catch (IOException e) {
            throw new RuntimeException("Could not save image file: " + e.getMessage());
        }
    }


    @Override
    public List<PetResponse> GetAllPet() {
        List<Pet> listPets = petRepo.findAll();
        return listPets.stream().map(pet -> {
            PetResponse petResponse = petMapper.toPetResponse(pet);
            petResponse.setOwnerId(pet.getOwner().getId());
            return petResponse;
        }).toList();
    }

    @Override
    public PetResponse GetPetById(long id) {
        Pet pet = petRepo.findById(id).orElseThrow(() ->
                new RuntimeException("Pet not found with id: " + id));
        PetResponse response = petMapper.toPetResponse(pet);
        response.setOwnerId(pet.getOwner().getId());
        return response;
    }

    @Override
    public List<PetResponse> GetPetByKeyword(String keyword) {
        List<Pet> listPets = petRepo.searchSP(keyword);
        return listPets.stream().map(pet -> {
            PetResponse petResponse = petMapper.toPetResponse(pet);
            petResponse.setOwnerId(pet.getOwner().getId());
            return petResponse;
        }).toList();
    }

    @Override
    public List<PetResponse> GetPetBySpecies(String species) {
        List<Pet> listPets = petRepo.findPetsBySpecies(species);
        return listPets.stream().map(s -> petMapper.toPetResponse(s)).toList();
    }

    @Override
    public void DeletePet(long id) {
        Pet pet = petRepo.findById(id).orElseThrow(() ->
                new RuntimeException("Pet not found with id: " + id));
        petRepo.delete(pet);
    }

    @Override
    public Page<PetResponse> Pagination(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        return petRepo.findAll(pageable).map(s -> {
            PetResponse petResponse = petMapper.toPetResponse(s);
            petResponse.setOwnerId(s.getOwner().getId());
            return petResponse;
        });
    }

    @Override
    public List<PetResponse> GetPetsByUser(long userId) {
        User user = userRepo.findById(userId).orElseThrow(() ->
                new RuntimeException("User not found"));
        List<Pet> listPets = petRepo.findByOwner(user);
        return listPets.stream().map(s -> {
            PetResponse petResponse = petMapper.toPetResponse(s);
            petResponse.setOwnerId(userId);
            return petResponse;
        }).toList();
    }
}
