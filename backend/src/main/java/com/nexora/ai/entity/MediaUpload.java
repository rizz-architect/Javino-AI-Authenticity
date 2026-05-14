package com.nexora.ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "media_uploads")
public class MediaUpload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType; // image/jpeg, video/mp4, etc.

    @Column(nullable = false)
    private Long fileSize; // in bytes

    @Column(nullable = false)
    private String storagePath; // Path where the file is saved locally or cloud URL

    @Column(nullable = false)
    private String status; // PENDING, ANALYZING, COMPLETED, FAILED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(mappedBy = "mediaUpload", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AnalysisReport analysisReport;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
