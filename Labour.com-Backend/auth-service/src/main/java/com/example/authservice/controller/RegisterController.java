package com.example.authservice.controller;

import com.example.authservice.dto.RegisterDto;
import com.example.authservice.service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/auth")
@RestController
public class RegisterController {


    @Autowired
    RegisterService registerService;

    @PostMapping("/register")
    public ResponseEntity<?> labourerRegister(@RequestBody RegisterDto registerDto) {

        String username = registerDto.getUsername();
        String password = registerDto.getPassword();
        String phoneNo = registerDto.getPhoneNo();
        String role = registerDto.getRole();

            try {
                registerService.usersRegister(role ,username, password, phoneNo);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());
            }


        System.out.println("Role is =====> " + role);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "registration successful"));

    }
}
