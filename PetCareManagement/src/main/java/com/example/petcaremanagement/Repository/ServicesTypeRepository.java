package com.example.petcaremanagement.Repository;

import com.example.petcaremanagement.Entity.ServicesType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicesTypeRepository extends JpaRepository<ServicesType, Long> {
    ServicesType findByName(String name);
}
