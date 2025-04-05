package com.carservice.service;

import com.carservice.model.Car;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CarService {
    private final FileService fileService;

    @Autowired
    public CarService(FileService fileService) {
        this.fileService = fileService;
    }

    public List<Car> getAllCars() {
        return fileService.loadCars();
    }

    public List<Car> getCarsByUserId(String userId) {
        List<Car> cars = fileService.loadCars();
        return cars.stream()
                .filter(car -> car.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public Car getCarById(String id) {
        List<Car> cars = fileService.loadCars();
        return cars.stream()
                .filter(car -> car.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public Car getCarByRegistration(String registrationNumber) {
        List<Car> cars = fileService.loadCars();
        return cars.stream()
                .filter(car -> car.getRegistrationNumber().equalsIgnoreCase(registrationNumber))
                .findFirst()
                .orElse(null);
    }

    public Car createCar(Car car) {
        List<Car> cars = fileService.loadCars();
        
        // Check for duplicate registration number
        boolean isDuplicate = cars.stream()
                .anyMatch(c -> c.getRegistrationNumber().equalsIgnoreCase(car.getRegistrationNumber()));
        
        if (isDuplicate) {
            return null; // Registration number already exists
        }
        
        // Generate a unique ID if not provided
        if (car.getId() == null || car.getId().isEmpty()) {
            car.setId(UUID.randomUUID().toString());
        }
        
        cars.add(car);
        fileService.saveCars(cars);
        return car;
    }

    public Car updateCar(Car updatedCar) {
        List<Car> cars = fileService.loadCars();
        
        // Check for duplicate registration number (excluding the current car)
        boolean isDuplicate = cars.stream()
                .anyMatch(c -> c.getRegistrationNumber().equalsIgnoreCase(updatedCar.getRegistrationNumber()) 
                        && !c.getId().equals(updatedCar.getId()));
        
        if (isDuplicate) {
            return null; // Registration number already exists
        }
        
        for (int i = 0; i < cars.size(); i++) {
            if (cars.get(i).getId().equals(updatedCar.getId())) {
                cars.set(i, updatedCar);
                fileService.saveCars(cars);
                return updatedCar;
            }
        }
        
        return null; // Car not found
    }

    public boolean deleteCar(String id) {
        List<Car> cars = fileService.loadCars();
        boolean removed = cars.removeIf(car -> car.getId().equals(id));
        
        if (removed) {
            fileService.saveCars(cars);
        }
        
        return removed;
    }
}

