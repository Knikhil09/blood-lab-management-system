package com.bloodlab.reportservice.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "report_test_results")
public class ReportTestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long  resultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reportId", nullable = false)
    private LabReport labReport;

    @Column(nullable = false)
    private Long testId;

    @Column(nullable = false)
    private String testName;

    @Column(nullable = false)
    private Long parameterId;

    @Column(nullable = false)
    private String parameterName;

    private String resultValue;

    private String unit;

    private BigDecimal referenceRangeMin;

    private BigDecimal referenceRangeMax;

    private String referenceRangeText;

    private String interpretation;

    public Long getId() {
        return resultId;
    }

    public LabReport getLabReport() {
        return labReport;
    }

    public void setLabReport(LabReport labReport) {
        this.labReport = labReport;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public Long getParameterId() {
        return parameterId;
    }

    public void setParameterId(Long parameterId) {
        this.parameterId = parameterId;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getResultValue() {
        return resultValue;
    }

    public void setResultValue(String resultValue) {
        this.resultValue = resultValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getReferenceRangeMin() {
        return referenceRangeMin;
    }

    public void setReferenceRangeMin(BigDecimal referenceRangeMin) {
        this.referenceRangeMin = referenceRangeMin;
    }

    public BigDecimal getReferenceRangeMax() {
        return referenceRangeMax;
    }

    public void setReferenceRangeMax(BigDecimal referenceRangeMax) {
        this.referenceRangeMax = referenceRangeMax;
    }

    public String getReferenceRangeText() {
        return referenceRangeText;
    }

    public void setReferenceRangeText(String referenceRangeText) {
        this.referenceRangeText = referenceRangeText;
    }

    public String getInterpretation() {
        return interpretation;
    }

    public void setInterpretation(String interpretation) {
        this.interpretation = interpretation;
    }
}