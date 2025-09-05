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
public class WeightRecordRequest {
    private Long petId;
    private Double weight;
    private Date recordDate;
    private String notes;
}
