package com.example.petcaremanagement.Dto.LoginDTO;

import com.example.petcaremanagement.Entity.Notification;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.Role;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private long id;
    private String userName;
    private String token;
    private String refreshToken;
    private String message;
    private Set<String> roles;
}
