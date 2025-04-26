package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.Appointment;
import com.example.petcaremanagement.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUser(User user);
}
