package com.example.authservice.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RegisterDao {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public boolean usersRegister(String role , String username, String password, String phoneNo) {

        jdbcTemplate.update("INSERT INTO users( role ,username , password, phoneNo) values(?,?,?,?) ",role , username, password, phoneNo);

        return true;

    }


}
