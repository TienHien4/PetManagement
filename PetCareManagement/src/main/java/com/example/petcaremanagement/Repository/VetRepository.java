package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.Vet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VetRepository extends JpaRepository<Vet, Long> {
}
