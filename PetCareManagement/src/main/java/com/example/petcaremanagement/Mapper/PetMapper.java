package com.example.petcaremanagement.Mapper;
import com.example.petcaremanagement.Dto.PetDTO.PetResponse;
import com.example.petcaremanagement.Dto.PetDTO.PetRequest;
import com.example.petcaremanagement.Entity.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PetMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "image", ignore = true) // vì image sẽ xử lý riêng bên service
    @Mapping(target = "vaccinations", ignore = true)
    @Mapping(target = "medicalRecords", ignore = true)
    @Mapping(target = "weightRecords", ignore = true)
    Pet toPet(PetRequest request);

    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "imageUrl", source = "image")
    PetResponse toPetResponse(Pet pet);

    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "image", ignore = true) // image sẽ xử lý riêng
    @Mapping(target = "vaccinations", ignore = true)
    @Mapping(target = "medicalRecords", ignore = true)
    @Mapping(target = "weightRecords", ignore = true)
    void updatePet(@MappingTarget Pet pet, PetRequest request);
}
