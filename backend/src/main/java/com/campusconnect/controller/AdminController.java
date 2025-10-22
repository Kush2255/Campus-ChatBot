package com.campusconnect.controller;

import com.campusconnect.dto.UserDTO;
import com.campusconnect.model.FAQ;
import com.campusconnect.model.User;
import com.campusconnect.repository.FAQRepository;
import com.campusconnect.repository.MessageRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.service.GroqService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final FAQRepository faqRepository;
    private final MessageRepository messageRepository;
    private final GroqService groqService;

    // Dashboard Stats
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByActive(true));
        stats.put("totalQueries", messageRepository.count());
        stats.put("todayQueries", messageRepository.countMessagesSince(LocalDateTime.now().minusDays(1)));
        stats.put("avgResponseTime", 1.2); // Mock data
        
        return ResponseEntity.ok(stats);
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search
    ) {
        Page<User> users;
        if (search != null && !search.isEmpty()) {
            users = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    search, search, PageRequest.of(page, size)
            );
        } else {
            users = userRepository.findAll(PageRequest.of(page, size));
        }
        
        Page<UserDTO> userDTOs = users.map(UserDTO::fromUser);
        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(UserDTO.fromUser(user));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long userId,
            @RequestBody UserDTO userDTO
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userDTO.getName() != null) user.setName(userDTO.getName());
        if (userDTO.getEmail() != null) user.setEmail(userDTO.getEmail());
        if (userDTO.getPhone() != null) user.setPhone(userDTO.getPhone());
        if (userDTO.getActive() != null) user.setActive(userDTO.getActive());
        
        user = userRepository.save(user);
        return ResponseEntity.ok(UserDTO.fromUser(user));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @PatchMapping("/users/{userId}/toggle-status")
    public ResponseEntity<UserDTO> toggleUserStatus(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.getActive());
        user = userRepository.save(user);
        return ResponseEntity.ok(UserDTO.fromUser(user));
    }

    // FAQ Management
    @GetMapping("/faq")
    public ResponseEntity<Page<FAQ>> getAllFAQs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category
    ) {
        Page<FAQ> faqs;
        if (category != null && !category.isEmpty()) {
            faqs = faqRepository.findByCategory(category, PageRequest.of(page, size));
        } else {
            faqs = faqRepository.findAll(PageRequest.of(page, size));
        }
        return ResponseEntity.ok(faqs);
    }

    @PostMapping("/faq")
    public ResponseEntity<FAQ> createFAQ(@RequestBody FAQ faq) {
        faq = faqRepository.save(faq);
        return ResponseEntity.ok(faq);
    }

    @PutMapping("/faq/{faqId}")
    public ResponseEntity<FAQ> updateFAQ(@PathVariable Long faqId, @RequestBody FAQ faqData) {
        FAQ faq = faqRepository.findById(faqId)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));
        
        faq.setQuestion(faqData.getQuestion());
        faq.setAnswer(faqData.getAnswer());
        faq.setCategory(faqData.getCategory());
        faq.setActive(faqData.getActive());
        
        faq = faqRepository.save(faq);
        return ResponseEntity.ok(faq);
    }

    @DeleteMapping("/faq/{faqId}")
    public ResponseEntity<Map<String, String>> deleteFAQ(@PathVariable Long faqId) {
        faqRepository.deleteById(faqId);
        return ResponseEntity.ok(Map.of("message", "FAQ deleted successfully"));
    }

    // System Settings
    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSystemSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("systemName", "CampusConnect");
        settings.put("version", "1.0.0");
        settings.put("maintenanceMode", false);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings")
    public ResponseEntity<Map<String, String>> updateSystemSettings(@RequestBody Map<String, Object> settings) {
        // Implementation for updating system settings
        return ResponseEntity.ok(Map.of("message", "Settings updated successfully"));
    }

    // Groq API Configuration
    @PostMapping("/settings/groq/test")
    public ResponseEntity<Map<String, Object>> testGroqConnection() {
        boolean success = groqService.testConnection();
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", success ? "Connection successful" : "Connection failed");
        return ResponseEntity.ok(response);
    }

    // Analytics
    @GetMapping("/analytics/queries")
    public ResponseEntity<Map<String, Object>> getQueryAnalytics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalQueries", messageRepository.count());
        analytics.put("categoryCounts", messageRepository.countByCategory());
        return ResponseEntity.ok(analytics);
    }
}
