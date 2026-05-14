package com.nexora.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiMediaAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiMediaAuthApplication.class, args);
        System.out.println("🛡️ AI Media Authenticity Platform - Backend Started Successfully");
    }

}
