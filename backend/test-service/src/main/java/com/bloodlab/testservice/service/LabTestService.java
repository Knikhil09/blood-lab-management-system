
package com.bloodlab.testservice.service;

import com.bloodlab.testservice.entity.LabTest;
import com.bloodlab.testservice.repository.LabTestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LabTestService {

    private final LabTestRepository labTestRepository;

    public LabTestService(LabTestRepository labTestRepository) {
        this.labTestRepository = labTestRepository;
    }

    public LabTest createTest(LabTest labTest) {
        if (labTestRepository.existsByTestCode(labTest.getTestCode())) {
            throw new IllegalArgumentException(
                    "Test code already exists: " + labTest.getTestCode()
            );
        }

        return labTestRepository.save(labTest);
    }

    public List<LabTest> getAllTests() {
        return labTestRepository.findAll();
    }

    public LabTest getTestById(Long id) {
        return labTestRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Lab test not found with ID: " + id
                        ));
    }

    public LabTest getTestByCode(String testCode) {
        return labTestRepository.findByTestCode(testCode)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Lab test not found with code: " + testCode
                        ));
    }

    public LabTest updateTest(Long id, LabTest updatedTest) {
        LabTest existingTest = getTestById(id);

        if (!existingTest.getTestCode().equals(updatedTest.getTestCode())
                && labTestRepository.existsByTestCode(updatedTest.getTestCode())) {
            throw new IllegalArgumentException(
                    "Test code already exists: " + updatedTest.getTestCode()
            );
        }

        existingTest.setTestCode(updatedTest.getTestCode());
        existingTest.setTestName(updatedTest.getTestName());
        existingTest.setCategory(updatedTest.getCategory());
        existingTest.setDescription(updatedTest.getDescription());
        existingTest.setActive(updatedTest.getActive());

        return labTestRepository.save(existingTest);
    }
}
