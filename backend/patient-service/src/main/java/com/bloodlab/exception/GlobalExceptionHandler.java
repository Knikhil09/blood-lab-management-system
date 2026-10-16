package com.bloodlab.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	private Map<String,Object> createErrorResponse(HttpStatus status, String message, String path){
		
		Map<String, Object> response =new LinkedHashMap<>();
		
		response.put("timestamp", LocalDateTime.now());
		response.put("Status", status.value());
		response.put("error", status.getReasonPhrase());
		response.put("message",message);
		response.put("Path", path);
		
		
		return response;
		
	}
	
	@ExceptionHandler(PatientNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handlePatientNotFound(PatientNotFoundException ex, HttpServletRequest request){
		
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
							 .body(createErrorResponse(HttpStatus.NOT_FOUND,ex.getMessage(),request.getRequestURI()));
		
	}
	
	
	
	

}
