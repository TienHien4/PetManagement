package com.example.petcaremanagement.Dto.LoginDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OAuth2Request {
    private String accessToken;
    private String provider;
}

