package com.todoapp.todoapp.services;

import com.todoapp.todoapp.dto.ActivityDTO;
import com.todoapp.todoapp.model.ActivityModel;
import com.todoapp.todoapp.model.User;
import com.todoapp.todoapp.repo.Activityrepo;
import com.todoapp.todoapp.repo.UserRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional

public class ActivityServices {

    @Autowired
    private Activityrepo activityrepo;

    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<ActivityDTO> getAllActivitiesByUser(String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
        List<ActivityModel> activitylist = activityrepo.findByUser(user);
        return modelMapper.map(activitylist,new TypeToken<List<ActivityDTO>>(){

        }.getType());
    }

    public ActivityDTO AddActivity(ActivityDTO activityDTO, String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
        
        ActivityModel activityModel = new ActivityModel();
        activityModel.setDate(activityDTO.getDate());
        activityModel.setContext(activityDTO.getContext());
        activityModel.setCompleted(activityDTO.getCompleted() != null ? activityDTO.getCompleted() : false);
        activityModel.setUser(user);
        
        ActivityModel saved = activityrepo.save(activityModel);
        return modelMapper.map(saved, ActivityDTO.class);
    }

    public ActivityDTO updateActivity(Integer id, ActivityDTO activityDTO) {
        ActivityModel existingActivity = activityrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + id));
        
        if (activityDTO.getDate() != null) {
            existingActivity.setDate(activityDTO.getDate());
        }
        if (activityDTO.getContext() != null) {
            existingActivity.setContext(activityDTO.getContext());
        }
        if (activityDTO.getCompleted() != null) {
            existingActivity.setCompleted(activityDTO.getCompleted());
        }
        
        ActivityModel updatedActivity = activityrepo.save(existingActivity);
        return modelMapper.map(updatedActivity, ActivityDTO.class);
    }

    public ActivityDTO toggleCompleted(Integer id) {
        ActivityModel activity = activityrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + id));
        
        activity.setCompleted(!activity.getCompleted());
        ActivityModel updatedActivity = activityrepo.save(activity);
        return modelMapper.map(updatedActivity, ActivityDTO.class);
    }
}
