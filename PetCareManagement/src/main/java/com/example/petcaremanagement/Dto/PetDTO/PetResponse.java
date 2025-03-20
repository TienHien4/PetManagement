package com.example.petcaremanagement.Dto.PetDTO;
import com.example.petcaremanagement.Dto.UserDTO.UserResponse;
import com.example.petcaremanagement.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetResponse {
    private String name;
    private String species;
    private String breed;
    private int age;
    private long ownerId;
}
