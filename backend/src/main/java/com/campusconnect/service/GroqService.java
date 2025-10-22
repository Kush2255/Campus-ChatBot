package com.campusconnect.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    @Value("${groq.temperature}")
    private double temperature;

    @Value("${groq.max.tokens}")
    private int maxTokens;

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    public String generateResponse(String userMessage, String category, List<Map<String, String>> conversationHistory) {
        try {
            WebClient webClient = webClientBuilder.build();

            // Build messages array
            List<Map<String, String>> messages = new ArrayList<>();
            
            // System message with context
            String systemMessage = buildSystemMessage(category);
            messages.add(Map.of("role", "system", "content", systemMessage));
            
            // Add conversation history
            if (conversationHistory != null && !conversationHistory.isEmpty()) {
                messages.addAll(conversationHistory);
            }
            
            // Add current user message
            messages.add(Map.of("role", "user", "content", userMessage));

            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", messages);
            requestBody.put("temperature", temperature);
            requestBody.put("max_tokens", maxTokens);

            // Make API call
            String response = webClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                            .map(errorBody -> {
                                log.error("Groq API error response: {}", errorBody);
                                return new RuntimeException("Groq API error: " + errorBody);
                            })
                    )
                    .bodyToMono(String.class)
                    .block();

            // Parse response
            JsonNode jsonResponse = objectMapper.readTree(response);
            String aiResponse = jsonResponse.get("choices").get(0).get("message").get("content").asText();

            log.info("Groq API response generated successfully");
            return aiResponse;

        } catch (Exception e) {
            log.error("Error calling Groq API: {}", e.getMessage(), e);
            return "I apologize, but I'm having trouble processing your request right now. Please try again later or contact support if the issue persists.";
        }
    }

    private String buildSystemMessage(String category) {
        StringBuilder systemMessage = new StringBuilder();
        systemMessage.append("You are CampusConnect AI, an intelligent and helpful assistant for IARE (Institute of Aeronautical Engineering), Hyderabad. ");
        systemMessage.append("Your role is to provide accurate, friendly, and comprehensive information specifically about IARE college. ");
        
        systemMessage.append("\n\n### About IARE:\n");
        systemMessage.append("- **Full Name**: Institute of Aeronautical Engineering (IARE)\n");
        systemMessage.append("- **Location**: Dundigal, Hyderabad - 500043, Telangana, India\n");
        systemMessage.append("- **Established**: Year 2000\n");
        systemMessage.append("- **Type**: Private Autonomous Engineering College\n");
        systemMessage.append("- **Approvals**: AICTE approved, Affiliated to JNTUH\n");
        systemMessage.append("- **Accreditation**: NAAC A++ Grade, NBA accredited programs\n");
        systemMessage.append("- **NIRF Ranking**: 159 in Engineering category (2021)\n");
        
        systemMessage.append("\n\n### B.Tech Courses Offered:\n");
        systemMessage.append("1. Computer Science and Engineering (CSE)\n");
        systemMessage.append("2. CSE (Artificial Intelligence and Machine Learning)\n");
        systemMessage.append("3. CSE (Data Science)\n");
        systemMessage.append("4. Information Technology\n");
        systemMessage.append("5. Aeronautical Engineering\n");
        systemMessage.append("6. Electronics and Communication Engineering (ECE)\n");
        systemMessage.append("7. Electrical and Electronics Engineering (EEE)\n");
        systemMessage.append("8. Mechanical Engineering\n");
        systemMessage.append("9. Civil Engineering\n");
        
        systemMessage.append("\n\n### Fee Structure:\n");
        systemMessage.append("- B.Tech: Rs. 1,01,000/- per year\n");
        systemMessage.append("- M.Tech: Rs. 60,000/- per year\n");
        systemMessage.append("- MBA: Rs. 45,000/- per year\n");
        systemMessage.append("- Payment deadline: Before 10th June every year\n");
        
        systemMessage.append("\n\n### Placements:\n");
        systemMessage.append("- Highest Package: Rs. 51 LPA (2024)\n");
        systemMessage.append("- Average Package: Rs. 10 LPA\n");
        systemMessage.append("- Placement Rate: 91%+\n");
        systemMessage.append("- Top Recruiters: Microsoft, Amazon, JPMorgan Chase, Rubrik, Juspay, Zscaler, Amadeus, Deloitte, DeltaX, EPAM, DBS, IBM, Accenture, Cognizant, Capgemini, LTIMindtree, Virtusa, Infosys, Wipro, TCS, Tech Mahindra, etc.\n");
        
        systemMessage.append("\n\n### Contact Information:\n");
        systemMessage.append("- Phone: +91 91546 78975, +91 91546 78976, 040-29705852/53/54\n");
        systemMessage.append("- Admissions: Dr. J Suresh Goud - 9966239198\n");
        systemMessage.append("- Website: www.iare.ac.in\n");
        
        systemMessage.append("\n\n### Guidelines:\n");
        systemMessage.append("- Be professional yet conversational\n");
        systemMessage.append("- Provide detailed, accurate information specific to IARE\n");
        systemMessage.append("- If a request is not about IARE, explicitly state that you are limited to IARE information and invite the user to ask something related to IARE\n");
        systemMessage.append("- Do not discuss or compare other colleges, universities, or institutions under any circumstances\n");
        systemMessage.append("- If you don't know specific IARE details, suggest contacting the admissions office or official channels\n");
        systemMessage.append("- Use bullet points and formatting for better readability\n");
        systemMessage.append("- Be encouraging and supportive to prospective students\n");
        systemMessage.append("- Highlight IARE's strengths: NAAC A++ grade, strong placements, industry partnerships\n");

        if (category != null && !category.isEmpty()) {
            systemMessage.append("\n\nCurrent topic focus: ").append(category);
            systemMessage.append("\nProvide information specifically about IARE's ").append(category).append(".");
        }

        return systemMessage.toString();
    }

    public boolean testConnection() {
        try {
            WebClient webClient = webClientBuilder.build();
            
            List<Map<String, String>> messages = List.of(
                Map.of("role", "user", "content", "Hello")
            );

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 10);

            String response = webClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return response != null && !response.isEmpty();
        } catch (Exception e) {
            log.error("Groq API connection test failed: {}", e.getMessage());
            return false;
        }
    }
}
