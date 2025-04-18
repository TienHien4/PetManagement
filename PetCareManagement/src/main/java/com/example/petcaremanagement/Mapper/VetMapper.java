package com.example.petcaremanagement.Mapper;

import com.example.petcaremanagement.Dto.VetDTO.VetRequest;
import com.example.petcaremanagement.Dto.VetDTO.VetResponse;
import com.example.petcaremanagement.Entity.Vet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VetMapper {
    @Mapping(target = "appointments", ignore = true)
    Vet toVet(VetRequest request);
    VetResponse toVetResponse(Vet vet);
    @Mapping(target = "appointments", ignore = true)
    void updateVet(@MappingTarget Vet vet, VetRequest request);
}
