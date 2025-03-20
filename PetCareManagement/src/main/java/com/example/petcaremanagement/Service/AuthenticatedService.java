package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.LoginDTO.LoginRequest;
import com.example.petcaremanagement.Dto.LoginDTO.LoginResponse;
import com.example.petcaremanagement.Dto.LoginDTO.LogoutRequest;
import com.example.petcaremanagement.Dto.LoginDTO.RefreshTokenRequest;

public interface AuthenticatedService {
    LoginResponse Authenticated(LoginRequest request);
    void Logout(LogoutRequest request) throws Exception;
    LoginResponse RefreshToken(RefreshTokenRequest request) throws Exception;

    public boolean ValidToken(String token) throws Exception;
}
