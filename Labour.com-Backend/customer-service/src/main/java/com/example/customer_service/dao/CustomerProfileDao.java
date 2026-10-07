package com.example.customer_service.dao;

import com.example.customer_service.dto.CustomerInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
public class CustomerProfileDao {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public boolean saveCustomerInfo(CustomerInfo customerInfo, String userId, String role) {

        Integer col = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM customer_profile where customer_id = ?", Integer.class, userId);

        if (col !=  0) {
            System.out.println("update profile function hitting");
            return updateProfile(customerInfo, userId);
        } else {

            String firstName = customerInfo.getFirstName();
            String lastName = customerInfo.getLastName();
            String location = customerInfo.getLocation();
            String phone = customerInfo.getPhone();
            String pincode = customerInfo.getPincode();

            try {
                Integer row = jdbcTemplate.update("INSERT INTO customer_profile( customer_id , firstname, lastname, location,  phoneno , pincode) values(?,?,?,?,?,?)"
                        , userId, firstName, lastName, location, phone, pincode);

                if (row <= 0) {
                    return false;
                }
                return true;
            } catch (Exception e) {

                log.error("customer Profile Save Error =>" + e.getMessage());
                throw new RuntimeException(e);
            }
        }

    }

    private boolean updateProfile(CustomerInfo customerInfo, String userId) {

        try {
            jdbcTemplate.update("UPDATE customer_profile SET firstname = ?, lastname = ?, location = ?, phoneno = ? , pincode = ?   WHERE customer_id = ?",
                    customerInfo.getFirstName(),
                    customerInfo.getLastName(),
                    customerInfo.getLocation(),
                    customerInfo.getPhone(),
                    customerInfo.getPincode(),
                    userId);
            return true;
        } catch (Exception e) {
            log.error("customer Profile Update Error =>" + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public CustomerInfo getProfileById(String customerId) {

        try {

            return jdbcTemplate.queryForObject("SELECT * FROM customer_profile WHERE customer_id =?",
                    (rs, rowNum) -> {
                        CustomerInfo profile = new CustomerInfo();

                        profile.setFirstName(rs.getString("firstname"));
                        profile.setLastName(rs.getString("lastname"));
                        profile.setLocation(rs.getString("location"));
                        profile.setPincode(rs.getString("pincode"));
                        profile.setPhone(rs.getString("phoneno"));


                        System.out.println("customer Profile first name =>" + profile.getFirstName());
                        return profile;

                    }, customerId );
        } catch (Exception e) {
            log.error("Customer Profile Get Error =>" + e.getMessage());
            throw new RuntimeException("profile not found:=" + e.getMessage());
        }

    }
}
