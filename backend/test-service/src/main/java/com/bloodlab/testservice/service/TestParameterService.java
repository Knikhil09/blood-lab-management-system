package com.bloodlab.testservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bloodlab.testservice.entity.LabTest;
import com.bloodlab.testservice.entity.TestParameter;
import com.bloodlab.testservice.repository.LabTestRepository;
import com.bloodlab.testservice.repository.TestParameterRepository;


@Service
public class TestParameterService {
	
	
	private final TestParameterRepository parameterRepository;
	private final LabTestRepository labTestRepository;
	
	
	public TestParameterService(TestParameterRepository parameterRepository, LabTestRepository labTestRepository) {
	
		this.parameterRepository = parameterRepository;
		this.labTestRepository = labTestRepository;
	}
	
	
	
	public TestParameter addParameter(Long labTestId,TestParameter parameter) {
		
		LabTest labTest=labTestRepository.findById(labTestId)
						.orElseThrow(()-> new IllegalArgumentException("Lab Test not found with id: "+labTestId));
		
		
		parameter.setLabTest(labTest);
		
		return parameterRepository.save(parameter);
	}
	
	
	
	public List<TestParameter> getParametersByTestId(Long labTestId){
		
		if(!labTestRepository.existsById(labTestId)) {
			
			throw new IllegalArgumentException("Lab Test not found with id: "+labTestId);
			
		}
		
		return parameterRepository.findByLabTestIdOrderByDisplayOrderAsc(labTestId);
	}
	
	
	
	public TestParameter getParameterById(Long parameterId) {
        return parameterRepository.findById(parameterId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Parameter not found with ID: " + parameterId));
    }

	
	
	
	public TestParameter updateParameter(Long parameterId,
            TestParameter updatedParameter) {

			TestParameter existing = getParameterById(parameterId);

			existing.setParameterName(updatedParameter.getParameterName());
			existing.setUnit(updatedParameter.getUnit());
			existing.setNormalRangeMin(updatedParameter.getNormalRangeMin());
			existing.setNormalRangeMax(updatedParameter.getNormalRangeMax());
			existing.setNormalRangeText(updatedParameter.getNormalRangeText());
			existing.setDisplayOrder(updatedParameter.getDisplayOrder());
			existing.setActive(updatedParameter.getActive());

			return parameterRepository.save(existing);
}
	
	
	

}
