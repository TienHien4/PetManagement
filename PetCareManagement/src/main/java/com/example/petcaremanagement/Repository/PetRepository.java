package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    @Query("SELECT pet FROM Pet pet WHERE pet.species LIKE CONCAT('%', ?1, '%')" +
            " OR pet.name LIKE CONCAT('%', ?1, '%')" +
            " OR pet.breed LIKE CONCAT('%', ?1, '%')")
    List<Pet> searchSP(String keyword);
    List<Pet> findPetsBySpecies(String species);
}
