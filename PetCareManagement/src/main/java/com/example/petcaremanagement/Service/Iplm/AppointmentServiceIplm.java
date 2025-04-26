package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentRequest;
import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentResponse;
import com.example.petcaremanagement.Entity.Appointment;
import com.example.petcaremanagement.Entity.ServicesType;
import com.example.petcaremanagement.Entity.User;
import com.example.petcaremanagement.Entity.Vet;
import com.example.petcaremanagement.Mapper.AppointmentMapper;
import com.example.petcaremanagement.Repository.AppointmentRepository;
import com.example.petcaremanagement.Repository.ServicesTypeRepository;
import com.example.petcaremanagement.Repository.UserRepository;
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
    @Autowired
    private ServicesTypeRepository servicesTypeRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public AppointmentResponse CreateAppointment(AppointmentRequest request) {
        Appointment appointment = appointmentMapper.toAppointment(request);
        Vet vet = vetRepo.findById(request.getVetId()).orElseThrow(() -> new RuntimeException("Vet not found"));
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        appointment.setVet(vet);
        appointment.setUser(user);
        List<ServicesType> services = request.getServices().stream().map(s -> {
                ServicesType service = servicesTypeRepository.findByName(s);
                return service;
        }).toList();
        appointment.setServices(services);
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
        var listAppointment = appointmentRepository.findAll(pageable);
        Page<AppointmentResponse> response = listAppointment.map(appointment -> {
                 AppointmentResponse appointmentResponse = appointmentMapper.toAppointmentResponse(appointment);
                 appointmentResponse.setVetId(appointment.getVet().getId());
                 appointmentResponse.setUserId(appointment.getUser().getId());
                 return appointmentResponse;
        }
        );
        return response;

    }

    @Override
    public List<AppointmentResponse> ListAppointmentsOfUser(long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Appointment> listAppointment = appointmentRepository.findByUser(user);
        var response = listAppointment.stream()
                .map(s -> {
                    AppointmentResponse appointmentResponse = appointmentMapper.toAppointmentResponse(s);
                    appointmentResponse.setVetId(s.getVet().getId());
                    return appointmentResponse;
                }).toList();
        return response;
    }


}
