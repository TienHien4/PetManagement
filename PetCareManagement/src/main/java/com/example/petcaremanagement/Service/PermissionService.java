package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.PermissionDTO.PermissionRequest;
import com.example.petcaremanagement.Dto.PermissionDTO.PermissionResponse;

import java.util.List;

public interface PermissionService {
    PermissionResponse CreatePermission(PermissionRequest request);
    List<PermissionResponse> GetAllPermissions();

    void DeletePermission(String name);
}
