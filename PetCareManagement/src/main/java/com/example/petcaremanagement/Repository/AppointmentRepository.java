package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.Appointment;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Entity.Vet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUser(User user);

    // Methods for VET role
    List<Appointment> findByVet(Vet vet);

    List<Appointment> findByVetAndStatus(Vet vet, String status);

    @Query("SELECT a FROM Appointment a WHERE a.vet.user.email = :email")
    List<Appointment> findByVetEmail(@Param("email") String email);

    @Query("SELECT a FROM Appointment a WHERE a.vet.user.id = :userId")
    List<Appointment> findByVetUserId(@Param("userId") Long userId);

    @Query("SELECT a FROM Appointment a WHERE a.vet.user.email = :email AND a.status = :status")
    List<Appointment> findByVetEmailAndStatus(@Param("email") String email, @Param("status") String status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.vet.user.email = :email")
    long countByVetEmail(@Param("email") String email);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.vet.user.email = :email AND a.status = :status")
    long countByVetEmailAndStatus(@Param("email") String email, @Param("status") String status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.vet.user.email = :email AND DATE(a.date) = DATE(CURRENT_DATE)")
    long countByVetEmailAndToday(@Param("email") String email);

    @Query("SELECT a FROM Appointment a WHERE a.vet.user.email = :email AND DATE(a.date) = :date")
    List<Appointment> findByVetEmailAndDate(@Param("email") String email, @Param("date") Date date);
}
