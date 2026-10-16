
package com.bloodlab.reportservice.repository;

import com.bloodlab.reportservice.entity.LabReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LabReportRepository extends JpaRepository<LabReport, Long> {

    Optional<LabReport> findByReportNumber(String reportNumber);

    boolean existsByReportNumber(String reportNumber);

    List<LabReport> findByPatientIdOrderByCreatedAtDesc(Long patientId);
}
