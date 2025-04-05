package com.carservice.controller;

import com.carservice.model.User;
import com.carservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String getAllUsers(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        model.addAttribute("user", new User()); // For the form
        return "users";
    }

    @PostMapping
    public String createUser(@ModelAttribute User user, RedirectAttributes redirectAttributes) {
        if (user.getName() == null || user.getName().isEmpty() || user.getEmail() == null || user.getEmail().isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Name and email are required fields");
            return "redirect:/users";
        }
        
        User createdUser = userService.createUser(user);
        redirectAttributes.addFlashAttribute("success", "User created successfully");
        return "redirect:/users";
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable String id, Model model) {
        User user = userService.getUserById(id);
        if (user == null) {
            return "redirect:/users";
        }
        
        model.addAttribute("user", user);
        model.addAttribute("isEdit", true);
        return "users-edit";
    }

    @PostMapping("/{id}")
    public String updateUser(@PathVariable String id, @ModelAttribute User user, RedirectAttributes redirectAttributes) {
        user.setId(id);
        User updatedUser = userService.updateUser(user);
        
        if (updatedUser == null) {
            redirectAttributes.addFlashAttribute("error", "Failed to update user");
        } else {
            redirectAttributes.addFlashAttribute("success", "User updated successfully");
        }
        
        return "redirect:/users";
    }

    @GetMapping("/{id}/delete")
    public String deleteUser(@PathVariable String id, RedirectAttributes redirectAttributes) {
        boolean deleted = userService.deleteUser(id);
        
        if (deleted) {
            redirectAttributes.addFlashAttribute("success", "User deleted successfully");
        } else {
            redirectAttributes.addFlashAttribute("error", "Failed to delete user");
        }
        
        return "redirect:/users";
    }

    @GetMapping("/{id}")
    public String viewUser(@PathVariable String id, Model model) {
        User user = userService.getUserById(id);
        if (user == null) {
            return "redirect:/users";
        }
        
        model.addAttribute("user", user);
        return "user-details";
    }
}

