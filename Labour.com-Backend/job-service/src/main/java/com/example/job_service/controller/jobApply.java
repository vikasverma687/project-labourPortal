package com.example.job_service.controller;

import com.example.job_service.dao.JobApplyDao;
import com.example.job_service.model.JobAppData;
import com.example.job_service.service.JobApplyService;
import com.example.job_service.service.JobPostService;
import com.example.job_service.service.LabourerJobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/job")
@RestController
public class jobApply {

    JobApplyDao jobApplyDao;
    JobPostService jobPostService;
    LabourerJobService labourerJobService;
    JobApplyService jobApplyService;

    public jobApply(JobApplyDao jobApplyDao, JobPostService jobPostService, LabourerJobService labourerJobService, JobApplyService jobApplyService) {

        this.jobApplyDao = jobApplyDao;
        this.jobPostService = jobPostService;
        this.labourerJobService = labourerJobService;
        this.jobApplyService = jobApplyService;
    }


    @PostMapping("/applyJobApp")
    public ResponseEntity<?> applyJobApp(@RequestBody JobApp jobApp, @RequestHeader("X-User-Id") String labourer_id, @RequestHeader("X-User-Role") String role) {

        if (!role.equals("LABOURER")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String name = labourerJobService.getWorkerName(labourer_id);

        if (name == null) {

            throw new RuntimeException("labourer name could not fetched");
        }
        System.out.println("name fetched => " + name);

        boolean success = jobApplyDao.applyJobApplication(labourer_id, jobApp.jobId, name, jobApp.message);

        if (success) {
            if (!jobPostService.incrementIntrest(jobApp.jobId)) {
                System.out.println("could not update the intrested,controller");
            }
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.internalServerError().build();

    }


    @GetMapping("/getJobApplications/{jobId}")
    public ResponseEntity<?> getJobApplications(@PathVariable("jobId") Integer jobId) {

        System.out.println("getJobApplications hitting...");

        List<JobAppData> jobApplications = jobApplyService.getJobApplications(jobId);

        if (jobApplications.isEmpty()) {
            System.out.println("no job applications found");
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(jobApplications);
    }


    record JobApp(Integer jobId, String message) {
    }
}
