package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    @Query("SELECT m FROM MedicalRecord m WHERE m.pet.id = :petId ORDER BY m.visitDate DESC")
    List<MedicalRecord> findByPetIdOrderByVisitDateDesc(@Param("petId") Long petId);

    @Query("SELECT m FROM MedicalRecord m WHERE m.pet.owner.id = :userId ORDER BY m.visitDate DESC")
    List<MedicalRecord> findByUserIdOrderByVisitDateDesc(@Param("userId") Long userId);

    @Query("SELECT COUNT(m) FROM MedicalRecord m WHERE m.pet.id = :petId")
    Long countByPetId(@Param("petId") Long petId);
}
