package com.example.petcaremanagement.Dto.LoginDTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FacebookUserInfo {
    private String id;
    private String name;
    private String email;
}
