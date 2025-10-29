package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentRequest;
import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentResponse;
import com.example.petcaremanagement.Service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/getAll")
    public ResponseEntity<List<AppointmentResponse>> GetAllAppointments() {
        var result = appointmentService.listAppointments();
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/createAppointment")
    public ResponseEntity<AppointmentResponse> CreateAppointment(
            @RequestBody AppointmentRequest request) {
        var result = appointmentService.CreateAppointment(request);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/getAppointments")
    public ResponseEntity<Page<AppointmentResponse>> GetAppointmentsPagination(
            @RequestParam int pageNo, @RequestParam(defaultValue = "5") int pageSize) {
        return ResponseEntity.ok().body(appointmentService.pageAppointment(pageNo, pageSize));
    }

    @GetMapping("/getAppointmentsByUser/{userId}")
    public ResponseEntity<List<AppointmentResponse>> GetAppointmentByUser(@PathVariable long userId) {
        var result = appointmentService.ListAppointmentsOfUser(userId);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/debug/vet/user/{userId}")
    public ResponseEntity<List<AppointmentResponse>> GetAppointmentsByVetUserId(@PathVariable Long userId) {
        var result = appointmentService.getAppointmentsByVetUserId(userId);
        return ResponseEntity.ok().body(result);
    }
}
