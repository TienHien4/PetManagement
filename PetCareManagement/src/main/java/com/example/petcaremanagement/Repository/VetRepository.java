package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.Vet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VetRepository extends JpaRepository<Vet, Long> {
    Optional<Vet> findByEmail(String email);

    @Query("SELECT v FROM Vet v WHERE v.user.email = :email")
    Optional<Vet> findByUserEmail(@Param("email") String email);
}
