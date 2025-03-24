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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
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
        if(!authen){
            throw new JwtException("Token is invalid in Au");
        }
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

    @Override
    public String Logout(LogoutRequest request) throws Exception {

        var token = request.getToken();
        if (token == null || token.isEmpty()) {
            return ("Missing token");
        }

        // Kiểm tra nếu token có tiền tố "Bearer " thì loại bỏ nó
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        var signJWT = ValidToken1(request.getToken());
        String id = signJWT.getJWTClaimsSet().getJWTID();
        var expTime = signJWT.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .expTime(expTime)
                .UUID(id)
                .build();
        invalidatedTokenRepo.save(invalidatedToken);
        return "Success";
    }

    @Override
    public LoginResponse RefreshToken(RefreshTokenRequest request) throws Exception {
        SignedJWT signedRefreshToken = SignedJWT.parse(request.getRefreshToken());
        Date expTimeRefreshToken = signedRefreshToken.getJWTClaimsSet().getExpirationTime();
        System.out.println(expTimeRefreshToken);
        if (expTimeRefreshToken.before(new Date())) {
            throw new Exception("RefreshToken has expired");
        }

        SignedJWT signedAccessToken = SignedJWT.parse(request.getToken());
        String tokenId = signedAccessToken.getJWTClaimsSet().getJWTID();
        Date expTimeAccessToken = signedAccessToken.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .expTime(expTimeAccessToken)
                .UUID(tokenId)
                .build();

        invalidatedTokenRepo.save(invalidatedToken);
        var user = userRepo.findUserByUserName(signedRefreshToken.getJWTClaimsSet().getSubject());
        var newAccessToken = GeneratedToken(user);

        return LoginResponse.builder()
                .token(newAccessToken)
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


    @Override
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

    @Override
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
