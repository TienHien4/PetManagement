package com.example.petcaremanagement.config;

import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String provider = userRequest.getClientRegistration().getRegistrationId().toUpperCase();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        User existingUser = userRepository.findUserByUserName(email);

        if (existingUser != null) {
            User user = existingUser;
            if ("NORMAL".equals(user.getProvider())) {
                throw new OAuth2AuthenticationException("Tài khoản này đã đăng ký bằng username/password. Vui lòng đăng nhập bằng tài khoản thông thường.");
            }

            // Cập nhật token nếu user đã tồn tại
//            user.setAccessToken(userRequest.getAccessToken().getTokenValue());
            userRepository.save(user);
            return oAuth2User;
        } else {
            // Nếu user chưa tồn tại, tạo user mới
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUserName(name);
            newUser.setProvider(provider);
//            newUser.setAccessToken(userRequest.getAccessToken().getTokenValue());
            userRepository.save(newUser);
        }

        return oAuth2User;
    }
}
