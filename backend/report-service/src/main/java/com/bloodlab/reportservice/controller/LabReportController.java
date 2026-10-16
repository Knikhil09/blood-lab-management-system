package com.bloodlab.reportservice.controller;

import com.bloodlab.reportservice.entity.LabReport;
import com.bloodlab.reportservice.entity.ReportStatus;
import com.bloodlab.reportservice.service.LabReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class LabReportController {

    private final LabReportService labReportService;

    public LabReportController(LabReportService labReportService) {
        this.labReportService = labReportService;
    }

    @PostMapping
    public ResponseEntity<LabReport> createReport(
            @RequestParam Long patientId) {

        LabReport report = labReportService.createReport(patientId);

        return ResponseEntity.status(HttpStatus.CREATED).body(report);
    }

    @GetMapping
    public ResponseEntity<List<LabReport>> getAllReports() {
        return ResponseEntity.ok(labReportService.getAllReports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabReport> getReportById(
            @PathVariable Long id) {

        return ResponseEntity.ok(labReportService.getReportById(id));
    }

    @GetMapping("/number/{reportNumber}")
    public ResponseEntity<LabReport> getReportByNumber(
            @PathVariable String reportNumber) {

        return ResponseEntity.ok(
                labReportService.getReportByNumber(reportNumber));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<LabReport>> getReportsByPatient(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                labReportService.getReportsByPatient(patientId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<LabReport> updateStatus(
            @PathVariable Long id,
            @RequestParam ReportStatus status) {

        return ResponseEntity.ok(
                labReportService.updateStatus(id, status));
    }
}
