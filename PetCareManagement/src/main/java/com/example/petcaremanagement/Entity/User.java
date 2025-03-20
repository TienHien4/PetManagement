package com.example.petcaremanagement.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    private String password;
    private String provider;
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Pet> listPets;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @Column(nullable = true)
    private List<Notification> listNotifications;
    @ManyToMany
    private Set<Role> roles;


}
