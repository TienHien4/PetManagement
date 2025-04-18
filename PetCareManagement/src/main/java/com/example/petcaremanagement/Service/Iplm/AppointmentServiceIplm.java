package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentRequest;
import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentResponse;
import com.example.petcaremanagement.Entity.Appointment;
import com.example.petcaremanagement.Entity.Vet;
import com.example.petcaremanagement.Mapper.AppointmentMapper;
import com.example.petcaremanagement.Repository.AppointmentRepository;
import com.example.petcaremanagement.Repository.VetRepository;
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
    @Autowired
    private VetRepository vetRepo;

    @Override
    public AppointmentResponse CreateAppointment(AppointmentRequest request) {
        Appointment appointment = appointmentMapper.toAppointment(request);
        Vet vet = vetRepo.findById(request.getVetId()).orElseThrow(() -> new RuntimeException("Vet not found"));
        appointment.setVet(vet);
        appointmentRepository.save(appointment);
        var reponse = appointmentMapper.toAppointmentResponse(appointment);
        reponse.setVetId(request.getVetId());
        return reponse;
    }

    @Override
    public void DeleteAppointment(long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointmentRepository.delete(appointment);
    }

    @Override
    public AppointmentResponse UpdateAppointment(AppointmentRequest request) {
        return null;
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
