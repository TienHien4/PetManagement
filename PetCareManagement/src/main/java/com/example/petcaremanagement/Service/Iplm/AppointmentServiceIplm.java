package com.example.petcaremanagement.Service.Iplm;

import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentRequest;
import com.example.petcaremanagement.Dto.AppointmentDTO.AppointmentResponse;
import com.example.petcaremanagement.Dto.EmailDTO.EmailEvent;
import com.example.petcaremanagement.Entity.*;
import com.example.petcaremanagement.Enum.EmailEventType;
import com.example.petcaremanagement.Mapper.AppointmentMapper;
import com.example.petcaremanagement.Repository.*;
import com.example.petcaremanagement.Service.AppointmentService;
import com.example.petcaremanagement.Service.EmailProducerService;
import com.example.petcaremanagement.Service.EmailService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceIplm implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final VetRepository vetRepo;
    private final ServicesTypeRepository servicesTypeRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final EmailService emailService;
    private final EmailProducerService emailProducerService;


    public AppointmentServiceIplm(
            AppointmentRepository appointmentRepository,
            AppointmentMapper appointmentMapper,
            VetRepository vetRepo,
            ServicesTypeRepository servicesTypeRepository,
            UserRepository userRepository,
            PetRepository petRepository,
            EmailService emailService,
            EmailProducerService emailProducerService) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
        this.vetRepo = vetRepo;
        this.servicesTypeRepository = servicesTypeRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.emailService = emailService;
        this.emailProducerService = emailProducerService;
    }

    @Override
    public AppointmentResponse CreateAppointment(AppointmentRequest request) {
        try {
            // Create appointment from request
            Appointment appointment = appointmentMapper.toAppointment(request);

            // Find and set vet
            Vet vet = vetRepo.findById(request.getVetId())
                    .orElseThrow(() -> new RuntimeException("Vet not found with ID: " + request.getVetId()));
            appointment.setVet(vet);

            // Find and set user
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));
            appointment.setUser(user);

            // Validate pet
            Pet pet = petRepository.findById(request.getPetId())
                    .orElseThrow(() -> new RuntimeException("Pet not found"));

            // Find and set services
            if (request.getServices() != null && !request.getServices().isEmpty()) {
                List<ServicesType> services = request.getServices().stream().map(serviceName -> {
                    ServicesType service = servicesTypeRepository.findByName(serviceName);
                    if (service == null) {
                        throw new RuntimeException("Service not found: " + serviceName);
                    }
                    return service;
                }).collect(Collectors.toList());

                appointment.setServices(services);
            }

            // Set default status if not set
            if (appointment.getStatus() == null || appointment.getStatus().isEmpty()) {
                appointment.setStatus("PENDING");
            }

            // Save appointment
            appointment = appointmentRepository.save(appointment);

            // Send notification
            emailService.sendAppointmentConfirmationDirect(appointment, user, pet);

            // Create response
            AppointmentResponse response = appointmentMapper.toAppointmentResponse(appointment);
            response.setVetId(appointment.getVet().getId());
            response.setUserId(appointment.getUser().getId());

            return response;
        } catch (Exception e) {
            throw new RuntimeException("Error creating appointment: " + e.getMessage(), e);
        }
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
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        var listAppointment = appointmentRepository.findAll(pageable);
        Page<AppointmentResponse> response = listAppointment.map(appointment -> {
            AppointmentResponse appointmentResponse = appointmentMapper.toAppointmentResponse(appointment);
            appointmentResponse.setVetId(appointment.getVet().getId());
            appointmentResponse.setUserId(appointment.getUser().getId());
            return appointmentResponse;
        });
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

    // VET Role Methods Implementation
    @Override
    public List<AppointmentResponse> getAppointmentsByVetEmail(String email) {
        System.out.println("AppointmentService - Searching appointments for email: " + email);
        List<Appointment> appointments = appointmentRepository.findByVetEmail(email);
        System.out.println("AppointmentService - Found " + appointments.size() + " appointments");
        return appointments.stream()
                .map(appointment -> {
                    AppointmentResponse response = appointmentMapper.toAppointmentResponse(appointment);
                    response.setVetId(appointment.getVet().getId());
                    response.setUserId(appointment.getUser().getId());
                    return response;
                }).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByVetUserId(Long userId) {
        System.out.println("AppointmentService - Searching appointments for user ID: " + userId);
        List<Appointment> appointments = appointmentRepository.findByVetUserId(userId);
        System.out.println("AppointmentService - Found " + appointments.size() + " appointments");
        return appointments.stream()
                .map(appointment -> {
                    AppointmentResponse response = appointmentMapper.toAppointmentResponse(appointment);
                    response.setVetId(appointment.getVet().getId());
                    response.setUserId(appointment.getUser().getId());
                    return response;
                }).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getCompletedAppointmentsByVetEmail(String email) {
        List<Appointment> appointments = appointmentRepository.findByVetEmailAndStatus(email, "COMPLETED");
        return appointments.stream()
                .map(appointment -> {
                    AppointmentResponse response = appointmentMapper.toAppointmentResponse(appointment);
                    response.setVetId(appointment.getVet().getId());
                    response.setUserId(appointment.getUser().getId());
                    return response;
                }).collect(Collectors.toList());
    }

    @Override
    public AppointmentResponse updateAppointmentStatusByVet(Long appointmentId, String status, String vetEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Verify that this appointment belongs to the vet (check via user email)
        if (!appointment.getVet().getUser().getEmail().equals(vetEmail)) {
            throw new RuntimeException("You can only update your own appointments");
        }

        appointment.setStatus(status);
        appointmentRepository.save(appointment);

        AppointmentResponse response = appointmentMapper.toAppointmentResponse(appointment);
        response.setVetId(appointment.getVet().getId());
        response.setUserId(appointment.getUser().getId());
        return response;
    }

    @Override
    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        String oldStatus = appointment.getStatus();
        appointment.setStatus(status);

        Appointment updatedAppointment = appointmentRepository.save(appointment);

        Pet pet = petRepository.findById(appointment.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        // GỬI EMAIL THÔNG BÁO THAY ĐỔI TRẠNG THÁI (TRỰC TIẾP QUA SMTP)
        try {
            emailService.sendAppointmentStatusUpdateDirect(
                    updatedAppointment,
                    appointment.getUser(),
                    pet,
                    oldStatus,
                    status
            );
        } catch (Exception e) {
            System.err.println("Failed to send status update email: " + e.getMessage());
        }

        return convertToResponse(updatedAppointment);
    }


    @Override
    public AppointmentResponse updateAppointmentStatusByVetUserId(Long appointmentId, String status, Long userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Verify that this appointment belongs to the vet (check via user ID)
        if (appointment.getVet().getUser().getId() != userId.longValue()) {
            throw new RuntimeException("You can only update your own appointments");
        }

        appointment.setStatus(status);
        appointmentRepository.save(appointment);

        AppointmentResponse response = appointmentMapper.toAppointmentResponse(appointment);
        response.setVetId(appointment.getVet().getId());
        response.setUserId(appointment.getUser().getId());
        return response;
    }

    @Override
    public long countAppointmentsByVetEmail(String email) {
        return appointmentRepository.countByVetEmail(email);
    }

    @Override
    public long countCompletedAppointmentsByVetEmail(String email) {
        return appointmentRepository.countByVetEmailAndStatus(email, "COMPLETED");
    }

    @Override
    public long countPendingAppointmentsByVetEmail(String email) {
        return appointmentRepository.countByVetEmailAndStatus(email, "PENDING");
    }

    @Override
    public long countTodayAppointmentsByVetEmail(String email) {
        return appointmentRepository.countByVetEmailAndToday(email);
    }

    @Override
    public Map<String, Object> getMonthlyStatisticsByVetEmail(String email) {
        Map<String, Object> monthlyStats = new HashMap<>();

        // Get appointments for the last 6 months
        List<Appointment> allAppointments = appointmentRepository.findByVetEmail(email);

        // Group by month
        Map<String, List<Appointment>> groupedByMonth = allAppointments.stream()
                .filter(appointment -> appointment.getDate() != null)
                .collect(Collectors.groupingBy(appointment -> {
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(appointment.getDate());
                    return String.format("%04d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1);
                }));

        List<Map<String, Object>> monthlyData = new ArrayList<>();
        Calendar cal = Calendar.getInstance();

        // Generate data for last 6 months
        for (int i = 5; i >= 0; i--) {
            cal.add(Calendar.MONTH, -i);
            String monthKey = String.format("%04d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1);
            String monthLabel = String.format("Tháng %d", cal.get(Calendar.MONTH) + 1);

            List<Appointment> monthAppointments = groupedByMonth.getOrDefault(monthKey, new ArrayList<>());
            long totalAppointments = monthAppointments.size();
            long completedAppointments = monthAppointments.stream()
                    .mapToLong(app -> "COMPLETED".equals(app.getStatus()) ? 1 : 0)
                    .sum();

            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", monthLabel);
            monthData.put("appointments", totalAppointments);
            monthData.put("completed", completedAppointments);

            monthlyData.add(monthData);
            cal = Calendar.getInstance(); // Reset calendar
        }

        monthlyStats.put("monthlyData", monthlyData);
        return monthlyStats;
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByVetEmailAndDate(String email, String dateString) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date targetDate = sdf.parse(dateString);

            List<Appointment> appointments = appointmentRepository.findByVetEmailAndDate(email, targetDate);
            return appointments.stream()
                    .map(appointment -> {
                        AppointmentResponse response = appointmentMapper.toAppointmentResponse(appointment);
                        response.setVetId(appointment.getVet().getId());
                        response.setUserId(appointment.getUser().getId());
                        return response;
                    }).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format. Use yyyy-MM-dd");
        }
    }

    private AppointmentResponse convertToResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setUserId(appointment.getUser().getId());
        response.setName(appointment.getUser().getUserName());
        response.setPetId(appointment.getPetId());
        response.setPetName(appointment.getPetName());
        response.setDate(appointment.getDate());
        response.setStatus(appointment.getStatus());
        return response;
    }

}
