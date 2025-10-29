package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.PetDTO.PetRequest;
import com.example.petcaremanagement.Dto.PetDTO.PetResponse;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Mapper.PetMapper;
import com.example.petcaremanagement.Mapper.UserMapper;
import com.example.petcaremanagement.Repository.PetRepository;
import com.example.petcaremanagement.Repository.UserRepository;
import com.example.petcaremanagement.Service.CloudinaryService;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    @Autowired
    private CloudinaryService cloudinaryService;

    private static final Logger logger = LoggerFactory.getLogger(PetServiceIplm.class);

    @Override
    public PetResponse CreatePet(PetRequest petRequest, MultipartFile imageFile) {
        try {
            // Validate user exists
            User user = userRepo.findById(petRequest.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + petRequest.getUserId()));

            // Create new Pet
            Pet pet = new Pet();
            pet.setName(petRequest.getName());
            pet.setSpecies(petRequest.getSpecies());
            pet.setBreed(petRequest.getBreed());
            pet.setGender(petRequest.getGender());
            pet.setDob(petRequest.getDob());
            pet.setWeight(petRequest.getWeight());
            pet.setAge(petRequest.getAge());
            pet.setOwner(user);

            // Handle image upload
            String imageUrl = handleImageUpload(imageFile);
            if (imageUrl != null) {
                pet.setImage(imageUrl);
            }

            // Save pet
            Pet savedPet = petRepo.save(pet);

            return convertToResponse(savedPet);
        } catch (Exception e) {
            throw new RuntimeException("Error creating pet: " + e.getMessage(), e);
        }
    }

    @Override
    public PetResponse UpdatePet(long id, PetRequest petRequest, MultipartFile imageFile) {
        try {
            // Find existing pet
            Pet existingPet = petRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));

            // Validate user exists if userId is provided
            User user = userRepo.findById(petRequest.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + petRequest.getUserId()));
            existingPet.setOwner(user);

            // Update pet fields
            if (petRequest.getName() != null) {
                existingPet.setName(petRequest.getName());
            }
            if (petRequest.getSpecies() != null) {
                existingPet.setSpecies(petRequest.getSpecies());
            }
            if (petRequest.getBreed() != null) {
                existingPet.setBreed(petRequest.getBreed());
            }
            if (petRequest.getGender() != null) {
                existingPet.setGender(petRequest.getGender());
            }
            if (petRequest.getDob() != null) {
                existingPet.setDob(petRequest.getDob());
            }
            if (petRequest.getWeight() != 0) {
                existingPet.setWeight(petRequest.getWeight());
            }
            if (petRequest.getAge() != 0) {
                existingPet.setAge(petRequest.getAge());
            }

            // Handle image upload if new image is provided
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = handleImageUpload(imageFile);
                if (imageUrl != null) {
                    existingPet.setImage(imageUrl);
                }
            }

            // Save updated pet
            Pet updatedPet = petRepo.save(existingPet);

            return convertToResponse(updatedPet);
        } catch (Exception e) {
            throw new RuntimeException("Error updating pet: " + e.getMessage(), e);
        }
    }

    private String handleImageUpload(MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            return null;
        }

        try {
            // Validate file size (max 5MB)
            long maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (imageFile.getSize() > maxSize) {
                throw new RuntimeException("Image size must be less than 5MB");
            }

            // Validate file type
            String contentType = imageFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("File must be an image (jpg, png, etc.)");
            }

            // Upload to Cloudinary in pet_images folder
            return cloudinaryService.uploadImage(imageFile, "pet_images");

        } catch (Exception e) {
            throw new RuntimeException("Error uploading image: " + e.getMessage(), e);
        }
    }

    private PetResponse convertToResponse(Pet pet) {
        PetResponse response = new PetResponse();
        response.setId(pet.getId());
        response.setName(pet.getName());
        response.setSpecies(pet.getSpecies());
        response.setBreed(pet.getBreed());
        response.setGender(pet.getGender());
        response.setDob(pet.getDob());
        response.setWeight(pet.getWeight());
        response.setAge(pet.getAge());
        response.setImage(pet.getImage());
        response.setUserId((pet.getOwner() != null ? pet.getOwner().getId() : null));
        return response;
    }

    @Override
    public List<PetResponse> GetAllPet() {
        List<Pet> listPets = petRepo.findAll();
        return listPets.stream().map(pet -> {
            PetResponse petResponse = petMapper.toPetResponse(pet);
            petResponse.setUserId(pet.getOwner().getId());
            return petResponse;
        }).toList();
    }

    @Override
    public PetResponse GetPetById(long id) {
        Pet pet = petRepo.findById(id).orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
        PetResponse response = petMapper.toPetResponse(pet);
        response.setUserId(pet.getOwner().getId());
        return response;
    }

    @Override
    public List<PetResponse> GetPetByKeyword(String keyword) {
        List<Pet> listPets = petRepo.searchSP(keyword);
        return listPets.stream().map(pet -> {
            PetResponse petResponse = petMapper.toPetResponse(pet);
            petResponse.setUserId(pet.getOwner().getId());

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
        Pet pet = petRepo.findById(id).orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
        petRepo.delete(pet);
    }

    @Override
    public Page<PetResponse> Pagination(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        logger.info("Test");
        logger.error("error");
        logger.warn("warn");
        return petRepo.findAll(pageable).map(s -> {
            PetResponse petResponse = petMapper.toPetResponse(s);
            petResponse.setUserId(s.getOwner().getId());
            return petResponse;
        });
    }

    @Override
    public List<PetResponse> GetPetsByUser(long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Pet> listPets = petRepo.findByOwner(user);
        return listPets.stream().map(s -> {
            PetResponse petResponse = petMapper.toPetResponse(s);
            petResponse.setUserId(userId);
            return petResponse;
        }).toList();
    }
}
