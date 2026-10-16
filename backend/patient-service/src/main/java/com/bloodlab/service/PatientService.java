
package com.bloodlab.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bloodlab.entity.Patient;
import com.bloodlab.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // 1. Register patient
    @Transactional
    public Patient registerPatient(Patient patient) {

        if (patient.getPatientCode() == null
                || patient.getPatientCode().isBlank()) {
            patient.setPatientCode(generatePatientCode());
        }

        if (patient.getRegistrationDate() == null) {
            patient.setRegistrationDate(LocalDate.now());
        }

        if (patient.getCreatedAt() == null) {
            patient.setCreatedAt(LocalDateTime.now());
        }

        return patientRepository.save(patient);
    }

    // Generate unique patient code
    private String generatePatientCode() {
        String patientCode;

        do {
            patientCode = "PAT-" + java.util.UUID.randomUUID()
                    .toString()
                    .substring(0, 8)
                    .toUpperCase();
        } while (patientRepository.existsByPatientCode(patientCode));

        return patientCode;
    }

    // 2. Get all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // 3. Get patient by ID
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found with ID: " + id));
    }

    // 4. Get patient by patient code
    public Patient getPatientByCode(String patientCode) {
        return patientRepository.findByPatientCode(patientCode)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found with code: " + patientCode));
    }

    // 5. Search patients by name
    public List<Patient> searchPatientsByName(String name) {
        return patientRepository.findByNameContainingIgnoreCase(name);
    }

    // 6. Search patients by mobile
    public List<Patient> searchPatientsByMobile(String mobile) {
        return patientRepository.findByMobile(mobile);
    }

    // 7. Update patient
    @Transactional
    public Patient updatePatient(Long id, Patient updatedPatient) {
        Patient existingPatient = getPatientById(id);

        existingPatient.setName(updatedPatient.getName());
        existingPatient.setAge(updatedPatient.getAge());
        existingPatient.setGender(updatedPatient.getGender());
        existingPatient.setMobile(updatedPatient.getMobile());

        return patientRepository.save(existingPatient);
    }

    // 8. Delete patient
    @Transactional
    public void deletePatient(Long id) {
        Patient patient = getPatientById(id);
        patientRepository.delete(patient);
    }
}
