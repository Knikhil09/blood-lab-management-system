package com.bloodlab.reportservice.controller;

import com.bloodlab.reportservice.entity.ReportTestResult;
import com.bloodlab.reportservice.service.ReportTestResultService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/{reportId}/results")
public class ReportTestResultController {

    private final ReportTestResultService resultService;

    public ReportTestResultController(
            ReportTestResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping
    public ResponseEntity<ReportTestResult> addResult(
            @PathVariable Long reportId,
            @RequestBody ReportTestResult result) {

        ReportTestResult saved =
                resultService.addResult(reportId, result);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<ReportTestResult>> getResults(
            @PathVariable Long reportId) {

        return ResponseEntity.ok(
                resultService.getResultsByReport(reportId));
    }
}
