package com.campusconnect.repository;

import com.campusconnect.model.FAQ;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {
    
    Page<FAQ> findByCategory(String category, Pageable pageable);
    
    Page<FAQ> findByActive(Boolean active, Pageable pageable);
    
    List<FAQ> findByCategoryAndActiveOrderByViewCountDesc(String category, Boolean active);
    
    List<FAQ> findByActiveOrderByViewCountDesc(Boolean active);
}
