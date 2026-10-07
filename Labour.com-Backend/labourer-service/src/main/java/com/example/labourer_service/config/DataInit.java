package com.example.labourer_service.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DataInit {

    @Bean
    public CommandLineRunner commandLineRunner(JdbcTemplate jdbcTemplate) {

        return args -> {


            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS labourer_profile (" +
                    "labourer_id VARCHAR NOT NULL UNIQUE, " +
                    "role VARCHAR NOT NULL," +
                    "firstName VARCHAR  NOT NULL, " +
                    "lastName VARCHAR NOT NULL," +
                    "location VARCHAR NOT NULL ," +
                    "experience VARCHAR NOT NULL," +
                    "pincode VARCHAR NOT NULL)"
            );

            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS labourer_skills (" +
                    "labourer_id VARCHAR NOT NULL  , " +
                    "skill VARCHAR NOT NULL)"
            );



        };
    }

    ;
}




