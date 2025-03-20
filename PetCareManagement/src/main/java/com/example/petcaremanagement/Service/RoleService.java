package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.RoleDTO.RoleRequest;
import com.example.petcaremanagement.Dto.RoleDTO.RoleResponse;

import java.util.List;

public interface RoleService {
    RoleResponse CreateRole(RoleRequest request);
    List<RoleResponse> GetAllRoles();

    RoleResponse GetRoleByName(String name);
}
