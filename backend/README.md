# 🛡️ Javino Backend: Enterprise Orchestration Layer

**Proprietary Software by [Sriram S](https://sriram.website/)**

The **Javino Backend** is a robust Spring Boot application that orchestrates the media authenticity workflow, manages user data, and persists forensic analysis reports.

## 🏗️ Architecture & Features

- **User Management**: Secure authentication and role-based access control (RBAC).
- **Media Persistence**: Tracking media uploads and linking them to forensic verdicts.
- **Service Orchestration**: Communicates with the `ai-service` (Python/FastAPI) to trigger deepfake analysis.
- **Reporting Engine**: Persists and retrieves detailed forensic analysis reports for legal or corporate auditing.

## 🛠️ Technical Stack

- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Security**: Spring Security (JWT-ready)
- **Database**: JPA / Hibernate (compatible with PostgreSQL/MySQL)
- **Build Tool**: Maven

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Maven 3.6+
- Running instance of `ai-service`

### Installation
1.  Navigate to the directory:
    ```bash
    cd backend
    ```
2.  Install dependencies and build:
    ```bash
    mvn clean install
    ```
3.  Configuration:
    Update `src/main/resources/application.properties` with your database and AI service credentials.
4.  Run the application:
    ```bash
    mvn spring-boot:run
    ```

## 📂 Project Structure

- `com.nexora.ai.controller`: REST API endpoints for upload and analysis management.
- `com.nexora.ai.service`: Business logic for AI service orchestration.
- `com.nexora.ai.entity`: Data models for Users, Uploads, and Reports.
- `com.nexora.ai.repository`: Data access layer for persistence.

---
*Ensuring the integrity of the digital narrative through enterprise-grade forensics.*
