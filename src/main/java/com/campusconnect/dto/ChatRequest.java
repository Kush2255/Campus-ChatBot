package com.campusconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequest {
    
    @NotBlank(message = "Message is required")
    private String message;
    
    private Long sessionId;
    
    private String category;
}
