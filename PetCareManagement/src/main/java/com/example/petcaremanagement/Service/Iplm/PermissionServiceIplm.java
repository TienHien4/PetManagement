package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.PermissionDTO.PermissionRequest;
import com.example.petcaremanagement.Dto.PermissionDTO.PermissionResponse;
import com.example.petcaremanagement.Entity.Permission;
import com.example.petcaremanagement.Mapper.PermissionMapper;
import com.example.petcaremanagement.Repository.PermissionRepository;
import com.example.petcaremanagement.Service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

public class PermissionServiceIplm implements PermissionService {

    @Autowired
    private PermissionRepository permissionRepo;
    @Autowired
    private PermissionMapper permissionMapper;

    @Override
    public PermissionResponse CreatePermission(PermissionRequest request) {
        Permission permission = permissionMapper.toPermission(request);
        return permissionMapper.toPermissionResponse(permissionRepo.save(permission));
    }

    @Override
    public List<PermissionResponse> GetAllPermissions() {
        var listPermissions = permissionRepo.findAll();
        return listPermissions.stream().map(s -> permissionMapper.toPermissionResponse(s)).toList();
    }

    @Override
    public void DeletePermission(String name) {
        permissionRepo.deleteById(name);
    }
}
