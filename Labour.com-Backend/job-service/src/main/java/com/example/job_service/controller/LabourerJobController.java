package com.example.job_service.controller;

import com.example.job_service.dao.JobApplyDao;
import com.example.job_service.dao.LabourerJobDao;
import com.example.job_service.dto.JobData;
import com.example.job_service.service.LabourerJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/job")
@RestController
public class LabourerJobController {

    LabourerJobService labourerJobService;
    LabourerJobDao labourerJobDao;

    public LabourerJobController(LabourerJobService labourerJobService , LabourerJobDao labourerJobDao) {

        this.labourerJobService = labourerJobService;
        this.labourerJobDao = labourerJobDao;
    }

    @GetMapping("/getNearbyJobs")
    public ResponseEntity<?> getNearbyJobs(@RequestHeader("X-User-Id") String userId) {


        List<JobData> jobs = labourerJobService.getNearbyJobs(userId);

        if (jobs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "no nearby jobs available"));
        }

        try {
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("jobs", jobs));

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @GetMapping("/getAppliedJobs")
    public ResponseEntity<?> getAppliedJobs(@RequestHeader("X-User-Id") String userId) {

        List<Map<String, Object>> jobInfo = labourerJobDao.getAppliedJobsById(userId);

        if (jobInfo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(jobInfo);

    }


}
