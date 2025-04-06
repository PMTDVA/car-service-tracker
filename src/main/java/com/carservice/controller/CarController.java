package com.carservice.controller;

import com.carservice.model.Car;
import com.carservice.model.User;
import com.carservice.service.CarService;
import com.carservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/cars")
public class CarController {
    private final CarService carService;
    private final UserService userService;

    @Autowired
    public CarController(CarService carService, UserService userService) {
        this.carService = carService;
        this.userService = userService;
    }

    @GetMapping
    public String getAllCars(Model model) {
        List<Car> cars = carService.getAllCars();
        List<User> users = userService.getAllUsers();
        
        model.addAttribute("cars", cars);
        model.addAttribute("users", users);
        model.addAttribute("car", new Car()); // For the form
        return "cars";
    }

    @GetMapping("/user/{userId}")
    public String getCarsByUser(@PathVariable String userId, Model model) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return "redirect:/users";
        }
        
        List<Car> cars = carService.getCarsByUserId(userId);
        
        model.addAttribute("user", user);
        model.addAttribute("cars", cars);
        Car newCar = new Car();
        newCar.setUserId(userId);
        model.addAttribute("car", newCar); // For the form
        return "user-cars";
    }

    @PostMapping
    public String createCar(@ModelAttribute Car car, RedirectAttributes redirectAttributes) {
        if (car.getRegistrationNumber() == null || car.getRegistrationNumber().isEmpty() ||
            car.getMake() == null || car.getMake().isEmpty() ||
            car.getModel() == null || car.getModel().isEmpty() ||
            car.getYear() == null || car.getYear().isEmpty()) {
            
            redirectAttributes.addFlashAttribute("error", "Registration number, make, model, and year are required fields");
            
            if (car.getUserId() != null && !car.getUserId().isEmpty()) {
                return "redirect:/cars/user/" + car.getUserId();
            }
            return "redirect:/cars";
        }
        
        Car createdCar = carService.createCar(car);
        
        if (createdCar == null) {
            redirectAttributes.addFlashAttribute("error", "A car with this registration number already exists");
        } else {
            redirectAttributes.addFlashAttribute("success", "Car added successfully");
        }
        
        if (car.getUserId() != null && !car.getUserId().isEmpty()) {
            return "redirect:/cars/user/" + car.getUserId();
        }
        return "redirect:/cars";
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable String id, Model model) {
        Car car = carService.getCarById(id);
        if (car == null) {
            return "redirect:/cars";
        }
        
        List<User> users = userService.getAllUsers();
        
        model.addAttribute("car", car);
        model.addAttribute("users", users);
        model.addAttribute("isEdit", true);
        return "cars-edit";
    }

    @PostMapping("/{id}")
    public String updateCar(@PathVariable String id, @ModelAttribute Car car, RedirectAttributes redirectAttributes) {
        car.setId(id);
        Car updatedCar = carService.updateCar(car);
        
        if (updatedCar == null) {
            redirectAttributes.addFlashAttribute("error", "Failed to update car or registration number already exists");
        } else {
            redirectAttributes.addFlashAttribute("success", "Car updated successfully");
        }
        
        if (car.getUserId() != null && !car.getUserId().isEmpty()) {
            return "redirect:/cars/user/" + car.getUserId();
        }
        return "redirect:/cars";
    }

    @GetMapping("/{id}/delete")
    public String deleteCar(@PathVariable String id, RedirectAttributes redirectAttributes) {
        Car car = carService.getCarById(id);
        String userId = car != null ? car.getUserId() : null;
        
        boolean deleted = carService.deleteCar(id);
        
        if (deleted) {
            redirectAttributes.addFlashAttribute("success", "Car deleted successfully");
        } else {
            redirectAttributes.addFlashAttribute("error", "Failed to delete car");
        }
        
        if (userId != null) {
            return "redirect:/cars/user/" + userId;
        }
        return "redirect:/cars";
    }

    @GetMapping("/{id}")
    public String viewCar(@PathVariable String id, Model model) {
        Car car = carService.getCarById(id);
        if (car == null) {
            return "redirect:/cars";
        }
        
        User user = userService.getUserById(car.getUserId());
        
        model.addAttribute("car", car);
        model.addAttribute("user", user);
        return "car-details";
    }
}

