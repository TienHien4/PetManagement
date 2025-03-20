package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.LoginDTO.LoginRequest;
import com.example.petcaremanagement.Dto.LoginDTO.LoginResponse;
import com.example.petcaremanagement.Dto.LoginDTO.LogoutRequest;
import com.example.petcaremanagement.Dto.LoginDTO.RefreshTokenRequest;
import com.example.petcaremanagement.Entity.InvalidatedToken;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Repository.InvalidatedTokenRepository;
import com.example.petcaremanagement.Repository.UserRepository;
import com.example.petcaremanagement.Service.AuthenticatedService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthenticatedServiceIplm implements AuthenticatedService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private InvalidatedTokenRepository invalidatedTokenRepo;
    @NonFinal
    @Value("${security.signer-key}")
    private String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-time}")
    private int VALID_TIME;

    @NonFinal
    @Value("${jwt.refresh-time}")
    private int REFRESH_TIME;
    @Override
    public LoginResponse Authenticated(LoginRequest request) {
        var user = userRepo.findUserByUserName(request.getUserName());
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        var authen = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(authen){
            Set<String> listRoles = user.getRoles()
                    .stream().map(s -> s.getName()).collect(Collectors.toSet());
            String accessToken = GeneratedToken(user);
            String refreshToken = GeneratedRefreshToken(user);
            return LoginResponse.builder()
                    .userName(request.getUserName())
                    .roles(listRoles)
                    .token(accessToken)
                    .refreshToken(refreshToken)
                    .message("Login success!")
                    .build();


        }
        return LoginResponse.builder()
                .message("Login fail!")
                .build();
    }

    @Override
    public void Logout(LogoutRequest request) throws Exception {
        var signJWT = ValidToken1(request.getToken());
        String id = signJWT.getJWTClaimsSet().getJWTID();
        var expTime = signJWT.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .expTime(expTime)
                .UUID(id)
                .build();
        invalidatedTokenRepo.save(invalidatedToken);
    }

    @Override
    public LoginResponse RefreshToken(RefreshTokenRequest request) throws Exception {
        SignedJWT  signedJWT = SignedJWT.parse(request.getRefreshToken());
        var issueTime = signedJWT.getJWTClaimsSet().getIssueTime();
        var expTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        SignedJWT  signedJWT1 = SignedJWT.parse(request.getToken());
        var id = signedJWT1.getJWTClaimsSet().getJWTID();
        var expTime1 = signedJWT1.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .expTime(expTime1)
                .UUID(id)
                .build();
        if(expTime.before(new Date())){
            invalidatedTokenRepo.save(invalidatedToken);
            throw new Exception("RefreshToken is invalid");
        }

        invalidatedTokenRepo.save(invalidatedToken);
        var user = userRepo.findUserByUserName(signedJWT.getJWTClaimsSet().getSubject());
        var newAccessToken = GeneratedToken(user);
        var newRefreshToken = GeneratedRefreshToken(user);
        return LoginResponse.builder()
                .token(newAccessToken)
                .refreshToken(newRefreshToken)
                .message("Success")
                .build();
    }

    @Override
    public boolean ValidToken(String token) throws Exception {
        JWSVerifier jwsVerifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expireTime =  signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(jwsVerifier);
        if (!(verified && expireTime.after(new Date()))) {
            return false;
        }
        return true;
    }


    public SignedJWT ValidToken1(String token) throws Exception {
        JWSVerifier jwsVerifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expireTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(jwsVerifier);

        // Kiểm tra nếu token đã bị vô hiệu hóa
        boolean isInvalidated = invalidatedTokenRepo.existsByUUID(signedJWT.getJWTClaimsSet().getJWTID());
        if (isInvalidated || !(verified && expireTime.after(new Date()))) {
            throw new Exception("Token invalid or expired");
        }
        return signedJWT;
    }


    public String GeneratedToken(User user){
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.SECOND, VALID_TIME);
        var expirationTime = calendar.getTime();
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUserName())
                .issuer("com.example.petcaremanagement")
                .issueTime(new Date())
                .jwtID(UUID.randomUUID().toString())
                .expirationTime(expirationTime)
                .claim("roles", buildScope(user))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        }catch(JOSEException e){
            throw new RuntimeException();
        }

    }

    public String GeneratedRefreshToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.SECOND, REFRESH_TIME);
        var expirationTime = calendar.getTime();
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUserName())
                .issuer("com.example.petcaremanagement")
                .issueTime(new Date())
                .expirationTime(expirationTime)
                .build();
        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        }catch(JOSEException e){
            throw new RuntimeException();
        }

    }
    public String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions()))
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
            });

        return stringJoiner.toString();
    }
}
