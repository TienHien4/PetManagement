package com.example.petcaremanagement.Mapper;
import com.example.petcaremanagement.Dto.PetDTO.PetRequest;
import com.example.petcaremanagement.Dto.PetDTO.PetResponse;
import com.example.petcaremanagement.Entity.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Mapper(componentModel = "spring")
public interface PetMapper {

    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "image", ignore = true) // vì image sẽ xử lý riêng bên service
    Pet toPet(PetRequest request);

    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "species", source = "species")
    @Mapping(target = "breed", source = "breed")
    @Mapping(target = "gender", source = "gender")
    @Mapping(target = "dob", source = "dob")
    @Mapping(target = "weight", source = "weight")
    @Mapping(target = "age", source = "age")
    @Mapping(target = "imageUrl", expression = "java(buildImageUrl(pet.getImage()))")
    PetResponse toPetResponse(Pet pet);

    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "image", ignore = true) // image sẽ xử lý riêng
    void updatePet(@MappingTarget Pet pet, PetRequest request);

    @Named("buildImageUrl")
    default String buildImageUrl(String imageName) {
        if (imageName == null || imageName.isEmpty()) {
            return null;
        }
        String baseUrl = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .build()
                .toUriString();
        return baseUrl + "/uploads/pets/" + imageName;
    }


}
