package com.example.petcaremanagement.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "vaccination")
public class Vaccination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vaccine_name")
    private String vaccineName;

    @Column(name = "vaccination_date")
    @Temporal(TemporalType.DATE)
    private Date vaccinationDate;

    @Column(name = "next_due_date")
    @Temporal(TemporalType.DATE)
    private Date nextDueDate;

    @Column(name = "veterinarian")
    private String veterinarian;

    @Column(name = "clinic")
    private String clinic;

    @Column(name = "batch_number")
    private String batchNumber;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;
}