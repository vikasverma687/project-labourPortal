package com.example.job_service.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DataInit {

    @Bean
    public CommandLineRunner commandLineRunner(JdbcTemplate jdbcTemplate) {

        return args -> {

            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS job_post (" +
                    "id SERIAL PRIMARY KEY," +
                    "customerId VARCHAR NOT NULL ," +
                    "job_title TEXT NOT NULL," +
                    "category VARCHAR NOT NULL," +
                    "description TEXT," +
                    "required_skills VARCHAR NOT NULL," +
                    "location VARCHAR NOT NULL," +
                    "phoneNo VARCHAR NOT NULL," +
                    "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                    "preferred_date  DATE NOT NULL," +
                    "budget INTEGER NOT NULL," +
                    "urgency VARCHAR NOT NULL DEFAULT 'NORMAL' CHECK (urgency IN('NORMAL', 'URGENT'))," +
                    "intrested INTEGER NOT NULL DEFAULT 0,"+
                    "status VARCHAR NOT NULL DEFAULT 'OPEN' CHECK (status IN('OPEN' , 'CLOSE ')) ) ");


            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS job_application (" +
                    "id SERIAL PRIMARY KEY," +
                    "jobId Integer NOT NULL,"+
                    "labourer_id VARCHAR NOT NULL ," +
                    "labourer_name VARCHAR NOT NULL, "+
                    "message TEXT," +
                    "applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
                    "status VARCHAR NOT NULL DEFAULT 'PENDING' CHECK(status IN('PENDING' , 'ACCEPTED' , 'REJECTED' ))," +
                    " CONSTRAINTS unique_jobId_labourerId UNIQUE( jobid , labourer_id)))" );
        };
    }
}
