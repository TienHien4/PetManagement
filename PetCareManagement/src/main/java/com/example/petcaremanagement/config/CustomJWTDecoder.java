package com.example.petcaremanagement.config;

import com.example.petcaremanagement.Service.AuthenticatedService;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.spec.SecretKeySpec;
import java.util.Objects;

@Component
public class CustomJWTDecoder implements JwtDecoder {

    @NonFinal
    @Value("${security.signer-key}")
    private String SIGNER_KEY;

    @Autowired
    private AuthenticatedService authenticatedService;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            boolean isValid = authenticatedService.ValidToken(token);
            if (!isValid) {
                throw new JwtException("Token is invalid");
            }
        } catch (JwtException e) {
            throw e;
        } catch (Exception e) {
            throw new JwtException("Internal token validation error", e);
        }

        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }

        return nimbusJwtDecoder.decode(token);
    }

}

