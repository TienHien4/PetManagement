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
    @ManyToMany
    private List<ServicesType> services;
    @ManyToOne
    @JoinColumn(name = "vet", nullable = true)
    private Vet vet;
    @ManyToOne
    @JoinColumn(name = "user", nullable = true)
    private User user;

}
