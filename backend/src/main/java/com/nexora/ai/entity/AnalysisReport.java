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
@Table(name = "analysis_reports")
public class AnalysisReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "upload_id", nullable = false)
    private MediaUpload mediaUpload;

    @Column(nullable = false)
    private Double authenticityScore; // Overall score (0-100)

    @Column(nullable = false)
    private Double aiProbability; // Likelihood of being AI generated (0-100)

    @Column(length = 255)
    private String manipulationType; // e.g., "Generative Inpainting", "Face Swap"

    @Column(nullable = false)
    private Double confidenceScore;

    @Column(columnDefinition = "TEXT")
    private String explanation; // Groq generated human-readable reason

    @Column(length = 255)
    private String aiToolPrediction; // e.g., "Midjourney v6"

    @Column(columnDefinition = "JSON")
    private String visualFlags; // JSON array of string flags

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
