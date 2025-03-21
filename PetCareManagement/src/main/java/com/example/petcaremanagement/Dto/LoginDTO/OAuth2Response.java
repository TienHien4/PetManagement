package com.example.petcaremanagement.Dto.LoginDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OAuth2Response {
    private String accessToken;
    private String refreshToken;
    private String email;
    private String provider;
    private Set<String> roles;
}
