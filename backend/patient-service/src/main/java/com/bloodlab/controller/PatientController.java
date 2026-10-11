package com.bloodlab.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
		
		
		@GetMapping()
		public ResponseEntity<List<Patient>> getAllPatients(){
			
			return ResponseEntity.ok(patientService.getAllPatients());
		
			
		}
		
		@GetMapping("/{id}")
		public ResponseEntity<Patient> getPatientById(@PathVariable Long id){
			
			return ResponseEntity.ok(patientService.searchPatientById(id));
			 
		}
		
		
		@GetMapping("/code/{patientcode}")
		public ResponseEntity<Patient> getPatientByCode(@PathVariable String patientCode){
			
			return ResponseEntity.ok(patientService.getPatientByCode(patientCode));
			
		}
		
		@GetMapping("/search/{name}")
		public ResponseEntity<List<Patient>> getPatientByName(@RequestParam String name){
			
			return ResponseEntity.ok(patientService.searchPatientByName(name));
			
		}
		
		@GetMapping("/mobile/{mobile}")
		public ResponseEntity<List<Patient>> getPatientByMobile(@RequestParam String mobile){
			
			return ResponseEntity.ok(patientService.searchPatientByMobile(mobile));
			
		}
		
		
		
		@PutMapping("/{id}")
		public ResponseEntity<Patient> updatePatient(@PathVariable Long id,@Valid @RequestBody  Patient patient){
			
			Patient updatedPatient=patientService.updatePatient(id,patient);
			
			return ResponseEntity.ok(updatedPatient);
			
		}
	

}
