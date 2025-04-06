package com.carservice.controller;

import com.carservice.model.Car;
import com.carservice.model.ServiceRecord;
import com.carservice.model.User;
import com.carservice.service.CarService;
import com.carservice.service.ServiceHistoryService;
import com.carservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping("/service-history")
public class ServiceHistoryController {
    private final ServiceHistoryService serviceHistoryService;
    private final CarService carService;
    private final UserService userService;

    @Autowired
    public ServiceHistoryController(ServiceHistoryService serviceHistoryService, CarService carService, UserService userService) {
        this.serviceHistoryService = serviceHistoryService;
        this.carService = carService;
        this.userService = userService;
    }

    @GetMapping
    public String getAllServiceRecords(Model model) {
        List<ServiceRecord> records = serviceHistoryService.getAllServiceRecords();
        List<Car> cars = carService.getAllCars();

        model.addAttribute("records", records);
        model.addAttribute("cars", cars);
        return "service-history";
    }

    @GetMapping("/car/{carId}")
    public String getServiceRecordsByCar(@PathVariable String carId,
                                         @RequestParam(required = false, defaultValue = "false") boolean ascending,
                                         Model model) {
        Car car = carService.getCarById(carId);
        if (car == null) {
            return "redirect:/cars";
        }

        User user = userService.getUserById(car.getUserId());
        List<ServiceRecord> records = serviceHistoryService.getSortedServiceRecords(carId, ascending);

        model.addAttribute("car", car);
        model.addAttribute("user", user);
        model.addAttribute("records", records);
        model.addAttribute("ascending", ascending);

        // Create a new service record with the carId already set
        ServiceRecord newRecord = new ServiceRecord();
        newRecord.setCarId(carId);
        newRecord.setDate(LocalDate.now());
        model.addAttribute("record", newRecord);

        return "car-service-history";
    }

    @PostMapping
    public String createServiceRecord(@ModelAttribute ServiceRecord record, RedirectAttributes redirectAttributes) {
        if (record.getDate() == null || record.getDescription() == null || record.getDescription().isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Date and description are required fields");

            if (record.getCarId() != null && !record.getCarId().isEmpty()) {
                return "redirect:/service-history/car/" + record.getCarId();
            }
            return "redirect:/service-history";
        }

        ServiceRecord createdRecord = serviceHistoryService.createServiceRecord(record);
        redirectAttributes.addFlashAttribute("success", "Service record added successfully");

        if (record.getCarId() != null && !record.getCarId().isEmpty()) {
            return "redirect:/service-history/car/" + record.getCarId();
        }
        return "redirect:/service-history";
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable String id, Model model) {
        ServiceRecord record = serviceHistoryService.getServiceRecordById(id);
        if (record == null) {
            return "redirect:/service-history";
        }

        Car car = carService.getCarById(record.getCarId());
        List<Car> cars = carService.getAllCars();

        model.addAttribute("record", record);
        model.addAttribute("car", car);
        model.addAttribute("cars", cars);
        model.addAttribute("isEdit", true);
        return "service-history-edit";
    }

    @PostMapping("/{id}")
    public String updateServiceRecord(@PathVariable String id, @ModelAttribute ServiceRecord record, RedirectAttributes redirectAttributes) {
        record.setId(id);
        ServiceRecord updatedRecord = serviceHistoryService.updateServiceRecord(record);

        if (updatedRecord == null) {
            redirectAttributes.addFlashAttribute("error", "Failed to update service record");
        } else {
            redirectAttributes.addFlashAttribute("success", "Service record updated successfully");
        }

        if (record.getCarId() != null && !record.getCarId().isEmpty()) {
            return "redirect:/service-history/car/" + record.getCarId();
        }
        return "redirect:/service-history";
    }

    @GetMapping("/{id}/delete")
    public String deleteServiceRecord(@PathVariable String id, RedirectAttributes redirectAttributes) {
        ServiceRecord record = serviceHistoryService.getServiceRecordById(id);
        String carId = record != null ? record.getCarId() : null;

        boolean deleted = serviceHistoryService.deleteServiceRecord(id);

        if (deleted) {
            redirectAttributes.addFlashAttribute("success", "Service record deleted successfully");
        } else {
            redirectAttributes.addFlashAttribute("error", "Failed to delete service record");
        }

        if (carId != null) {
            return "redirect:/service-history/car/" + carId;
        }
        return "redirect:/service-history";
    }

    @GetMapping("/search")
    public String showSearchForm(Model model) {
        model.addAttribute("startDate", LocalDate.now().minusMonths(1));
        model.addAttribute("endDate", LocalDate.now());
        return "service-history-search";
    }

    @GetMapping("/search/results")
    public String searchServiceRecords(
            @RequestParam(required = false) String registrationNumber,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Model model) {

        if (registrationNumber != null && !registrationNumber.isEmpty()) {
            // Search by registration number
            Car car = carService.getCarByRegistration(registrationNumber);
            if (car != null) {
                List<ServiceRecord> records = serviceHistoryService.getServiceRecordsByCarId(car.getId());
                model.addAttribute("car", car);
                model.addAttribute("records", records);
                model.addAttribute("searchType", "registration");
                model.addAttribute("searchTerm", registrationNumber);
            } else {
                model.addAttribute("error", "No car found with registration number: " + registrationNumber);
            }
        } else if (startDate != null && endDate != null) {
            // Search by date range
            if (startDate.isAfter(endDate)) {
                model.addAttribute("error", "Start date must be before end date");
            } else {
                List<ServiceRecord> records = serviceHistoryService.getServiceRecordsByDateRange(startDate, endDate);
                List<Car> cars = carService.getAllCars();

                model.addAttribute("records", records);
                model.addAttribute("cars", cars);
                model.addAttribute("searchType", "dateRange");
                model.addAttribute("startDate", startDate);
                model.addAttribute("endDate", endDate);
            }
        } else {
            model.addAttribute("error", "Please provide either a registration number or a date range");
        }

        return "service-history-search-results";
    }
}

