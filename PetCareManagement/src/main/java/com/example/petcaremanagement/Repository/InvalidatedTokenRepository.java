package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, Long> {
    Boolean existsByUUID(String uuid);
}
