package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.LoginDTO.LoginRequest;
import com.example.petcaremanagement.Dto.LoginDTO.LoginResponse;
import com.example.petcaremanagement.Dto.LoginDTO.LogoutRequest;
import com.example.petcaremanagement.Dto.LoginDTO.RefreshTokenRequest;
import com.example.petcaremanagement.Service.AuthenticatedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
    @Autowired
    private AuthenticatedService authenticatedService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> Login(@RequestBody LoginRequest request){
           var result = authenticatedService.Authenticated(request);
           return ResponseEntity.ok().body(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> Logout(@RequestBody LogoutRequest request) throws Exception {
        authenticatedService.Logout(request);
        try {
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .build();
        }
    }
    @PostMapping("/refreshToken")
    public ResponseEntity<LoginResponse> RefreshToken(@RequestBody RefreshTokenRequest request) throws Exception {
        var result = authenticatedService.RefreshToken(request);
        return ResponseEntity.ok().body(result);
    }

}
