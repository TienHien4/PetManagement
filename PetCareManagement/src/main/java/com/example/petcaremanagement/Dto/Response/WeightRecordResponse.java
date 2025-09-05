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
public class WeightRecordResponse {
    private Long id;
    private Long petId;
    private String petName;
    private Double weight;
    private Date recordDate;
    private String notes;
    private Date createdAt;
}
