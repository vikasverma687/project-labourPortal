package com.example.authservice.service;

import com.example.authservice.dao.LoginDao;
import com.example.authservice.model.LoginResponse;
import com.example.authservice.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class LoginService {

    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor("your-256-bit-secret-key-here-must-be-long-enough".getBytes(StandardCharsets.UTF_8));
    private final int EXPIRATION_MS  = 7200*1000 ;
    @Autowired
    LoginDao loginDao;

    public LoginResponse findByUsername(String username , String password ){

        if(username == null || password == null ){
            System.out.println("username or password is blank");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username or password is blank");
        }
        User user =  loginDao.findByUsername(username , password);

        if(user == null){
            return   null;
        }

        String token = generateToke(user);
        return new LoginResponse(token , user.getUserId() ,user.getUsername() , user.getRole());
    }

    private  String generateToke(User user){

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role" , user.getRole())
                .claim("userId", user.getUserId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+ EXPIRATION_MS) )
                .signWith(SECRET_KEY)
                .compact();

    }
}
