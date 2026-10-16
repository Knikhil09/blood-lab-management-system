package com.bloodlab.reportservice.service;

import com.bloodlab.reportservice.entity.LabReport;
import com.bloodlab.reportservice.entity.ReportTestResult;
import com.bloodlab.reportservice.repository.LabReportRepository;
import com.bloodlab.reportservice.repository.ReportTestResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReportTestResultService {

    private final LabReportRepository labReportRepository;
    private final ReportTestResultRepository resultRepository;

    public ReportTestResultService(
            LabReportRepository labReportRepository,
            ReportTestResultRepository resultRepository) {
        this.labReportRepository = labReportRepository;
        this.resultRepository = resultRepository;
    }

    @Transactional
    public ReportTestResult addResult(
            Long reportId, ReportTestResult result) {

        LabReport report = labReportRepository.findById(reportId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Report not found with ID: " + reportId));

        result.setLabReport(report);

        return resultRepository.save(result);
    }

    public List<ReportTestResult> getResultsByReport(Long reportId) {
        if (!labReportRepository.existsById(reportId)) {
            throw new IllegalArgumentException(
                    "Report not found with ID: " + reportId);
        }

        return resultRepository.findByLabReportReportId(reportId);
    }
}
