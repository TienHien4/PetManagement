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
public class VaccinationResponse {
    private Long id;
    private Long petId;
    private String petName;
    private String vaccineName;
    private Date vaccinationDate;
    private Date nextDueDate;
    private String veterinarian;
    private String clinic;
    private String batchNumber;
    private String notes;
    private Date createdAt;
}
