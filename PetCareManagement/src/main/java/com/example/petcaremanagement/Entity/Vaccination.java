package com.example.petcaremanagement.Entity;

import com.example.petcaremanagement.Enum.VaccinCheck;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Vaccination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Enumerated(EnumType.STRING)
    private VaccinCheck status = VaccinCheck.PENDING;
    @ManyToOne
    @JoinColumn(name = "vac", nullable = false)
    private Vet vet;

}
