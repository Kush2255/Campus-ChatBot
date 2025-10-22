package com.campusconnect.repository;

import com.campusconnect.model.RefreshToken;
import com.campusconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByToken(String token);
    
    void deleteByUser(User user);
    
    void deleteByToken(String token);
}
