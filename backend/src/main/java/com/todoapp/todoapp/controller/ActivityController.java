package com.todoapp.todoapp.controller;

import com.todoapp.todoapp.dto.ActivityDTO;
import com.todoapp.todoapp.services.ActivityServices;
import com.todoapp.todoapp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/v1")
public class ActivityController {

    @Autowired
    public ActivityServices activityServices;
    
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/getactivity")
    public List<ActivityDTO> getActivity(@RequestHeader("Authorization") String authHeader){
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        String userEmail = jwtUtil.extractEmail(token);
        return activityServices.getAllActivitiesByUser(userEmail);
    }

    @PostMapping("/saveactivity")
    public ActivityDTO saveActivity(@RequestBody ActivityDTO activityDTO, @RequestHeader("Authorization") String authHeader){
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        String userEmail = jwtUtil.extractEmail(token);
        return activityServices.AddActivity(activityDTO, userEmail);
    }

    @PutMapping("/updateactivity/{id}")
    public ActivityDTO updateActivity(@PathVariable Integer id, @RequestBody ActivityDTO activityDTO) {
        return activityServices.updateActivity(id, activityDTO);
    }

    @PutMapping("/togglecompleted/{id}")
    public ActivityDTO toggleCompleted(@PathVariable Integer id) {
        return activityServices.toggleCompleted(id);
    }

    @DeleteMapping("/deleteactivity/{id}")
    public void deleteActivity(@PathVariable Integer id) {
        activityServices.deleteActivity(id);
    }
}
