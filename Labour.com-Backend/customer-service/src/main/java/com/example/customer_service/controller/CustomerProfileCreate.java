package com.example.customer_service.controller;

import com.example.customer_service.dao.CustomerProfileDao;
import com.example.customer_service.dto.CustomerInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RequestMapping("/api/customer")
@RestController
public class CustomerProfileCreate {


    @Autowired
    CustomerProfileDao customerProfileDao;

    @PostMapping("/create-profile")
    public void customerProfileCreate(@RequestBody CustomerInfo customerInfo ,
                                      @RequestHeader("X-User-ID") String userId,
                                      @RequestHeader("X-User-Role") String role) {

        System.out.println( "hitting");
        String firstName = customerInfo.getFirstName();
        String lastName = customerInfo.getLastName();
        String location = customerInfo.getLocation();

        System.out.println("firstName: " + firstName);
        System.out.println("lastName: " + lastName);
        System.out.println("location: " + location);

        System.out.println("phone: " + customerInfo.getPhone());
            try {
                customerProfileDao.saveCustomerInfo(customerInfo, userId, role);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
    }

    @GetMapping("/getCustomerProfile/{customerId}")
    public ResponseEntity<?> getCustomerProfile(@PathVariable("customerId") String customerId){

        System.out.println("hitting customer profile controller");

      CustomerInfo profile =  customerProfileDao.getProfileById(customerId);

        if(profile == null){

            throw  new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer Profile Not Found");
        }

        return ResponseEntity.status(HttpStatus.OK).body(Map.of( "profile" , profile ,"message" , "customer profile fetched"));

    }
}
