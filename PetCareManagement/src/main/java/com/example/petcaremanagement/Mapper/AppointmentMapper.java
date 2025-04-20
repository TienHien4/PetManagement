package com.example.petcaremanagement.Mapper;

import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentRequest;
import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentResponse;
import com.example.petcaremanagement.Entity.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    @Mapping(target = "vet", ignore = true)
    @Mapping(target = "services", ignore = true)
    Appointment toAppointment(AppointmentRequest request);

    @Mapping(target = "vetId", ignore = true)
    AppointmentResponse toAppointmentResponse(Appointment appointment);
}
