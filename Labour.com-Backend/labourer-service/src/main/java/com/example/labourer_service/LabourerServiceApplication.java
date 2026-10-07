package com.example.labourer_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class LabourerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LabourerServiceApplication.class, args);
	}

}
