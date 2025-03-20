package com.example.petcaremanagement.Mapper;

import com.example.petcaremanagement.Dto.PermissionDTO.PermissionRequest;
import com.example.petcaremanagement.Dto.PermissionDTO.PermissionResponse;
import com.example.petcaremanagement.Entity.Permission;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);
    PermissionResponse toPermissionResponse(Permission permission);
}
