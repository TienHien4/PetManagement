package com.example.petcaremanagement.Dto.UserDTO;
import com.example.petcaremanagement.Dto.PetDTO.PetResponse;
import com.example.petcaremanagement.Entity.Notification;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private List<Long> listPets;
    private List<Notification> listNotifications;
    private Set<Role> roles;
}
