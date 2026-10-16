package com.bloodlab.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.PrePersist;

@Entity
@Table(name="patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
	
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id")
	private Long patientId;
	
	@Column(nullable= false , unique =true)
	private String patientCode;
	
	@NotBlank(message="Patient name is required")
	@Column(nullable=false)
	private String name;
	
	
	@NotNull(message="Age is required")
	@Min(value=0, message="Age cannot be negative")
	@Max(value=150, message="Age cannot exceed 150")
	@Column(nullable=false)
	private Integer age;
	
	
	@NotBlank(message="Gender is required")
	@Column(nullable=false)
	private String gender;
	
	
	@Pattern(
		regexp="^[0-9]{10}$",
		message = "Mobile number must contain exactly 10 digits"
			)
	private String mobile;
	
	
	@Column(nullable=false)
	private LocalDate registrationDate=LocalDate.now();
	
	private LocalDateTime createdAt=LocalDateTime.now();
	
	
	
	
	
	
	public Patient() {

	}


	public Patient(Long id, String patientCode, @NotBlank(message = "Patient name is required") String name,
			@NotNull(message = "Age is required") @Min(value = 0, message = "Age cannot be negative") @Min(value = 150, message = "Age cannot exceed 150") Integer age,
			@NotBlank(message = "Gender is required") String gender,
			@Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must contain exactly 10 digits") String mobile,
			LocalDate registrationDate, LocalDateTime createdAt) {
		
		this.patientId = id;
		this.patientCode = patientCode;
		this.name = name;
		this.age = age;
		this.gender = gender;
		this.mobile = mobile;
		this.registrationDate = registrationDate;
		this.createdAt = createdAt;
	}


	public void setPatientCode(String patientCode) {
	    this.patientCode = patientCode;
	}
	
	@PrePersist
	public void prePersist() {
		
		if(registrationDate==null) {
			registrationDate=LocalDate.now();
		}
		
		if (createdAt==null) {
			createdAt=LocalDateTime.now();
		}
	}
	
	public String getPatientCode() {
		
		return patientCode;
		
	}


	public Long getId() {
		return patientId;
	}


	public void setId(Long id) {
		this.patientId = id;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public Integer getAge() {
		return age;
	}


	public void setAge(Integer age) {
		this.age = age;
	}


	public String getGender() {
		return gender;
	}


	public void setGender(String gender) {
		this.gender = gender;
	}


	public String getMobile() {
		return mobile;
	}


	public void setMobile(String mobile) {
		this.mobile = mobile;
	}


	public LocalDate getRegistrationDate() {
		return registrationDate;
	}


	public void setRegistrationDate(LocalDate registrationDate) {
		this.registrationDate = registrationDate;
	}


	public LocalDateTime getCreatedAt() {
		return createdAt;
	}


	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
	
	
	

}
