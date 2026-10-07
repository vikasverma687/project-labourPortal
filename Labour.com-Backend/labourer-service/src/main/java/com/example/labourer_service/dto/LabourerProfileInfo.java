package com.example.labourer_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabourerProfileInfo {

    String firstName;
    String lastName;
    String experience;
    boolean available;
    private List<String> skillArray;
    String location;
    String pincode;


}
