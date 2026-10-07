package com.example.job_service.service;

import com.example.job_service.dao.JobPostDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JobPostService {

    @Autowired
    JobPostDao jobPostDao;

    public boolean incrementIntrest(Integer jobId ) {

       return jobPostDao.incrementIntrest(jobId);

    }
}
