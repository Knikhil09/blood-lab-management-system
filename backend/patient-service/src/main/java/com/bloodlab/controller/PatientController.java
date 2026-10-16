
package com.bloodlab.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bloodlab.entity.Patient;
import com.bloodlab.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // 1. Register a new patient
    @PostMapping
    public ResponseEntity<Patient> registerPatient(
            @Valid @RequestBody Patient patient) {

        Patient savedPatient = patientService.registerPatient(patient);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedPatient);
    }

    // 2. Get all patients
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {

        return ResponseEntity.ok(
                patientService.getAllPatients());
    }

    // 3. Get patient by ID
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                patientService.getPatientById(id));
    }

    // 4. Get patient by patient code
    @GetMapping("/code/{patientCode}")
    public ResponseEntity<Patient> getPatientByCode(
            @PathVariable String patientCode) {

        return ResponseEntity.ok(
                patientService.getPatientByCode(patientCode));
    }

    // 5. Search patients by name
    @GetMapping("/search")
    public ResponseEntity<List<Patient>> searchPatientsByName(
            @RequestParam String name) {

        return ResponseEntity.ok(
                patientService.searchPatientsByName(name));
    }

    // 6. Search patient by mobile number
    @GetMapping("/mobile")
    public ResponseEntity<List<Patient>> getPatientByMobile(
            @RequestParam String mobile) {

        return ResponseEntity.ok(
                patientService.searchPatientsByMobile(mobile));
    }

    // 7. Update patient details
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody Patient patient) {

        return ResponseEntity.ok(
                patientService.updatePatient(id, patient));
    }

    // 8. Delete patient
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(
            @PathVariable Long id) {

        patientService.deletePatient(id);

        return ResponseEntity.noContent().build();
    }
}
