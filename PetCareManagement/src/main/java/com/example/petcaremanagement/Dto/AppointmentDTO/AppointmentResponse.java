package com.example.petcaremanagement.Dto.AppointmentDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponse {
    private long id;
    private String name;
    private String phoneNumber;
    private Date date;
    private String services;
    private long vetId;
}
