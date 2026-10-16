package com.bloodlab.testservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "test_parameters")
public class TestParameter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long parameterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_test_id", nullable = false)
    private LabTest labTest;

    @Column(nullable = false)
    private String parameterName;

    private String unit;

    private Double normalRangeMin;

    private Double normalRangeMax;

    private String normalRangeText;

    private Integer displayOrder;

    private Boolean active = true;

    public Long getId() {
        return parameterId;
    }

    public LabTest getLabTest() {
        return labTest;
    }

    public void setLabTest(LabTest labTest) {
        this.labTest = labTest;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getNormalRangeMin() {
        return normalRangeMin;
    }

    public void setNormalRangeMin(Double normalRangeMin) {
        this.normalRangeMin = normalRangeMin;
    }

    public Double getNormalRangeMax() {
        return normalRangeMax;
    }

    public void setNormalRangeMax(Double normalRangeMax) {
        this.normalRangeMax = normalRangeMax;
    }

    public String getNormalRangeText() {
        return normalRangeText;
    }

    public void setNormalRangeText(String normalRangeText) {
        this.normalRangeText = normalRangeText;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}