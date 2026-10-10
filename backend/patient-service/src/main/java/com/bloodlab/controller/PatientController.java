package com.bloodlab.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloodlab.entity.Patient;
import com.bloodlab.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
	
		private final PatientService patientService;
		
		public PatientController(PatientService patientService) {
			
			this.patientService=patientService;
			
		}
		
		
		@PostMapping
		public ResponseEntity<Patient> registerPatient(@Valid @RequestBody Patient patient){
			
			Patient savedPatient=patientService.registerPatient(patient);
			
			return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);
			
		}
		
	

}
