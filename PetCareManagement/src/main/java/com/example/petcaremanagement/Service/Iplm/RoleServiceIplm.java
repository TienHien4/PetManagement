package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.RoleDTO.RoleRequest;
import com.example.petcaremanagement.Dto.RoleDTO.RoleResponse;
import com.example.petcaremanagement.Entity.Permission;
import com.example.petcaremanagement.Entity.Role;
import com.example.petcaremanagement.Mapper.RoleMapper;
import com.example.petcaremanagement.Repository.PermissionRepository;
import com.example.petcaremanagement.Repository.RoleRepository;
import com.example.petcaremanagement.Service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RoleServiceIplm implements RoleService {
    @Autowired
    private RoleRepository roleRepo;
    @Autowired
    private PermissionRepository permissionRepo;
    @Autowired
    private RoleMapper roleMapper;

    @Override
    public RoleResponse CreateRole(RoleRequest request) {
        Role role = roleMapper.toRole(request);
        Set<String> listPermissionIds = request.getPermissions();
        var listPermissions = permissionRepo.findAllById(listPermissionIds);
        role.setPermissions(new HashSet<>(listPermissions));
        return roleMapper.toRoleResponse(role);
    }

    @Override
    public List<RoleResponse> GetAllRoles() {
        var listRoles = roleRepo.findAll();
        return listRoles.stream().map(s -> roleMapper.toRoleResponse(s)).toList();
    }

    @Override
    public RoleResponse GetRoleByName(String name) {
        Role role = roleRepo.findById(name).orElseThrow(() -> new RuntimeException("Can't find Role by: " + name));
        return roleMapper.toRoleResponse(role);
    }
}
