package com.example.petcaremanagement.Dto.LoginDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
