package com.bloodlab.testservice.controller;

import com.bloodlab.testservice.entity.LabTest;
import com.bloodlab.testservice.service.LabTestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
public class LabTestController {

    private final LabTestService labTestService;

    public LabTestController(LabTestService labTestService) {
        this.labTestService = labTestService;
    }

    @PostMapping
    public ResponseEntity<LabTest> createTest(@RequestBody LabTest labTest) {
        LabTest savedTest = labTestService.createTest(labTest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTest);
    }

    @GetMapping
    public ResponseEntity<List<LabTest>> getAllTests() {
        return ResponseEntity.ok(labTestService.getAllTests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabTest> getTestById(@PathVariable Long id) {
        return ResponseEntity.ok(labTestService.getTestById(id));
    }

    @GetMapping("/code/{testCode}")
    public ResponseEntity<LabTest> getTestByCode(
            @PathVariable String testCode) {
        return ResponseEntity.ok(labTestService.getTestByCode(testCode));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabTest> updateTest(
            @PathVariable Long id,
            @RequestBody LabTest labTest) {
        return ResponseEntity.ok(labTestService.updateTest(id, labTest));
    }
}
