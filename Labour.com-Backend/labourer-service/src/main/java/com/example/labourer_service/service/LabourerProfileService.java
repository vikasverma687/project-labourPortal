package com.example.labourer_service.service;

import com.example.labourer_service.dao.LabourerProfileDao;
import com.example.labourer_service.dto.LabourerProfileInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LabourerProfileService {

    @Autowired
    LabourerProfileDao labourerProfileDao;

    public boolean saveLabourerProfile(LabourerProfileInfo labourerProfileInfo , String userId , String role) {

        return labourerProfileDao.saveLabourerInfo(labourerProfileInfo , userId , role);
    }

    public boolean saveSkillsbyUserId( String id,List<String>skills){

        System.out.println(skills + "from service");

        if (skills == null || skills.isEmpty()) {
            throw new RuntimeException("skills array are null or empty");
        }
     return  labourerProfileDao.saveSkillByUserID(id , skills);
    }

}
