package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Entity.ServicesType;
import com.example.petcaremanagement.Repository.ServicesTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:3000")
public class ServicesTypeController {

    @Autowired
    private ServicesTypeRepository servicesTypeRepository;

    @GetMapping("/all")
    public ResponseEntity<List<ServicesType>> getAllServices() {
        List<ServicesType> services = servicesTypeRepository.findAll();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicesType> getServiceById(@PathVariable Long id) {
        return servicesTypeRepository.findById(id)
                .map(service -> ResponseEntity.ok(service))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<ServicesType> getServiceByName(@RequestParam String name) {
        ServicesType service = servicesTypeRepository.findByName(name);
        if (service != null) {
            return ResponseEntity.ok(service);
        }
        return ResponseEntity.notFound().build();
    }
}
