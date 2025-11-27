package com.campusconnect.service;

import com.campusconnect.dto.ChatRequest;
import com.campusconnect.dto.ChatResponse;
import com.campusconnect.model.ChatSession;
import com.campusconnect.model.Message;
import com.campusconnect.model.User;
import com.campusconnect.repository.ChatSessionRepository;
import com.campusconnect.repository.MessageRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final GroqService groqService;

    @Transactional
    public ChatResponse sendMessage(String email, ChatRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get or create session
        ChatSession session;
        if (request.getSessionId() != null) {
            session = chatSessionRepository.findById(request.getSessionId())
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            if (!session.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized access to session");
            }
        } else {
            session = new ChatSession();
            session.setUser(user);
            session.setCategory(request.getCategory());
            session.setTitle(generateSessionTitle(request.getMessage()));
            session = chatSessionRepository.save(session);
        }

        // Save user message
        Message userMessage = new Message();
        userMessage.setSession(session);
        userMessage.setRole(Message.Role.USER);
        userMessage.setContent(request.getMessage());
        userMessage.setCategory(request.getCategory());
        userMessage = messageRepository.save(userMessage);

        // Get conversation history
        List<Message> history = messageRepository.findBySessionOrderByTimestampAsc(session);
        List<Map<String, String>> conversationHistory = history.stream()
                .limit(10) // Last 10 messages for context
                .map(msg -> {
                    Map<String, String> msgMap = new HashMap<>();
                    msgMap.put("role", msg.getRole() == Message.Role.USER ? "user" : "assistant");
                    msgMap.put("content", msg.getContent());
                    return msgMap;
                })
                .collect(Collectors.toList());

        // Generate AI response
        String aiResponseText = groqService.generateResponse(
                request.getMessage(),
                request.getCategory(),
                conversationHistory
        );

        // Save AI response
        Message aiMessage = new Message();
        aiMessage.setSession(session);
        aiMessage.setRole(Message.Role.ASSISTANT);
        aiMessage.setContent(aiResponseText);
        aiMessage.setCategory(request.getCategory());
        aiMessage = messageRepository.save(aiMessage);

        // Update session
        session.setLastMessage(request.getMessage());
        session.setMessageCount(session.getMessageCount() + 2);
        chatSessionRepository.save(session);

        return new ChatResponse(
                aiMessage.getId(),
                aiResponseText,
                request.getCategory(),
                aiMessage.getTimestamp(),
                session.getId()
        );
    }

    public List<ChatSession> getUserSessions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return chatSessionRepository.findByUserOrderByUpdatedAtDesc(user);
    }

    public Page<ChatSession> getChatHistory(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return chatSessionRepository.findByUser(user, pageable);
    }

    public ChatSession getChatSession(String email, Long sessionId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to session");
        }

        return session;
    }

    @Transactional
    public void deleteChatSession(String email, Long sessionId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to session");
        }

        chatSessionRepository.delete(session);
    }

    @Transactional
    public void submitFeedback(String email, Long messageId, String feedback) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setFeedback(feedback);
        messageRepository.save(message);
    }

    public List<String> getSuggestedQuestions(String category) {
        List<String> suggestions = new ArrayList<>();

        if (category == null || category.isEmpty()) {
            suggestions.add("What are the admission requirements?");
            suggestions.add("Tell me about the available courses");
            suggestions.add("What is the fee structure?");
            suggestions.add("How is the placement record?");
        } else {
            switch (category.toLowerCase()) {
                case "admissions":
                    suggestions.add("What are the eligibility criteria for admission?");
                    suggestions.add("What is the admission process?");
                    suggestions.add("When do admissions open?");
                    suggestions.add("What documents are required for admission?");
                    break;
                case "courses":
                    suggestions.add("What courses are offered?");
                    suggestions.add("What is the duration of each course?");
                    suggestions.add("Are there any specializations available?");
                    suggestions.add("What is the course curriculum?");
                    break;
                case "fees":
                    suggestions.add("What is the fee structure?");
                    suggestions.add("Are there any scholarships available?");
                    suggestions.add("What are the payment options?");
                    suggestions.add("Is there any financial aid?");
                    break;
                case "placements":
                    suggestions.add("What is the placement record?");
                    suggestions.add("Which companies visit for placements?");
                    suggestions.add("What is the average package?");
                    suggestions.add("Is there placement assistance?");
                    break;
                default:
                    suggestions.add("Tell me more about " + category);
                    suggestions.add("What facilities are available?");
                    suggestions.add("How can I get more information?");
            }
        }

        return suggestions;
    }

    private String generateSessionTitle(String firstMessage) {
        if (firstMessage.length() > 50) {
            return firstMessage.substring(0, 47) + "...";
        }
        return firstMessage;
    }

    public byte[] exportChatHistory(String email, String format) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ChatSession> sessions = chatSessionRepository.findByUserOrderByUpdatedAtDesc(user);

        if ("csv".equalsIgnoreCase(format)) {
            return generateCsvExport(sessions, user);
        } else if ("pdf".equalsIgnoreCase(format)) {
            // PDF temporarily disabled to avoid external library dependency in this deployment
            throw new RuntimeException("PDF export is currently disabled. Please use CSV format.");
        } else {
            throw new RuntimeException("Unsupported export format: " + format);
        }
    }

    public byte[] exportSingleSession(String email, Long sessionId, String format) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to session");
        }

        if ("csv".equalsIgnoreCase(format)) {
            return generateSingleSessionCsvExport(session);
        } else if ("pdf".equalsIgnoreCase(format)) {
            // PDF temporarily disabled to avoid external library dependency in this deployment
            throw new RuntimeException("PDF export is currently disabled. Please use CSV format.");
        } else {
            throw new RuntimeException("Unsupported export format: " + format);
        }
    }

    // 🔹 CSV export for all sessions
    private byte[] generateCsvExport(List<ChatSession> sessions, User user) {
        StringBuilder csv = new StringBuilder();
        csv.append("Session Title,Date,Role,Message\n");

        for (ChatSession session : sessions) {
            List<Message> messages = messageRepository.findBySessionOrderByTimestampAsc(session);
            for (Message message : messages) {
                csv.append("\"").append(session.getTitle().replace("\"", "\"\"")).append("\",");
                csv.append("\"").append(message.getTimestamp()).append("\",");
                csv.append("\"").append(message.getRole()).append("\",");
                csv.append("\"").append(message.getContent().replace("\"", "\"\"")).append("\"\n");
            }
        }

        return csv.toString().getBytes();
    }

    // 🔹 CSV export for single session
    private byte[] generateSingleSessionCsvExport(ChatSession session) {
        StringBuilder csv = new StringBuilder();
        csv.append("Timestamp,Role,Message\n");

        List<Message> messages = messageRepository.findBySessionOrderByTimestampAsc(session);
        for (Message message : messages) {
            csv.append("\"").append(message.getTimestamp()).append("\",");
            csv.append("\"").append(message.getRole()).append("\",");
            csv.append("\"").append(message.getContent().replace("\"", "\"\"")).append("\"\n");
        }

        return csv.toString().getBytes();
    }
}

