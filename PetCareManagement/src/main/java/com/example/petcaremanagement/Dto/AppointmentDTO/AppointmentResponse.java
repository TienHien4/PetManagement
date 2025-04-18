package com.example.petcaremanagement.Dto.AppointmentDTO;

import com.example.petcaremanagement.Entity.Vet;
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
    private List<String> services;
    private long vetId;
}
