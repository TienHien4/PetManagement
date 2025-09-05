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
public class VaccinationRequest {
    private Long petId;
    private String vaccineName;
    private Date vaccinationDate;
    private Date nextDueDate;
    private String veterinarian;
    private String clinic;
    private String batchNumber;
    private String notes;
}
