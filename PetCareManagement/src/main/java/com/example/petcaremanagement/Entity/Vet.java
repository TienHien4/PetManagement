package com.example.petcaremanagement.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Vet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String clinicAddress;
    private String specialty;
    @OneToMany(mappedBy = "vet", cascade = CascadeType.ALL)
    private List<Appointment> appointments;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

}
