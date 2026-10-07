package com.example.job_service.dao;

import com.example.job_service.model.JobAppData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Slf4j
@Repository
public class JobApplyDao {

    @Autowired
    JdbcTemplate jdbcTemplate;


    public boolean applyJobApplication(String labourer_id, Integer jobId, String name, String jobMessage) {
        try {

            jdbcTemplate.update("INSERT INTO job_application(labourer_id , jobId , labourer_name , message) Values(?,?,?, ?)", labourer_id, jobId, name, jobMessage);

            return true;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<JobAppData> getJobApplications(Integer jobId) {

        try {

            return jdbcTemplate.query("SELECT * FROM job_application where jobid = ? ",
                    (rs, rownUM) -> {
                        JobAppData jobAppData = new JobAppData();

                        jobAppData.setJobId(rs.getInt("jobid"));
                        jobAppData.setApplied_at(rs.getDate("applied_at"));
                        jobAppData.setLabourer_name(rs.getString("labourer_name"));
                        jobAppData.setMessage(rs.getString("message"));
                        jobAppData.setStatus(rs.getString("status"));
                        jobAppData.setLabourer_id(rs.getString("labourer_id"));

                        return jobAppData;

                    }, jobId
            );

        } catch (Exception e) {
            log.error("getJobApplication error", e);
            throw new RuntimeException(e);
        }
    }


}


