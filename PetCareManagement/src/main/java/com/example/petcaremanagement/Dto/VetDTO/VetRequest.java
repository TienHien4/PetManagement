package com.example.petcaremanagement.Dto.VetDTO;

import com.example.petcaremanagement.Entity.Appointment;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetRequest {
    private long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String clinicAddress;
    private String specialty;
    private List<Long> appointments;
}
