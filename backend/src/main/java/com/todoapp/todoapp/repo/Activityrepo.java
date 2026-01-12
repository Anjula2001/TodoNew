package com.todoapp.todoapp.repo;

import com.todoapp.todoapp.model.ActivityModel;
import com.todoapp.todoapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface Activityrepo extends JpaRepository<ActivityModel,Integer> {
    List<ActivityModel> findByUser(User user);
}
