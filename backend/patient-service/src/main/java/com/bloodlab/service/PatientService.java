package com.bloodlab.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bloodlab.entity.Patient;
import com.bloodlab.repository.PatientRepository;



@Service
public class PatientService {
	
	private final PatientRepository patientRepository;
	
	
	public PatientService(PatientRepository patientRepository) {
		
		this.patientRepository=patientRepository;
		
	}
	
	@Transactional
	public Patient registerPatient(Patient patient) {
		
		if(patient.getPatientCode()==null || patient.getPatientCode().isBlank()) {
			
			patient.setPatientCode(generatePatientCode());
			
		}
		
		return patientRepository.save(patient);
		
	}
	
	private String generatePatientCode() {
		
		String patientCode;
		
		do {
			
			patientCode= "PAT-" + java.util.UUID.randomUUID()
							.toString()
							.substring(0,8)
							.toUpperCase();
		} while(patientRepository.existsByPatientCode(patientCode));
			
		return patientCode;
		
		
	}
	
	public List<Patient> getAllPatients(){
		
		return patientRepository.findAll();
		
	}
	
	public Optional<Patient> getPatientByCode(String patientCode){
		
		return patientRepository.findByPatientCode(patientCode);
		
	}
	
	public List<Patient> searchPatientByName(String name){
		
		return patientRepository.findByNameContainingIgnoreCase(name);
		
		
	}
	
	public List<Patient> searchPatientByMobile(String mobile){
		
		return patientRepository.findByMobile(mobile);
	}
	

}
