package com.example.authservice.dao;

import com.example.authservice.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class LoginDao {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public User findByUsername(String username, String password) {

        try {

            return jdbcTemplate.queryForObject("SELECT * FROM users WHERE username =? AND password = ? ",

                    (rs, Rownum) -> new User(rs.getInt("id"),
                            rs.getString("username"),
                            rs.getString("password"),
                            rs.getString("role"))
                    , username, password);

        } catch (EmptyResultDataAccessException ep) {

            log.error("user doesnt exist, invalid username or password, LoginDao" +ep.getMessage());
            return null;
        } catch (DataAccessException e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }

    }
}
