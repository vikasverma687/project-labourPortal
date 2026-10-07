package com.example.job_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobAppData {

    Integer jobId;
    String labourer_id;
    String labourer_name;
    String message;
    Date applied_at;
    String status;
}
