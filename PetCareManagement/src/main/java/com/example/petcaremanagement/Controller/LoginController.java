package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.LoginDTO.*;
import com.example.petcaremanagement.DtoError.ErrorResponse;
import com.example.petcaremanagement.Entity.Role;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Repository.RoleRepository;
import com.example.petcaremanagement.Repository.UserRepository;
import com.example.petcaremanagement.Service.AuthenticatedService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.logging.LogManager;
import java.util.logging.Logger;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class LoginController {
    @Autowired
    private AuthenticatedService authenticatedService;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private RoleRepository roleRepo;
    private static  final Logger LOGGER =  Logger.getLogger(LoginController.class.getName());

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LOGGER.info("Success");
            var result = authenticatedService.Authenticated(request);
            return ResponseEntity.ok(result);
        } catch (JwtException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Password is invalid!"));
        }
    }


    @GetMapping("/login/oauth2/code/google")
    public void oauth2SuccessGoogle(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String redirectUrl = "http://localhost:3000/oauth2/redirect";
        response.sendRedirect(redirectUrl);
    }


    @GetMapping("/login/oauth2/code/facebook")
    public void oauth2SuccessFacebook(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String redirectUrl = "http://localhost:3000/oauth2/redirect";
        response.sendRedirect(redirectUrl);
    }


    @GetMapping("/oauth2/success")
    public ResponseEntity<?> oauth2Success() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Email not provided"));
        }

        User user = userRepo.findUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "User not saved"));
        }

        String jwtToken = authenticatedService.GeneratedToken(user);
        String refreshToken = authenticatedService.GeneratedRefreshToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("refreshToken", refreshToken);
        response.put("user", Map.of("email", email, "name", name, "roles", "USER"));

        return ResponseEntity.ok(response);
    }


    @PostMapping("/api/logout")
    public ResponseEntity<String> Logout(@RequestBody LogoutRequest request) throws Exception {
        var result = authenticatedService.Logout(request);
        return ResponseEntity.ok().body(result);
    }
    @PostMapping("/refreshToken")
    public ResponseEntity<LoginResponse> RefreshToken(@RequestBody RefreshTokenRequest request) throws Exception {
        var result = authenticatedService.RefreshToken(request);
        return ResponseEntity.ok().body(result);
    }

}
