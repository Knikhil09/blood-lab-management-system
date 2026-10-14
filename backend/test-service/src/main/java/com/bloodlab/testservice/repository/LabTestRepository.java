package com.bloodlab.testservice.repository;

import com.bloodlab.testservice.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LabTestRepository extends JpaRepository<LabTest, Long> {

    Optional<LabTest> findByTestCode(String testCode);

    boolean existsByTestCode(String testCode);
}