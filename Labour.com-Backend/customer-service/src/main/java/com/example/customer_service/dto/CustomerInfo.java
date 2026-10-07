package com.example.customer_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomerInfo {

    String firstName;
    String lastName;
    String location;
    String pincode;
    String phone;
}
