package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentRequest;
import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentResponse;
import com.example.petcaremanagement.Entity.Appointment;
import com.example.petcaremanagement.Mapper.AppointmentMapper;
import com.example.petcaremanagement.Repository.AppointmentRepository;
import com.example.petcaremanagement.Service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentServiceIplm implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private AppointmentMapper appointmentMapper;

    @Override
    public AppointmentResponse CreateAppointment(AppointmentRequest request) {
        Appointment appointment = appointmentMapper.toAppointment(request);
        System.out.println("In");
        return appointmentMapper.toAppointmentResponse(appointmentRepository.save(appointment));
    }
    @Override
    public List<AppointmentResponse> listAppointments() {
        List<Appointment> listAppointment = appointmentRepository.findAll();
        return listAppointment.stream().map(s -> appointmentMapper.toAppointmentResponse(s)).toList();
    }
    @Override
    public Page<AppointmentResponse> pageAppointment(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo-1, pageSize);
        return appointmentRepository.findAll(pageable).map(s -> appointmentMapper.toAppointmentResponse(s));
    }
}
