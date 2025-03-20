package com.example.petcaremanagement.Dto.RoleDTO;

import com.example.petcaremanagement.Entity.Permission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {
    private String name;
    private String description;
    private Set<Permission> permissions;
}
