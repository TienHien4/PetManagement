package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.VetDTO.VetRequest;
import com.example.petcaremanagement.Dto.VetDTO.VetResponse;
import com.example.petcaremanagement.Entity.Appointment;
import com.example.petcaremanagement.Entity.Vet;
import com.example.petcaremanagement.Mapper.VetMapper;
import com.example.petcaremanagement.Repository.AppointmentRepository;
import com.example.petcaremanagement.Repository.VetRepository;
import com.example.petcaremanagement.Service.VetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VetServiceIplm implements VetService {

    @Autowired
    private VetRepository vetRepo;
    @Autowired
    private VetMapper vetMapper;

    @Autowired
    private AppointmentRepository appointmentRepo;

    @Override
    public VetResponse CreateVet(VetRequest request) {
        Vet vet = vetMapper.toVet(request);
        List<Appointment> appointments = request.getAppointments().stream().map(
                s -> {
                    Appointment appointment = appointmentRepo.findById(s)
                            .orElseThrow(() -> new RuntimeException("Apponintment not found"));
                    return appointment;
                }
        ).toList();
        vet.setAppointments(appointments);
        return vetMapper.toVetResponse(vet);
    }

    @Override
    public VetResponse UpdateVet(long id, VetRequest request) {
        return null;
    }

    @Override
    public void DeleteVet(long id) {

    }

    @Override
    public List<VetResponse> GetAllVet() {
        return null;
    }

    @Override
    public VetResponse GetVetById(long id) {
        return null;
    }

    @Override
    public Page<VetResponse> Pagination(int pageNo, int pageSize) {
        return null;
    }
}
