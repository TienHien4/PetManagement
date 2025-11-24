package com.example.petcaremanagement.Service;

import com.example.petcaremanagement.Entity.Appointment;
import com.example.petcaremanagement.Entity.Pet;
import com.example.petcaremanagement.Entity.User;

public interface EmailService {
    /**
     * Send appointment confirmation email to user
     * 
     * @param appointment The appointment details
     */
    void sendAppointmentConfirmation(Appointment appointment, User user, Pet pet);

    /**
     * Send appointment notification email to vet
     * 
     * @param appointment The appointment details
     */
    void sendAppointmentStatusUpdate(Appointment appointment, User user, Pet pet, String oldStatus, String newStatus);

    /**
     * Send appointment status update email
     * 
     * @param appointment The appointment details
     * @param oldStatus   The previous status
     * @param newStatus   The new status
     */
    void sendAppointmentStatusUpdate(Appointment appointment, String oldStatus, String newStatus);
    void sendAppointmentConfirmationDirect(Appointment appointment, User user, Pet pet);
    void sendAppointmentStatusUpdateDirect(Appointment appointment, User user, Pet pet,
                                      String oldStatus, String newStatus);
}
