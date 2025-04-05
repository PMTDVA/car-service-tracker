package com.carservice.model;

import java.util.ArrayList;
import java.util.List;

public class Car {
    private String id;
    private String userId;
    private String registrationNumber;
    private String make;
    private String model;
    private String year;
    private String color;
    private List<ServiceRecord> serviceRecords = new ArrayList<>();

    public Car() {
    }

    public Car(String id, String userId, String registrationNumber, String make, String model, String year, String color) {
        this.id = id;
        this.userId = userId;
        this.registrationNumber = registrationNumber;
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public List<ServiceRecord> getServiceRecords() {
        return serviceRecords;
    }

    public void setServiceRecords(List<ServiceRecord> serviceRecords) {
        this.serviceRecords = serviceRecords;
    }

    public void addServiceRecord(ServiceRecord record) {
        this.serviceRecords.add(record);
    }

    public void removeServiceRecord(ServiceRecord record) {
        this.serviceRecords.removeIf(r -> r.getId().equals(record.getId()));
    }
}

