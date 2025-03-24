package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.LoginDTO.LoginRequest;
import com.example.petcaremanagement.Dto.LoginDTO.LoginResponse;
import com.example.petcaremanagement.Dto.LoginDTO.LogoutRequest;
import com.example.petcaremanagement.Dto.LoginDTO.RefreshTokenRequest;
import com.example.petcaremanagement.Entity.User;

public interface AuthenticatedService {
    LoginResponse Authenticated(LoginRequest request);
    String Logout(LogoutRequest request) throws Exception;
    LoginResponse RefreshToken(RefreshTokenRequest request) throws Exception;

    boolean ValidToken(String token) throws Exception;
    String GeneratedToken(User user);
    String GeneratedRefreshToken(User user);


}
