package com.bloodlab.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bloodlab.entity.Patient;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
	 
	Optional<Patient> findByPatientCode(String patientCode);
	
	List<Patient> findByNameContainingIgnoreCase(String name);
		
	List<Patient> findByMobile(String mobile);
	
	boolean existsByPatientCode(String patientCode);
}
