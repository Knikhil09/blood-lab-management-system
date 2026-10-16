
package com.bloodlab.reportservice.service;

import com.bloodlab.reportservice.client.PatientClient;
import com.bloodlab.reportservice.entity.LabReport;
import com.bloodlab.reportservice.entity.ReportStatus;
import com.bloodlab.reportservice.exception.PatientNotFoundException;
import com.bloodlab.reportservice.exception.ResourceNotFoundException;
import com.bloodlab.reportservice.repository.LabReportRepository;

import feign.FeignException;

import org.springframework.stereotype.Service;


import java.util.List;
import java.util.UUID;

@Service
public class LabReportService {

    private final LabReportRepository labReportRepository;
    private final PatientClient patientClient;
   

    public LabReportService(LabReportRepository labReportRepository,PatientClient patientClient) {
        this.labReportRepository = labReportRepository;
		this.patientClient = patientClient;
    }

    public LabReport createReport(Long patientId) {
    	
    	patientClient.getPatientById(patientId);
        LabReport report = new LabReport();

        report.setPatientId(patientId);
        report.setReportNumber("RPT-" + UUID.randomUUID()
                .toString().substring(0, 8).toUpperCase());
        report.setStatus(ReportStatus.PENDING);
        

        return labReportRepository.save(report);
    }

    public List<LabReport> getAllReports() {
        return labReportRepository.findAll();
    }

    public LabReport getReportById(Long reportId) {
        return labReportRepository.findById(reportId)
        		.orElseThrow(() ->
                new ResourceNotFoundException(
                        "Report not found with ID: " + reportId));
    }

    public LabReport getReportByNumber(String reportNumber) {
        return labReportRepository.findByReportNumber(reportNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Report not found: " + reportNumber));
    }

    public List<LabReport> getReportsByPatient(Long patientId) {
    	try {
    		patientClient.getPatientById(patientId);
    	}catch(FeignException.NotFound ex) {
    		throw new PatientNotFoundException("Patient not found with id: "+patientId);
    	}
    	
        return labReportRepository
               .findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public LabReport updateStatus(Long reportId, ReportStatus status) {
        LabReport report = getReportById(reportId);
        report.setStatus(status);
        return labReportRepository.save(report);
    }
}
