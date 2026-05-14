package com.nexora.ai.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.nexora.ai.entity.AnalysisReport;
import com.nexora.ai.entity.MediaUpload;
import com.nexora.ai.entity.Role;
import com.nexora.ai.entity.User;
import com.nexora.ai.repository.AnalysisReportRepository;
import com.nexora.ai.repository.MediaUploadRepository;
import com.nexora.ai.repository.UserRepository;
import com.nexora.ai.service.AiAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final String UPLOAD_DIR = "uploads/";

    @Autowired
    private AiAnalysisService aiAnalysisService;

    @Autowired
    private MediaUploadRepository mediaUploadRepository;

    @Autowired
    private AnalysisReportRepository analysisReportRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/analyze")
    public ResponseEntity<?> uploadAndAnalyze(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Save file locally (In prod, this goes to S3)
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) directory.mkdirs();

            String filePath = UPLOAD_DIR + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(filePath);
            Files.write(path, file.getBytes());
            File savedFile = path.toFile();

            // Mock finding/creating a user for the demo
            User user = userRepository.findByUsername("demo_user").orElseGet(() -> {
                User newUser = User.builder()
                        .username("demo_user")
                        .email("demo@nexora.ai")
                        .password("hashed_pass")
                        .role(Role.USER)
                        .build();
                return userRepository.save(newUser);
            });

            // 2. Save MediaUpload Entity
            MediaUpload upload = MediaUpload.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .storagePath(filePath)
                    .status("ANALYZING")
                    .user(user)
                    .build();
            upload = mediaUploadRepository.save(upload);

            // 3. Call AI Microservice
            JsonNode aiResult = aiAnalysisService.analyzeMedia(savedFile);

            // 4. Save AnalysisReport Entity
            AnalysisReport report = AnalysisReport.builder()
                    .mediaUpload(upload)
                    .authenticityScore(100.0 - aiResult.get("deepfake_probability").asDouble())
                    .aiProbability(aiResult.get("deepfake_probability").asDouble())
                    .manipulationType(aiResult.get("manipulation_type").asText())
                    .confidenceScore(aiResult.get("confidence_score").asDouble())
                    .explanation(aiResult.get("explanation").asText())
                    .aiToolPrediction(aiResult.get("ai_tool_prediction").asText())
                    .visualFlags(aiResult.get("visual_flags").toString())
                    .build();
            
            analysisReportRepository.save(report);

            upload.setStatus("COMPLETED");
            mediaUploadRepository.save(upload);

            return ResponseEntity.ok(report);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("File processing failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Analysis failed: " + e.getMessage());
        }
    }
}
