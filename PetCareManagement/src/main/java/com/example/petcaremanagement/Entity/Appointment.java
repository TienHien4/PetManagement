package com.example.petcaremanagement.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String email;
    private Date date;
    @Builder.Default
    private String status = "PENDING"; // PENDING, CONFIRMED, COMPLETED, CANCELLED

    // Pet information fields
    private Long petId;
    private String petName;
    private String petType;
    private String petBreed;
    private String petAge;
    private String petWeight;
    private String petGender;
    private String petImageUrl;

    @ManyToMany
    private List<ServicesType> services;
    @ManyToOne
    @JoinColumn(name = "vet_id", nullable = true)
    private Vet vet;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

}
