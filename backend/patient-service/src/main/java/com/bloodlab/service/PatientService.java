package com.bloodlab.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bloodlab.entity.Patient;
import com.bloodlab.exception.PatientAlreadyExistsException;
import com.bloodlab.exception.PatientNotFoundException;
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
		
		if (patientRepository.existsByPatientCode(patient.getPatientCode())) {
		    
			throw new PatientAlreadyExistsException(
		            "Patient already exists with code: "
		                    + patient.getPatientCode());
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
	
	public Patient searchPatientById(Long id){
		
		return patientRepository.findById(id)
								.orElseThrow(()->new PatientNotFoundException("Patient not found:"+id));
		
		
	}
	
	public List<Patient> getAllPatients(){
		
		return patientRepository.findAll();
		
	}
	
	public Patient getPatientByCode(String patientCode){
		
		return patientRepository.findByPatientCode(patientCode)
								.orElseThrow(()-> new PatientNotFoundException("Patient not found with code"+ patientCode));
		
	}
	
	public List<Patient> searchPatientByName(String name){
		
		return patientRepository.findByNameContainingIgnoreCase(name);
		
		
	}
	
	public List<Patient> searchPatientByMobile(String mobile){
		
		return patientRepository.findByMobile(mobile);
	}

	@Transactional
	public Patient updatePatient(Long id, Patient updatedPatient) {
		// TODO Auto-generated method stub
		Patient existingPatient=patientRepository.findById(id)
												 .orElseThrow(()->new PatientNotFoundException("Patient not found with id for updation:"+id));
		
		existingPatient.setName(updatedPatient.getName());
		existingPatient.setAge(updatedPatient.getAge());
		existingPatient.setGender(updatedPatient.getGender());
		existingPatient.setMobile(updatedPatient.getMobile());
		
		return patientRepository.save(existingPatient);
		
	}
	

}
