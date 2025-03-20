package com.example.petcaremanagement.Mapper;
import com.example.petcaremanagement.Dto.PetDTO.PetRequest;
import com.example.petcaremanagement.Dto.PetDTO.PetResponse;
import com.example.petcaremanagement.Entity.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PetMapper {

    @Mapping(target = "owner", ignore = true)
    Pet toPet(PetRequest request);
    @Mapping(target = "ownerId", ignore = true)
    PetResponse toPetResponse(Pet pet);


    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updatePet(@MappingTarget Pet pet, PetRequest request);



}
