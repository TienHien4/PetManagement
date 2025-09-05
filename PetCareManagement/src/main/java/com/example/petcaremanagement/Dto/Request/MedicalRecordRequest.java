package com.example.petcaremanagement.Dto.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordRequest {
    private Long petId;
    private Date recordDate;
    private String diagnosis;
    private String treatment;
    private String veterinarian;
    private String clinic;
    private String symptoms;
    private String notes;
}
