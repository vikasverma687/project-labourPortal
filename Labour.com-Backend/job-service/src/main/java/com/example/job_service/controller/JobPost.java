package com.example.job_service.controller;

import com.example.job_service.dao.JobPostDao;
import com.example.job_service.dto.JobData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/job")
@RestController
public class JobPost {

    @Autowired
    JobPostDao jobPostDao;

    @PostMapping("/create-job-post")
    public ResponseEntity<?> jobPost(@RequestBody JobData jobData, @RequestHeader("X-User-Id") String customerId) {

        String jobTiltle = jobData.getJobTitle();

        System.out.println("Job Post Called: " + jobTiltle +
                "description: " + jobData.getDescription() +
                "date: " + jobData.getPreferred_date() +
                "required skills: " + jobData.getRequiredSkills() +
                " urgency: " + jobData.getUrgency() +
                "phone number : " + jobData.getPhone() +
                "customerId " + customerId);

        boolean success = jobPostDao.saveJobPost(customerId, jobData);

        if (success) {
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "job is posted successfully!"));
        }
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
    }



    @GetMapping("/getJobPost")
    public ResponseEntity<?> getJobPost(@RequestHeader("X-User-Id") String customerId) {



        List<JobData> jobs = jobPostDao.getJobPost(customerId);

        if (jobs.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("jobs", jobs, "message", "job is posted successfully!"));

    }

    @GetMapping("/getJobPostById/{jobId}")
    public ResponseEntity<?> getJobPostById(@PathVariable("jobId") String jobId) {


        Integer id = Integer.parseInt(jobId);
        JobData jobData = jobPostDao.getJobPostById(id);

        if (jobData == null) {

            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("job", jobData));

    }

    @DeleteMapping("/deleteJobPost/{jobId}")
    public ResponseEntity<?> deleteJobPost(@PathVariable("jobId") String jobId) {
        Integer id = Integer.parseInt(jobId);


        boolean success = jobPostDao.deleteJobPostById(id);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "job is deleted!"));
        } else {
            System.out.println("job post delete failed");
            return ResponseEntity.notFound().build();
        }
    }
}
