package com.example.petcaremanagement.Controller;

import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentResponse;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Service.AppointmentService;
import com.example.petcaremanagement.Service.VetService;
import com.example.petcaremanagement.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/vet-dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class VetAppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private VetService vetService;

    @Autowired
    private UserService userService;

    /**
     * Helper method để lấy User từ authentication (có thể là username hoặc email)
     */
    private User getUserFromAuthentication(Authentication authentication) {
        String identifier = authentication.getName();
        System.out.println("Authentication identifier: " + identifier);

        try {
            // Thử tìm theo username trước
            return userService.getUserByUsername(identifier);
        } catch (RuntimeException e) {
            try {
                // Nếu không tìm thấy theo username, thử theo email
                return userService.getUserByEmail(identifier);
            } catch (RuntimeException e2) {
                throw new RuntimeException("User not found with identifier: " + identifier);
            }
        }
    }

    /**
     * Lấy tất cả appointments của vet hiện tại
     */
    @GetMapping("/appointments")
    @PreAuthorize("hasRole('VET')")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        System.out.println("VET Dashboard - User ID: " + user.getId() + ", Username: " + user.getUserName());

        var result = appointmentService.getAppointmentsByVetUserId(user.getId());
        System.out.println("VET Dashboard - Appointments found: " + result.size());
        return ResponseEntity.ok().body(result);
    }

    /**
     * Lấy appointments đã hoàn thành của vet hiện tại
     */
    @GetMapping("/appointments/completed")
    @PreAuthorize("hasRole('VET')")
    public ResponseEntity<List<AppointmentResponse>> getMyCompletedAppointments(Authentication authentication) {
        String email = authentication.getName();
        var result = appointmentService.getCompletedAppointmentsByVetEmail(email);
        return ResponseEntity.ok().body(result);
    }

    /**
     * Cập nhật trạng thái appointment
     */
    @PutMapping("/appointments/{appointmentId}/status")
    @PreAuthorize("hasRole('VET')")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestParam String status,
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        var result = appointmentService.updateAppointmentStatusByVetUserId(appointmentId, status, user.getId());
        return ResponseEntity.ok().body(result);
    }

    /**
     * Thống kê appointments của vet
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('VET')")
    public ResponseEntity<Map<String, Object>> getAppointmentStatistics(Authentication authentication) {
        String email = authentication.getName();

        Map<String, Object> statistics = new HashMap<>();

        // Tổng số appointments
        long totalAppointments = appointmentService.countAppointmentsByVetEmail(email);
        statistics.put("totalAppointments", totalAppointments);

        // Appointments đã hoàn thành
        long completedAppointments = appointmentService.countCompletedAppointmentsByVetEmail(email);
        statistics.put("completedAppointments", completedAppointments);

        // Appointments đang chờ
        long pendingAppointments = appointmentService.countPendingAppointmentsByVetEmail(email);
        statistics.put("pendingAppointments", pendingAppointments);

        // Appointments hôm nay
        long todayAppointments = appointmentService.countTodayAppointmentsByVetEmail(email);
        statistics.put("todayAppointments", todayAppointments);

        // Thống kê theo tháng (6 tháng gần nhất)
        var monthlyStats = appointmentService.getMonthlyStatisticsByVetEmail(email);
        statistics.put("monthlyStatistics", monthlyStats.get("monthlyData"));

        return ResponseEntity.ok().body(statistics);
    }

    /**
     * Lấy appointments theo ngày
     */
    @GetMapping("/appointments/by-date")
    @PreAuthorize("hasRole('VET')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDate(
            @RequestParam String date,
            Authentication authentication) {
        String email = authentication.getName();
        var result = appointmentService.getAppointmentsByVetEmailAndDate(email, date);
        return ResponseEntity.ok().body(result);
    }

    /**
     * Lấy thông tin profile của vet
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('VET')")
    public ResponseEntity<Object> getVetProfile(Authentication authentication) {
        String email = authentication.getName();
        var result = vetService.getVetByEmail(email);
        return ResponseEntity.ok().body(result);
    }
}