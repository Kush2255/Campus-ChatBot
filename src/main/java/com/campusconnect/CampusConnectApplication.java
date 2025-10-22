package com.campusconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CampusConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusConnectApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("🎓 CampusConnect Backend Started Successfully!");
        System.out.println("📍 Server running on: http://localhost:8080");
        System.out.println("📚 API Documentation: http://localhost:8080/api");
        System.out.println("========================================\n");
    }
}
