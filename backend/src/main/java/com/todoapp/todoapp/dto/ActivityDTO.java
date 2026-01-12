package com.todoapp.todoapp.dto;

public class ActivityDTO {
    private Integer id;
    private String date;
    private String context;
    private Boolean completed;

    public ActivityDTO() {
    }

    public ActivityDTO(Integer id, String date, String context, Boolean completed) {
        this.id = id;
        this.date = date;
        this.context = context;
        this.completed = completed;
    }

    public Integer getId() {
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
}
