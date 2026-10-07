package com.example.labourer_service.dao;

import com.example.labourer_service.dto.LabourerProfileInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class LabourerProfileDao {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public boolean saveLabourerInfo(LabourerProfileInfo labourerProfileInfo, String userId, String role) {

        Integer col = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM labourer_profile where labourer_id = ?", Integer.class, userId);

        if (col != null || col > 0) {
            System.out.println("update profile function hitting");
            return updateProfile(labourerProfileInfo, userId);
        } else {

            String firstName = labourerProfileInfo.getFirstName();
            String lastName = labourerProfileInfo.getLastName();
            String location = labourerProfileInfo.getLocation();
            String experience = labourerProfileInfo.getExperience();
            String pincode = labourerProfileInfo.getPincode();
            boolean available = labourerProfileInfo.isAvailable();
            List<String> skills = labourerProfileInfo.getSkillArray();

            try {
                Integer row = jdbcTemplate.update("INSERT INTO labourer_profile( labourer_id ,role , firstname, lastname, location,  experience , pincode , available) values(?,?,?,?,?,?,? , ?)"
                        , userId, role, firstName, lastName, location, experience, pincode, available);

                if (row <= 0) {
                    return false;
                }
                return true;
            } catch (Exception e) {

                log.error("Labourer Profile Save Error =>" + e.getMessage());
                throw new RuntimeException(e);
            }
        }


    }

    private boolean updateProfile(LabourerProfileInfo labourerProfileInfo, String userId) {

        try {

            jdbcTemplate.update("UPDATE labourer_profile SET firstname = ?, lastname = ?, location = ?, experience = ? , pincode = ? , available = ?  WHERE labourer_id = ?",
                    labourerProfileInfo.getFirstName(),
                    labourerProfileInfo.getLastName(),
                    labourerProfileInfo.getLocation(),
                    labourerProfileInfo.getExperience(),
                    labourerProfileInfo.getPincode(),
                    labourerProfileInfo.isAvailable(),
                    userId);

            return true;
        } catch (Exception e) {
            log.error("Labourer Profile Update Error =>" + e.getMessage());
            throw new RuntimeException(e);

        }

    }

    public boolean saveSkillByUserID(String id, List<String> skills) {

        jdbcTemplate.update("DELETE FROM labourer_skills where  labourer_id =?", id);

        for (String skill : skills) {


            Integer row = jdbcTemplate.update("INSERT INTO labourer_skills (labourer_id ,skill) VALUES (?, ?)", id, skill);
        }
        return true;
    }

    public LabourerProfileInfo getProfileById(String userId) {

        List<String> skills = getSkillsByUserId(userId);

        if (skills.isEmpty()) {
            System.out.println("No skills found for userId => " + userId);

        }

        try {

            return jdbcTemplate.queryForObject("SELECT * FROM labourer_profile WHERE labourer_id =?",
                    (rs, rowNum) -> {
                        LabourerProfileInfo profile = new LabourerProfileInfo();

                        profile.setFirstName(rs.getString("firstname"));
                        profile.setLastName(rs.getString("lastname"));
                        profile.setLocation(rs.getString("location"));
                        profile.setExperience(rs.getString("experience"));
                        profile.setPincode(rs.getString("pincode"));
                        profile.setAvailable(rs.getBoolean("available"));
                        profile.setSkillArray(skills);


                        System.out.println("Labourer Profile first name =>" + profile.getFirstName());
                        return profile;

                    }, userId);
        } catch (Exception e) {
            log.error("Labourer Profile Get Error =>" + e.getMessage());
            throw new RuntimeException("profile not found:=" + e.getMessage());
        }

    }

    public List<String> getSkillsByUserId(String userId) {

        try {
            return jdbcTemplate.query("SELECT skill FROM labourer_skills where labourer_id = ?",
                    ((rs, rowNum) -> rs.getString("skill")),
                    userId);
        } catch (Exception e) {
            log.error("Labourer skill couldnt be fetched =>" + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public boolean updateAvailability(boolean nextStatus, String userId) {

        try {
            Integer row = jdbcTemplate.update("Update labourer_profile SET available = ? where labourer_id = ? ", nextStatus, userId);
            return true;
        } catch (Exception e) {
            log.error("Labourer Profile Update Error =>" + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public String getLocationByUserId(String userId) {
        System.out.println("labourer id is =" + userId);
        try {
            return jdbcTemplate.queryForObject("select location from labourer_profile where labourer_id = ?", String.class, userId);

        } catch (DataAccessException e) {
            log.error("location is not fetched =>" + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public String getNameById(String labourer_Id) {

        try{
            return jdbcTemplate.queryForObject("select firstname from labourer_profile where labourer_id = ?", String.class, labourer_Id);

        } catch (Exception e) {
            log.error("Labourer name could not fetch =>" + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
