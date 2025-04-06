package com.carservice.model;

import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

public class ServiceRecord {
    private String id;
    private String carId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate date;

    private String description;
    private double cost;
    private int mileage;

    public ServiceRecord() {
    }

    public ServiceRecord(String id, String carId, LocalDate date, String description, double cost, int mileage) {
        this.id = id;
        this.carId = carId;
        this.date = date;
        this.description = description;
        this.cost = cost;
        this.mileage = mileage;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCarId() {
        return carId;
    }

    public void setCarId(String carId) {
        this.carId = carId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public int getMileage() {
        return mileage;
    }

    public void setMileage(int mileage) {
        this.mileage = mileage;
    }
}

