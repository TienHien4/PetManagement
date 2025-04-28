package com.example.petcaremanagement.Dto.PetDTO;
import com.example.petcaremanagement.Dto.UserDTO.UserResponse;
import com.example.petcaremanagement.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetResponse {
    private long id;
    private String name;
    private String species;
    private String breed;
    private String gender;
    private Date dob;
    private float weight;
    private int age;
    private String imageUrl;
    private long ownerId;

}
