package com.example.labourer_service.contoller;

import com.example.labourer_service.dao.LabourerProfileDao;
import com.example.labourer_service.dto.LabourerProfileInfo;
import com.example.labourer_service.service.LabourerProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/labourer")
public class LabourerProfileCreate {

    @Autowired
    LabourerProfileService labourerProfileService;

    @Autowired
    LabourerProfileDao labourerProfileDao;

    @PostMapping("/create_profile")
    public ResponseEntity<?> createLabourerProfile(@RequestBody LabourerProfileInfo labourerProfileInfo, @RequestHeader("X-User-ID") String userId, @RequestHeader("X-User-Role") String role) {

        System.out.println("userid is " + userId + "role is " + role);

        try {
            labourerProfileService.saveLabourerProfile(labourerProfileInfo, userId, role);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        try {
            labourerProfileService.saveSkillsbyUserId(userId, labourerProfileInfo.getSkillArray());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/getLabourerProfile/{userId}")
    public ResponseEntity<?> getLabourerProfile(@PathVariable("userId") String userId) {


        LabourerProfileInfo profileInfo = labourerProfileDao.getProfileById(userId);

        if (profileInfo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile Not Found");
        }

        System.out.println(profileInfo.getFirstName());

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "profile found", "data", profileInfo));

    }

    @PostMapping("update-availability/{nextStatus}/{userId}")
    public ResponseEntity<?> updateAvailabilty(@PathVariable("nextStatus") boolean nextStatus,
                                               @PathVariable("userId") String userId) {

        try {
            boolean success = labourerProfileDao.updateAvailability(nextStatus, userId);

            return ResponseEntity.status(HttpStatus.OK).body(success);
        } catch (Exception e) {

            log.error("could not update availbility => " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/getlocation/{userId}")
    public String getLocation(@PathVariable("userId") String userId) {

     String location=   labourerProfileDao.getLocationByUserId(userId);

     if(location == null){
         throw  new ResponseStatusException(HttpStatus.NOT_FOUND, "location Not Found");
     }
     return  location;
    }

    @GetMapping("/getNameById/{userId}")
    public  String getNameById(@PathVariable("userId") String userId) {


        String name = labourerProfileDao.getNameById(userId);
        if( name == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("name not found").toString();
        }
        return name;
    }
}
