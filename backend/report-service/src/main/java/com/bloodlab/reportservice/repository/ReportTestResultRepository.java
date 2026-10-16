package com.bloodlab.reportservice.repository;

import com.bloodlab.reportservice.entity.ReportTestResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportTestResultRepository extends JpaRepository<ReportTestResult, Long> {

    List<ReportTestResult> findByLabReportReportId(Long reportId);
}
