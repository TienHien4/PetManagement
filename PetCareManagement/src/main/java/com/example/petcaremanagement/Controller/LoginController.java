package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.LoginDTO.*;
import com.example.petcaremanagement.Entity.Role;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Repository.RoleRepository;
import com.example.petcaremanagement.Repository.UserRepository;
import com.example.petcaremanagement.Service.AuthenticatedService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
    @Autowired
    private AuthenticatedService authenticatedService;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private RoleRepository roleRepo;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> Login(@RequestBody LoginRequest request){
           var result = authenticatedService.Authenticated(request);
           return ResponseEntity.ok().body(result);
    }



    @GetMapping("/oauth2/authorization/facebook")
    private Map<String, Object> getUserProfile(@AuthenticationPrincipal OAuth2User principal) {

        return principal.getAttributes();
    }

//    @GetMapping("/login/oauth2/code/facebook")
//    public String handleOAuth2Callback() {
//        System.out.println("IN");
//       return "Test";
//    }

    @GetMapping("/oauth2/success")
    public ResponseEntity<?> handleOAuth2Success(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Lấy thông tin user từ OAuth2
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String provider = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();

        // Trả về thông tin user
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("email", email);
        userInfo.put("name", name);
        userInfo.put("provider", provider);

        return ResponseEntity.ok(userInfo);
    }

//    @GetMapping("")
//    private ResponseEntity<?> handleFacebookLogin(String accessToken) {
//        FacebookUserInfo facebookUser = getFacebookUserInfo(accessToken);
//        if (facebookUser == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token Facebook không hợp lệ!");
//        }
//
//        // Kiểm tra user trong database
//        User user = userRepo.findUserByEmail(facebookUser.getEmail());
//        if (user == null) {
//            Set<Role> roles = new HashSet<>();
//            Role role = roleRepo.findById("USER")
//                    .orElseThrow(() -> new EntityNotFoundException("Role USER not found"));
//            roles.add(role);
//
//            user = User.builder()
//                    .email(facebookUser.getEmail())
//                    .userName(facebookUser.getName())
//                    .provider("FACEBOOK")
//                    .roles(roles)
//                    .build();
//
//            userRepo.save(user);
//        }
//        Set<String> vt = new HashSet<>();
//        vt.add("USER");
//
//        // Tạo AccessToken & RefreshToken
//        String accessTokenJWT = authenticatedService.GeneratedToken(user);
//        String refreshTokenJWT = authenticatedService.GeneratedRefreshToken(user);
//
//        return ResponseEntity.ok(new OAuth2Response(accessTokenJWT, refreshTokenJWT, user.getEmail(), "FACEBOOK", vt));
//    }
//
//    // Gọi Facebook API để lấy thông tin user
//    private FacebookUserInfo getFacebookUserInfo(String accessToken) {
//        String url = "https://graph.facebook.com/me?fields=id,name,email,picture&access_token=" + accessToken;
//        RestTemplate restTemplate = new RestTemplate();
//        try {
//            return restTemplate.getForObject(url, FacebookUserInfo.class);
//        } catch (Exception e) {
//            return null;
//        }
//    }


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
