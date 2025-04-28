package com.example.petcaremanagement.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String species;
    private String breed;
    private String gender;
    private Date dob;
    private float weight;
    private int age;
    private String image;
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;


}
