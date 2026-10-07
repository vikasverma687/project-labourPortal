package com.example.job_service.dao;

import com.example.job_service.dto.JobData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Slf4j
@Repository
public class JobPostDao {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public boolean saveJobPost(String customerId, JobData jobData) {

        try {
            jdbcTemplate.update("INSERT INTO job_post(customerid, job_title, category, description, required_skills, location, phoneno, preferred_date, budget, urgency) values(?,?,?,?,?,?,?,?,?,?)",
                    customerId, jobData.getJobTitle(), jobData.getCategory(), jobData.getDescription(), jobData.getRequiredSkills(), jobData.getLocation(), jobData.getPhone(), jobData.getPreferred_date(), jobData.getBudget(), jobData.getUrgency());
            return true;
        } catch (Exception e) {
            log.error("could not insert job post data :=>>-- " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public List<JobData> getJobPost(String customerId) {

        try {
            return jdbcTemplate.query("SELECT * FROM job_post WHERE customerid = ?",
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
                        jobData.setIntrested(rs.getInt("intrested"));
                        jobData.setStatus(rs.getString("status"));
                        jobData.setCreated_at(rs.getString("created_at"));

                        return jobData;
                    }, customerId);

        } catch (Exception e) {
            log.error("could not get job post data :=>>-- " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public JobData getJobPostById(Integer jobId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM job_post WHERE id = ?",
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
                        jobData.setIntrested(rs.getInt("intrested"));
                        jobData.setStatus(rs.getString("status"));
                        jobData.setCreated_at(rs.getString("created_at"));

                        return jobData;
                    }, jobId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean deleteJobPostById(Integer jobId) {
        try {
            jdbcTemplate.update("DELETE FROM job_post WHERE id = ?", jobId);
            return true;
        } catch (DataAccessException e) {
            log.error("could not delete job post data :=>>-- " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public boolean incrementIntrest(Integer jobId ) {

        System.out.println("hitting increment intrest!!!");
        try{

            jdbcTemplate.update("UPDATE job_post set intrested = intrested +1  WHERE id = ?", jobId);
        return true;
        }catch (Exception e){
            log.error("could not update intrest :=>>-- " + e.getMessage());
            throw  new RuntimeException(e.getMessage());
        }

    }

}
