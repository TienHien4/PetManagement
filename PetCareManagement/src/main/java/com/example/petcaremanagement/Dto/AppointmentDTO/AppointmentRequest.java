package com.example.petcaremanagement.Dto.AppointmentDTO;

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
public class AppointmentRequest {
    private long id;
    private String name;
    private String email;
    private Date date;
    private List<String> services;
    private long vetId;
}
