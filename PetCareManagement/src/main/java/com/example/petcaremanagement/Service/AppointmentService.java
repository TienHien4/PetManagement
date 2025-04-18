package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentRequest;
import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AppointmentService {
    AppointmentResponse CreateAppointment(AppointmentRequest request);
    void DeleteAppointment(long id);
    AppointmentResponse UpdateAppointment(AppointmentRequest request);
    List<AppointmentResponse> listAppointments();
    Page<AppointmentResponse> pageAppointment(int pageNo, int pageSize);
}
