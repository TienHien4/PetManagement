package com.example.petcaremanagement.Dto.AppointmentDTO;

import com.example.petcaremanagement.Entity.ServicesType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponse {
    private long id;
    private String name;
    private String email;
    private Date date;
    private String status;
    private List<ServicesType> services;
    private long vetId;
    private long userId;

    // Pet information fields
    private Long petId;
    private String petName;
    private String petType;
    private String petBreed;
    private String petAge;
    private String petWeight;
    private String petGender;
    private String petImageUrl;
}
