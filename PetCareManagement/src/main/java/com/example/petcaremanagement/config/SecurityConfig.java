package com.example.petcaremanagement.config;

import com.nimbusds.jwt.JWT;
import jakarta.servlet.http.HttpServletResponse;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import static org.springframework.http.HttpMethod.*;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
        @Autowired
        private CustomOAuth2UserService customOAuth2UserService;
        @NonFinal
        @Value("${security.signer-key}")
        private String SIGNER_KEY;
        @Autowired
        private CustomJWTDecoder customJWTDecoder;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
                httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource()));
                httpSecurity.authorizeHttpRequests(request -> request
                                .requestMatchers(HttpMethod.GET, "/api/pet/**", "/uploads/pets/**", "/oauth2/**",
                                                "/login/**")
                                .permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/user/create",
                                                "/login/**", "/api/pet/**", "/uploads/pets/**", "/refreshToken",
                                                "/oauth2/**")
                                .permitAll()
                                .requestMatchers("/ws/**").permitAll()  // Allow WebSocket connections
                                .requestMatchers("/api/vet-dashboard/**").hasRole("VET")
                                .anyRequest().authenticated());
                httpSecurity.oauth2Login(oauth2 -> oauth2
                                .userInfoEndpoint(
                                                userInfoEndpointConfig -> userInfoEndpointConfig
                                                                .userService(customOAuth2UserService))
                                .loginPage("/login")

                                .defaultSuccessUrl("http://localhost:3000/oauth2/redirect", true)
                                .failureUrl("/login?error=true"));

                httpSecurity.exceptionHandling(exception -> exception
                                .authenticationEntryPoint((request, response, authException) -> {
                                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                        response.setContentType("application/json");
                                        response.getWriter().write("{\"error\": \"Unauthorized\"}");
                                }));
                httpSecurity.logout()
                                .logoutSuccessHandler((request, response, authentication) -> {
                                        response.setStatus(HttpServletResponse.SC_OK);
                                        response.getWriter().write("Logged out successfully");
                                });

                httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(customJWTDecoder).jwtAuthenticationConverter(jwtAuthenticationConverter())));
                httpSecurity.csrf(AbstractHttpConfigurer::disable);
                httpSecurity.formLogin().disable();
                return httpSecurity.build();
        }

        @Bean
        public JwtAuthenticationConverter jwtAuthenticationConverter() {
                JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
                grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
                grantedAuthoritiesConverter.setAuthorityPrefix("");

                JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
                authenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
                return authenticationConverter;
        }

        private final List<String> ALLOWED_ORIGINS = List.of(
                        "http://localhost:3000",
                        "http://localhost:3001");
        private final List<String> ALLOWED_HTTP_METHODS = List.of(
                        GET.toString(),
                        POST.toString(),
                        PUT.toString(),
                        PATCH.toString(),
                        DELETE.toString(),
                        OPTIONS.toString());
        private final List<String> ALLOWED_HEADERS = List.of(
                        HttpHeaders.AUTHORIZATION,
                        HttpHeaders.ACCEPT_LANGUAGE,
                        HttpHeaders.CONTENT_TYPE);
        private final List<String> EXPOSED_HEADERS = List.of(
                        HttpHeaders.AUTHORIZATION,
                        HttpHeaders.ACCEPT_LANGUAGE);

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(ALLOWED_ORIGINS);
                configuration.setAllowedMethods(ALLOWED_HTTP_METHODS);
                configuration.setAllowedHeaders(ALLOWED_HEADERS);
                configuration.setExposedHeaders(EXPOSED_HEADERS);
                configuration.setMaxAge((long) (24 * 60 * 60));
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
