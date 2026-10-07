package com.example.authservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class TestController {


    @GetMapping("/testing")
    public ResponseEntity<?> testing(@RequestHeader("X-User-Role") String userRole , @RequestHeader("X-User-ID") String userId){

        return  ResponseEntity.ok().body("testing hits! and user role is =>" + userRole +" id is=>"+userId);
    }
}
