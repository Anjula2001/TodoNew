package com.todoapp.todoapp.model;

import jakarta.persistence.*;

@Entity
public class ActivityModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String date;
    private String context;
    private Boolean completed = false;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
 //   @Version
   // private int version;


    public ActivityModel(){
    }

    public ActivityModel(int id, String date, String context) {
        this.id = id;
        this.date = date;
        this.context = context;
        this.completed = false;
        //this.version = 1;
    }

    public int getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}




