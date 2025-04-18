package com.example.petcaremanagement.Dto.UserDTO;
import com.example.petcaremanagement.Dto.PetDTO.PetResponse;
import com.example.petcaremanagement.Entity.Notification;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Set;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private long id;
    private String userName;
    private String email;
    private String password;
    private String gender;
    private Date dob;
    private List<Long> listPets;
    private Set<Role> roles;
}
