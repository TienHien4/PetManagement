package com.example.petcaremanagement.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordResponse {
    private Long id;
    private Long petId;
    private String petName;
    private Date recordDate;
    private String diagnosis;
    private String treatment;
    private String veterinarian;
    private String clinic;
    private String symptoms;
    private String notes;
    private Date createdAt;
}
