package com.bloodlab.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
	
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable= false , unique =true)
	private String patientCode;
	
	@NotBlank(message="Patient name is required")
	@Column(nullable=false)
	private String name;
	
	
	@NotNull(message="Age is required")
	@Min(value=0, message="Age cannot be negative")
	@Min(value=150, message="Age cannot exceed 150")
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
	
	
	
	

}
