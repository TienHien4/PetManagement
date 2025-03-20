package com.example.petcaremanagement.Entity;

import jakarta.persistence.*;
import lombok.*;

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
    private int age;
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;


}
