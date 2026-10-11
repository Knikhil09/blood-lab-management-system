package com.bloodlab.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
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
	
	@ExceptionHandler(PatientAlreadyExistsException.class)
	public ResponseEntity<Map<String,Object>> handlePatientAleadyExists(PatientAlreadyExistsException ex, HttpServletRequest request){
		
		return ResponseEntity.status(HttpStatus.CONFLICT)
							 .body(createErrorResponse(HttpStatus.CONFLICT,ex.getMessage(),request.getRequestURI()));
		
	}
	
	
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request){
		
		String message=ex.getBindingResult()
				         .getFieldErrors()
				         .stream()
				         .map(FieldError::getDefaultMessage)
				         .collect(Collectors.joining(", "));
		
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
							 .body(createErrorResponse(HttpStatus.BAD_REQUEST,message,request.getRequestURI()));
		
	}
	
	
	@ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(
            Exception ex,
            HttpServletRequest request) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "An unexpected error occurred",
                        request.getRequestURI()));
    }
	
	
	

}
