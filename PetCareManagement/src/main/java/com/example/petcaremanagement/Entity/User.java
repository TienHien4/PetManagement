package com.example.petcaremanagement.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String userName;
    private String email;
    @Column(nullable = true)
    private String password;
    private Date dob;
    private String provider;
    private String gender;
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Pet> listPets;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Appointment> appointments;
    @ManyToMany
    private Set<Role> roles;
    @OneToOne(mappedBy = "user")
    private ShoppingCart shoppingCart;
    @OneToOne(mappedBy = "user")
    private Vet vet;

}
