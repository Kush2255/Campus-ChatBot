package com.campusconnect.repository;

import com.campusconnect.model.ChatSession;
import com.campusconnect.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findBySessionOrderByTimestampAsc(ChatSession session);
    
    Long countBySessionAndRole(ChatSession session, Message.Role role);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.timestamp >= :startDate")
    Long countMessagesSince(LocalDateTime startDate);
    
    @Query("SELECT m.category, COUNT(m) FROM Message m WHERE m.category IS NOT NULL GROUP BY m.category")
    List<Object[]> countByCategory();
}
