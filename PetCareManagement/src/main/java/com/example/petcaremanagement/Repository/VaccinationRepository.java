package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.Vaccination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination, Long> {

    @Query("SELECT v FROM Vaccination v WHERE v.pet.id = :petId ORDER BY v.vaccinationDate DESC")
    List<Vaccination> findByPetIdOrderByVaccinationDateDesc(@Param("petId") Long petId);

    @Query("SELECT v FROM Vaccination v WHERE v.pet.owner.id = :userId ORDER BY v.vaccinationDate DESC")
    List<Vaccination> findByUserIdOrderByVaccinationDateDesc(@Param("userId") Long userId);

    @Query("SELECT v FROM Vaccination v WHERE v.nextDueDate <= :date AND v.nextDueDate >= CURRENT_DATE")
    List<Vaccination> findUpcomingVaccinations(@Param("date") Date date);

    @Query("SELECT COUNT(v) FROM Vaccination v WHERE v.pet.id = :petId")
    Long countByPetId(@Param("petId") Long petId);
}
