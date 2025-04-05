package com.carservice.service;

import com.carservice.model.ServiceRecord;
import com.carservice.util.LinkedList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ServiceHistoryService {
    private final FileService fileService;
    private final LinkedList serviceList;

    @Autowired
    public ServiceHistoryService(FileService fileService) {
        this.fileService = fileService;
        this.serviceList = new LinkedList();
        
        // Load service records into linked list
        List<ServiceRecord> records = fileService.loadServiceHistory();
        for (ServiceRecord record : records) {
            serviceList.append(record);
        }
    }

    public List<ServiceRecord> getAllServiceRecords() {
        return fileService.loadServiceHistory();
    }

    public List<ServiceRecord> getServiceRecordsByCarId(String carId) {
        List<ServiceRecord> records = fileService.loadServiceHistory();
        return records.stream()
                .filter(record -> record.getCarId().equals(carId))
                .collect(Collectors.toList());
    }

    public List<ServiceRecord> getServiceRecordsByDateRange(LocalDate startDate, LocalDate endDate) {
        List<ServiceRecord> records = fileService.loadServiceHistory();
        return records.stream()
                .filter(record -> !record.getDate().isBefore(startDate) && !record.getDate().isAfter(endDate))
                .collect(Collectors.toList());
    }

    public ServiceRecord getServiceRecordById(String id) {
        List<ServiceRecord> records = fileService.loadServiceHistory();
        return records.stream()
                .filter(record -> record.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public ServiceRecord createServiceRecord(ServiceRecord record) {
        List<ServiceRecord> records = fileService.loadServiceHistory();
        
        // Generate a unique ID if not provided
        if (record.getId() == null || record.getId().isEmpty()) {
            record.setId(UUID.randomUUID().toString());
        }
        
        records.add(record);
        fileService.saveServiceHistory(records);
        
        // Add to linked list
        serviceList.append(record);
        
        return record;
    }

    public ServiceRecord updateServiceRecord(ServiceRecord updatedRecord) {
        List<ServiceRecord> records = fileService.loadServiceHistory();
        
        for (int i = 0; i < records.size(); i++) {
            if (records.get(i).getId().equals(updatedRecord.getId())) {
                records.set(i, updatedRecord);
                fileService.saveServiceHistory(records);
                
                // Update linked list
                serviceList.remove(r -> r.getId().equals(updatedRecord.getId()));
                serviceList.append(updatedRecord);
                
                return updatedRecord;
            }
        }
        
        return null; // Record not found
    }

    public boolean deleteServiceRecord(String id) {
        List<ServiceRecord> records = fileService.loadServiceHistory();
        boolean removed = records.removeIf(record -> record.getId().equals(id));
        
        if (removed) {
            fileService.saveServiceHistory(records);
            
            // Remove from linked list
            serviceList.remove(r -> r.getId().equals(id));
        }
        
        return removed;
    }

    public List<ServiceRecord> getSortedServiceRecords(String carId, boolean ascending) {
        // Get records for the specified car
        List<ServiceRecord> carRecords = getServiceRecordsByCarId(carId);
        
        // Create a new linked list with these records
        LinkedList sortedList = new LinkedList();
        for (ServiceRecord record : carRecords) {
            sortedList.append(record);
        }
        
        // Sort the linked list
        if (ascending) {
            sortedList.sort(Comparator.comparing(ServiceRecord::getDate));
        } else {
            sortedList.sort(Comparator.comparing(ServiceRecord::getDate).reversed());
        }
        
        // Return the sorted list
        return sortedList.toList();
    }
}

