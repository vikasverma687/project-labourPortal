package com.example.job_service.service;

import com.example.job_service.dao.JobApplyDao;
import com.example.job_service.model.JobAppData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplyService {

   JobApplyDao jobApplyDao;

   public  JobApplyService(JobApplyDao jobApplyDao) {
      this.jobApplyDao = jobApplyDao;
   }

   public List<JobAppData> getJobApplications( Integer jobId ){


     return jobApplyDao.getJobApplications(jobId);
       
   }
}
