package com.example.petcaremanagement.Dto.PetDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetRequest {
    private long id;
    private String name;
    private String species;
    private String breed;
    private String gender;
    private Date dob;
    private float weight;
    private int age;
    private long ownerId;

}

