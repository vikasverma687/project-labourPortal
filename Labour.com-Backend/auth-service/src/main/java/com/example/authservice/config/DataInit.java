package com.example.authservice.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;


@Configuration
public class DataInit {

    @Bean
    public CommandLineRunner init(JdbcTemplate jdbcTemplate) {
        return args -> {

            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS users (" +
                    "id SERIAL PRIMARY KEY, " +
                    "role VARCHAR NOT NULL," +
                    "username VARCHAR UNIQUE NOT NULL, " +
                    "password VARCHAR NOT NULL," +
                    "phoneNo VARCHAR NOT NULL UNIQUE )");


        };

    }
}
