package com.campusconnect.controller;

import com.campusconnect.dto.ChatRequest;
import com.campusconnect.dto.ChatResponse;
import com.campusconnect.model.ChatSession;
import com.campusconnect.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(
            Authentication authentication,
            @Valid @RequestBody ChatRequest request
    ) {
        ChatResponse response = chatService.sendMessage(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSession>> getUserSessions(Authentication authentication) {
        List<ChatSession> sessions = chatService.getUserSessions(authentication.getName());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/history")
    public ResponseEntity<Page<ChatSession>> getChatHistory(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<ChatSession> history = chatService.getChatHistory(
                authentication.getName(),
                PageRequest.of(page, size)
        );
        return ResponseEntity.ok(history);
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ChatSession> getChatSession(
            Authentication authentication,
            @PathVariable Long sessionId
    ) {
        ChatSession session = chatService.getChatSession(authentication.getName(), sessionId);
        return ResponseEntity.ok(session);
    }

    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Map<String, String>> deleteChatSession(
            Authentication authentication,
            @PathVariable Long sessionId
    ) {
        chatService.deleteChatSession(authentication.getName(), sessionId);
        return ResponseEntity.ok(Map.of("message", "Session deleted successfully"));
    }

    @PostMapping("/feedback")
    public ResponseEntity<Map<String, String>> submitFeedback(
            Authentication authentication,
            @RequestBody Map<String, Object> request
    ) {
        Long messageId = Long.valueOf(request.get("messageId").toString());
        String feedback = request.get("feedback").toString();
        
        chatService.submitFeedback(authentication.getName(), messageId, feedback);
        return ResponseEntity.ok(Map.of("message", "Feedback submitted successfully"));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestedQuestions(
            @RequestParam(required = false) String category
    ) {
        List<String> suggestions = chatService.getSuggestedQuestions(category);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = List.of(
                "Admissions",
                "Courses",
                "Fees",
                "Placements",
                "Campus Life",
                "Faculty",
                "Events",
                "Facilities"
        );
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportChatHistory(
            Authentication authentication,
            @RequestParam(defaultValue = "pdf") String format
    ) {
        byte[] exportData = chatService.exportChatHistory(authentication.getName(), format);
        
        String contentType;
        String filename;
        
        if ("pdf".equalsIgnoreCase(format)) {
            contentType = "application/pdf";
            filename = "chat-history.pdf";
        } else {
            contentType = "text/csv";
            filename = "chat-history.csv";
        }
        
        return ResponseEntity.ok()
                .header("Content-Type", contentType)
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .body(exportData);
    }

    @GetMapping("/session/{sessionId}/export")
    public ResponseEntity<byte[]> exportSingleSession(
            Authentication authentication,
            @PathVariable Long sessionId,
            @RequestParam(defaultValue = "pdf") String format
    ) {
        byte[] exportData = chatService.exportSingleSession(authentication.getName(), sessionId, format);
        
        String contentType;
        String filename;
        
        if ("pdf".equalsIgnoreCase(format)) {
            contentType = "application/pdf";
            filename = "conversation-" + sessionId + ".pdf";
        } else {
            contentType = "text/csv";
            filename = "conversation-" + sessionId + ".csv";
        }
        
        return ResponseEntity.ok()
                .header("Content-Type", contentType)
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .body(exportData);
    }
}
