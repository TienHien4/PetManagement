package com.example.petcaremanagement.Mapper;

import com.example.petcaremanagement.Dto.RoleDTO.RoleRequest;
import com.example.petcaremanagement.Dto.RoleDTO.RoleResponse;
import com.example.petcaremanagement.Entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(source =  "permissions", target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
