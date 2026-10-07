package com.example.authservice.controller;

import com.example.authservice.model.LoginResponse;
import com.example.authservice.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class LoginContoller {

    @Autowired
    LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        String username = loginRequest.username();
        String password = loginRequest.password();
        System.out.println("username: " + username);
        System.out.println("password: " + password);

        LoginResponse response = loginService.findByUsername(username, password);

        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "username or password is incorrect ,or Blank"));
        }

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "successfully loggedin", "token" , response.getToken() , "userId", response.getUserId(), "role", response.getRole()));


    }

    record LoginRequest(String username, String password) {
    }


}
