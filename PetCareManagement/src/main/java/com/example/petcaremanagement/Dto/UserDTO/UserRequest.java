package com.example.petcaremanagement.Dto.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {
    private String userName;
    private String email;
    private String password;
    private String provider;
    private Set<String> roles;

}