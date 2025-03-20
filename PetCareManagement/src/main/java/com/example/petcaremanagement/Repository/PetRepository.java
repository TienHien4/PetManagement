package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
}
