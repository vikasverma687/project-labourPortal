package com.example.authservice.service;

import com.example.authservice.dao.RegisterDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegisterService {

    @Autowired
    RegisterDao registerDao;

    public boolean usersRegister(String role , String username, String password, String phoneNo){

      return  registerDao.usersRegister( role ,username, password, phoneNo);

    }

}
