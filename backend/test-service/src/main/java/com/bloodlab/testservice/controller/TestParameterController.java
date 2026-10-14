package com.bloodlab.testservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloodlab.testservice.entity.TestParameter;
import com.bloodlab.testservice.service.TestParameterService;

@RestController
@RequestMapping("/api/tests/{labTestId}/parameters")
public class TestParameterController {
	
	private final TestParameterService parameterService;

    public TestParameterController(TestParameterService parameterService) {
        this.parameterService = parameterService;
    }

    @PostMapping
    public ResponseEntity<TestParameter> addParameter(
            @PathVariable Long labTestId,
            @RequestBody TestParameter parameter) {

        TestParameter saved =
                parameterService.addParameter(labTestId, parameter);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<TestParameter>> getParameters(
            @PathVariable Long labTestId) {

        return ResponseEntity.ok(
                parameterService.getParametersByTestId(labTestId));
    }

    @PutMapping("/{parameterId}")
    public ResponseEntity<TestParameter> updateParameter(
            @PathVariable Long labTestId,
            @PathVariable Long parameterId,
            @RequestBody TestParameter parameter) {

        return ResponseEntity.ok(
                parameterService.updateParameter(parameterId, parameter));
    }
}
	

