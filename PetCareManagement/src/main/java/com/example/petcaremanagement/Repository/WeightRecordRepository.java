package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.WeightRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeightRecordRepository extends JpaRepository<WeightRecord, Long> {

    @Query("SELECT w FROM WeightRecord w WHERE w.pet.id = :petId ORDER BY w.recordDate DESC")
    List<WeightRecord> findByPetIdOrderByRecordDateDesc(@Param("petId") Long petId);

    @Query("SELECT w FROM WeightRecord w WHERE w.pet.owner.id = :userId ORDER BY w.recordDate DESC")
    List<WeightRecord> findByUserIdOrderByRecordDateDesc(@Param("userId") Long userId);

    @Query("SELECT w FROM WeightRecord w WHERE w.pet.id = :petId ORDER BY w.recordDate DESC LIMIT 1")
    Optional<WeightRecord> findLatestByPetId(@Param("petId") Long petId);

    @Query("SELECT COUNT(w) FROM WeightRecord w WHERE w.pet.id = :petId")
    Long countByPetId(@Param("petId") Long petId);
}
