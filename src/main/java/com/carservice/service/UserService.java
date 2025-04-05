package com.carservice.service;

import com.carservice.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final FileService fileService;

    @Autowired
    public UserService(FileService fileService) {
        this.fileService = fileService;
    }

    public List<User> getAllUsers() {
        return fileService.loadUsers();
    }

    public User getUserById(String id) {
        List<User> users = fileService.loadUsers();
        return users.stream()
                .filter(user -> user.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public User createUser(User user) {
        List<User> users = fileService.loadUsers();
        
        // Generate a unique ID if not provided
        if (user.getId() == null || user.getId().isEmpty()) {
            user.setId(UUID.randomUUID().toString());
        }
        
        users.add(user);
        fileService.saveUsers(users);
        return user;
    }

    public User updateUser(User updatedUser) {
        List<User> users = fileService.loadUsers();
        
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId().equals(updatedUser.getId())) {
                users.set(i, updatedUser);
                fileService.saveUsers(users);
                return updatedUser;
            }
        }
        
        return null; // User not found
    }

    public boolean deleteUser(String id) {
        List<User> users = fileService.loadUsers();
        boolean removed = users.removeIf(user -> user.getId().equals(id));
        
        if (removed) {
            fileService.saveUsers(users);
        }
        
        return removed;
    }
}

