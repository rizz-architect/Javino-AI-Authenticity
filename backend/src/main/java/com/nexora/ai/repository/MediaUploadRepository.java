package com.nexora.ai.repository;

import com.nexora.ai.entity.MediaUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaUploadRepository extends JpaRepository<MediaUpload, Long> {
    List<MediaUpload> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<MediaUpload> findByStatus(String status);
}
