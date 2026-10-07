package com.example.job_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class JobData {

    Integer jobId;
    String jobTitle;
    String category;
    String description;
    String requiredSkills;
    String location;
    String phone;
    Date preferred_date;
    Integer budget;
    String urgency;
    Integer intrested;
    String status;
    String created_at;
}
