package com.todoapp.todoapp.services;

import com.todoapp.todoapp.dto.AuthResponse;
import com.todoapp.todoapp.dto.ChangePasswordRequest;
import com.todoapp.todoapp.dto.LoginRequest;
import com.todoapp.todoapp.dto.RegisterRequest;
import com.todoapp.todoapp.dto.UpdateProfileRequest;
import com.todoapp.todoapp.model.User;
import com.todoapp.todoapp.repo.UserRepository;
import com.todoapp.todoapp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In production, use password encoder

        userRepository.save(user);
        return "User registered successfully";
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail());
    }

    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if new email is already taken by another user
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        userRepository.save(user);

        // Generate new token with updated email
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail());
    }

    public User getUserProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify current password
        if (!user.getPassword().equals(request.getCurrentPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate new password
        if (request.getNewPassword() == null || request.getNewPassword().trim().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }

        // Update password
        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        return "Password changed successfully";
    }
}
