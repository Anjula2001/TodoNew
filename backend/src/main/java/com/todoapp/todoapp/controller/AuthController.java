package com.todoapp.todoapp.controller;

import com.todoapp.todoapp.dto.AuthResponse;
import com.todoapp.todoapp.dto.ChangePasswordRequest;
import com.todoapp.todoapp.dto.LoginRequest;
import com.todoapp.todoapp.dto.RegisterRequest;
import com.todoapp.todoapp.dto.UpdateProfileRequest;
import com.todoapp.todoapp.model.User;
import com.todoapp.todoapp.services.AuthService;
import com.todoapp.todoapp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            String message = authService.register(request);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String userEmail = jwtUtil.extractEmail(token);
            User user = authService.getUserProfile(userEmail);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String authHeader,
                                          @RequestBody UpdateProfileRequest request) {
        try {
            String token = authHeader.substring(7);
            String userEmail = jwtUtil.extractEmail(token);
            AuthResponse response = authService.updateProfile(userEmail, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String authHeader,
                                           @RequestBody ChangePasswordRequest request) {
        try {
            String token = authHeader.substring(7);
            String userEmail = jwtUtil.extractEmail(token);
            String message = authService.changePassword(userEmail, request);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
