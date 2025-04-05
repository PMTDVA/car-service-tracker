package com.carservice.service;

import com.carservice.model.Car;
import com.carservice.model.ServiceRecord;
import com.carservice.model.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileService {
    private final ObjectMapper objectMapper;
    private final String usersFilePath = "users.txt";
    private final String carsFilePath = "cars.txt";
    private final String serviceHistoryFilePath = "service_history.txt";

    public FileService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        
        // Create files if they don't exist
        createFileIfNotExists(usersFilePath);
        createFileIfNotExists(carsFilePath);
        createFileIfNotExists(serviceHistoryFilePath);
    }

    private void createFileIfNotExists(String filePath) {
        File file = new File(filePath);
        if (!file.exists()) {
            try {
                file.createNewFile();
                if (filePath.equals(usersFilePath)) {
                    objectMapper.writeValue(file, new ArrayList<User>());
                } else if (filePath.equals(carsFilePath)) {
                    objectMapper.writeValue(file, new ArrayList<Car>());
                } else if (filePath.equals(serviceHistoryFilePath)) {
                    objectMapper.writeValue(file, new ArrayList<ServiceRecord>());
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    // User Management
    public List<User> loadUsers() {
        try {
            return objectMapper.readValue(new File(usersFilePath), new TypeReference<List<User>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public void saveUsers(List<User> users) {
        try {
            objectMapper.writeValue(new File(usersFilePath), users);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Car Management
    public List<Car> loadCars() {
        try {
            return objectMapper.readValue(new File(carsFilePath), new TypeReference<List<Car>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public void saveCars(List<Car> cars) {
        try {
            objectMapper.writeValue(new File(carsFilePath), cars);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Service History
    public List<ServiceRecord> loadServiceHistory() {
        try {
            return objectMapper.readValue(new File(serviceHistoryFilePath), new TypeReference<List<ServiceRecord>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public void saveServiceHistory(List<ServiceRecord> records) {
        try {
            objectMapper.writeValue(new File(serviceHistoryFilePath), records);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

