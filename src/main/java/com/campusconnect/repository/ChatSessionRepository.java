package com.campusconnect.repository;

import com.campusconnect.model.ChatSession;
import com.campusconnect.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    
    List<ChatSession> findByUserOrderByUpdatedAtDesc(User user);
    
    Page<ChatSession> findByUser(User user, Pageable pageable);
    
    Page<ChatSession> findByUserAndCategory(User user, String category, Pageable pageable);
    
    Long countByUser(User user);
}
