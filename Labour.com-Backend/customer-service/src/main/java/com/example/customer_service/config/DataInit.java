package com.example.customer_service.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DataInit {

    @Bean
    public CommandLineRunner commandLineRunner(JdbcTemplate jdbcTemplate) {

        return args -> {


            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS customer_profile (" +
                    "customer_id VARCHAR NOT NULL UNIQUE, " +
                    "firstname VARCHAR  NOT NULL, " +
                    "lastname VARCHAR NOT NULL," +
                    "location VARCHAR NOT NULL ," +
                    "phoneno VARCHAR ," +
                    "pincode VARCHAR NOT NULL)"
            );
        };

    }
}
