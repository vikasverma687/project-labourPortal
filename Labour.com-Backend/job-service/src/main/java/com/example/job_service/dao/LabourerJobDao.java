package com.example.job_service.dao;

import com.example.job_service.dto.JobData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Slf4j
@Repository
public class LabourerJobDao {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<JobData> getNearbyJobsByLocation(String location) {


        try {
            return jdbcTemplate.query("select * from job_post where location = ?",
                    (rs, rowNum) -> {

                        JobData jobData = new JobData();

                        jobData.setJobId(rs.getInt("id"));
                        jobData.setJobTitle(rs.getString("job_title"));
                        jobData.setCategory(rs.getString("category"));
                        jobData.setDescription(rs.getString("description"));
                        jobData.setRequiredSkills(rs.getString("required_skills"));
                        jobData.setLocation(rs.getString("location"));
                        jobData.setPhone(rs.getString("phoneno"));
                        jobData.setPreferred_date(rs.getDate("preferred_date"));
                        jobData.setBudget(rs.getInt("budget"));
                        jobData.setUrgency(rs.getString("urgency"));
                        jobData.setStatus(rs.getString("status"));
                        jobData.setCreated_at(rs.getString("created_at"));

                        return jobData;
                    }, location);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }

    }

    public List<Map<String, Object>> getAppliedJobsById(String labourer_id) {
        try {

            List<Map<String, Object>> jobInfo = jdbcTemplate.queryForList("select jobid, status from job_application where labourer_id = ?", labourer_id);

            return jobInfo;
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
