package com.campusconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    
    private Long id;
    private String response;
    private String category;
    private LocalDateTime timestamp;
    private Long sessionId;
}
