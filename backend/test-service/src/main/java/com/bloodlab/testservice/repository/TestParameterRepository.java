package com.bloodlab.testservice.repository;

import com.bloodlab.testservice.entity.TestParameter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestParameterRepository
        extends JpaRepository<TestParameter, Long> {

    List<TestParameter> findByLabTestIdOrderByDisplayOrderAsc(Long labTestId);
}