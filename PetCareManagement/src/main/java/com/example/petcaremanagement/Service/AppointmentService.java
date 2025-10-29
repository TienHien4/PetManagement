package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentRequest;
import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface AppointmentService {
    AppointmentResponse CreateAppointment(AppointmentRequest request);

    void DeleteAppointment(long id);

    AppointmentResponse UpdateAppointment(AppointmentRequest request);

    List<AppointmentResponse> listAppointments();

    Page<AppointmentResponse> pageAppointment(int pageNo, int pageSize);

    List<AppointmentResponse> ListAppointmentsOfUser(long userId);

    // Methods for VET role
    List<AppointmentResponse> getAppointmentsByVetEmail(String email);

    List<AppointmentResponse> getAppointmentsByVetUserId(Long userId);

    List<AppointmentResponse> getCompletedAppointmentsByVetEmail(String email);

    AppointmentResponse updateAppointmentStatusByVet(Long appointmentId, String status, String vetEmail);

    AppointmentResponse updateAppointmentStatusByVetUserId(Long appointmentId, String status, Long userId);

    long countAppointmentsByVetEmail(String email);

    long countCompletedAppointmentsByVetEmail(String email);

    long countPendingAppointmentsByVetEmail(String email);

    long countTodayAppointmentsByVetEmail(String email);

    Map<String, Object> getMonthlyStatisticsByVetEmail(String email);

    List<AppointmentResponse> getAppointmentsByVetEmailAndDate(String email, String date);
}
