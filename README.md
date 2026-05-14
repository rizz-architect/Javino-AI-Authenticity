# 🛡️ Javino — AI Media Authenticity Engine

A forensic analysis platform that detects AI-generated media, deepfakes, and synthetic manipulations using advanced vision AI, metadata forensics, and LLM-powered analysis.

**Built by [Sriram S](https://sriram.website/)** • **Proprietary Software**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Javino** is an enterprise-grade forensic analysis platform designed to authenticate media in real-time. Using a proprietary **4-Layer Analysis Engine**, it combines:

- **EXIF Metadata Forensics** — Hardware signatures and timestamp verification
- **Vision AI Analysis** — Anatomical and artifact detection using Llama-4-Scout
- **Multi-Signal Fusion** — Weighted analysis combining metadata and vision signals
- **LLM-Powered Reports** — Human-readable verdicts via Llama-3.3-70B

The system is optimized for:
- ✅ Deepfake detection
- ✅ AI-generated image identification
- ✅ Facial manipulation forensics
- ✅ Document fraud detection (IDs, passports)
- ✅ Legal/corporate authenticity auditing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│         Javino Frontend (Next.js)                │
│    Premium Forensic Analysis Interface           │
│  (React · Tailwind · Framer Motion)              │
└─────────────────────────────────────────────────┘
                      ↓ (REST API)
┌─────────────────────────────────────────────────┐
│       Javino Backend (Spring Boot)               │
│  User Mgmt · Media Persistence · Orchestration   │
│  (Java 17 · Spring Security · JPA/Hibernate)     │
└─────────────────────────────────────────────────┘
                      ↓ (HTTP)
┌─────────────────────────────────────────────────┐
│      Javino AI Service (FastAPI)                 │
│  Forensic Vision Core · LLM Analysis             │
│  (Python · Groq · Llama Models)                  │
└─────────────────────────────────────────────────┘
```

### System Flow

1. **User uploads media** via the frontend interface
2. **Backend validates & persists** the upload, assigns analysis ID
3. **AI Service performs multi-layer analysis**:
   - Extracts and validates EXIF metadata
   - Runs Llama-4-Scout vision inspection
   - Weights signals (Vision: 70%, Metadata: 30%)
   - Generates forensic report with Llama-3.3-70B
4. **Report stored** in database and displayed in frontend
5. **User receives** verdict + detailed forensic reasoning

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **Multi-Signal Analysis** | EXIF metadata + Vision AI model fusion for robust verdicts |
| **Deepfake Forensics** | GAN artifact & facial manipulation detection |
| **Document Intelligence** | Optimized handling for IDs & passports with anti-false-positive bias |
| **Forensic Reports** | LLM-generated, human-readable summaries suitable for legal/corporate use |
| **User Authentication** | JWT-based role-based access control (RBAC) |
| **Media Persistence** | Complete audit trail of uploads and analysis results |
| **Real-Time Analysis** | Sub-second inference using Groq's high-speed LLM endpoints |
| **Professional UI** | Apple-inspired aesthetics with smooth animations |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 · React 19 · TypeScript · Tailwind CSS · Framer Motion |
| **Backend** | Spring Boot 3.2 · Java 17 · Spring Security · Spring Data JPA |
| **AI Service** | FastAPI · Python 3.10+ · Groq API (Llama-4-Scout, Llama-3.3-70B) |
| **Database** | MySQL / PostgreSQL (via JPA/Hibernate) |
| **Build Tools** | Maven (Java) · npm/yarn (Node.js) · pip (Python) |
| **Authentication** | JWT · Spring Security · RBAC |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (frontend)
- **Java 17+** & **Maven 3.6+** (backend)
- **Python 3.10+** & **pip** (AI service)
- **Groq API Key** (get one at [groq.com](https://console.groq.com))
- **MySQL 8.0+** or **PostgreSQL 12+** (database)
- **Git** for version control

### Start All Services (5 minutes)

#### 1. AI Service (Port 8000)
```bash
cd ai-service
pip install -r requirements.txt
export GROQ_API_KEY=your_groq_api_key_here  # or set in .env
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Backend (Port 8080)
```bash
cd backend
mvn clean install
# Update application.properties with DB credentials
mvn spring-boot:run
```

#### 3. Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 📂 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/SriramGandhiS/Javino-AI-Authenticity.git
cd Javino-AI-Authenticity
```

### Step 2: Backend Configuration

**Navigate to backend:**
```bash
cd backend
```

**Update `src/main/resources/application.properties`:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/javino_db
spring.datasource.username=root
spring.datasource.password=your_db_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# AI Service URL
ai.service.url=http://localhost:8000

# JWT Configuration
jwt.secret=your_jwt_secret_key_here
jwt.expiration=86400000
```

**Build and run:**
```bash
mvn clean install
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

### Step 3: AI Service Configuration

**Navigate to AI service:**
```bash
cd ai-service
```

**Create `.env` file:**
```env
GROQ_API_KEY=your_groq_api_key_here
```

**Install and run:**
```bash
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
# AI Service runs on http://localhost:8000
```

### Step 4: Frontend Configuration

**Navigate to frontend:**
```bash
cd frontend
```

**Update API endpoints (if needed) in `src/lib/utils.ts`:**
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
```

**Install and run:**
```bash
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 📁 Project Structure

```
Javino-AI-Authenticity/
├── README.md                          # This file
├── backend/                           # Spring Boot Application
│   ├── pom.xml                        # Maven configuration
│   ├── src/
│   │   └── main/
│   │       ├── java/com/nexora/ai/
│   │       │   ├── AiMediaAuthApplication.java    # Entry point
│   │       │   ├── controller/                     # REST endpoints
│   │       │   ├── service/                        # Business logic
│   │       │   ├── entity/                         # Data models
│   │       │   ├── repository/                     # Data access
│   │       │   └── config/                         # Security config
│   │       └── resources/
│   │           └── application.properties          # Configuration
│   └── README.md
├── ai-service/                        # FastAPI Python Service
│   ├── main.py                        # FastAPI application
│   ├── test_groq.py                   # Test script
│   ├── requirements.txt                # Python dependencies
│   └── README.md
└── frontend/                          # Next.js React Application
    ├── package.json                   # npm configuration
    ├── tsconfig.json                  # TypeScript config
    ├── next.config.ts                 # Next.js config
    ├── tailwind.config.js             # Tailwind CSS config
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx              # Root layout
    │   │   ├── page.tsx                # Home page
    │   │   └── globals.css             # Global styles
    │   └── lib/
    │       └── utils.ts                # Utility functions
    ├── public/                         # Static assets
    └── README.md
```

---

## 🔌 API Documentation

### Backend API Endpoints

#### Authentication
- `POST /auth/register` — User registration
- `POST /auth/login` — User login (returns JWT)

#### Media Upload & Analysis
- `POST /api/uploads` — Upload media for analysis
- `GET /api/uploads/{id}` — Retrieve upload details
- `GET /api/uploads` — List user's uploads

#### Analysis Reports
- `GET /api/reports/{id}` — Retrieve forensic report
- `POST /api/reports/batch` — Batch analysis

For detailed endpoint documentation, see [backend/README.md](./backend/README.md).

### AI Service Endpoints

- `POST /analyze` — Perform forensic analysis on image URL
- `GET /health` — Service health check

For detailed AI service documentation, see [ai-service/README.md](./ai-service/README.md).

---

## 🔧 Development

### Running Tests

**Backend Tests:**
```bash
cd backend
mvn test
```

**AI Service Tests:**
```bash
cd ai-service
python test_groq.py
```

**Frontend Tests:**
```bash
cd frontend
npm run lint
```

### Building for Production

**Backend:**
```bash
cd backend
mvn clean package -DskipTests
# JAR file created at target/ai-media-auth-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

---

## 📋 Module Breakdown

### 🧠 [AI Service](./ai-service/README.md)
The forensic vision core using Groq's Llama models:
- EXIF metadata extraction & validation
- Vision-based artifact detection (Llama-4-Scout)
- Multi-signal fusion & weighting
- Natural language report generation (Llama-3.3-70B)

### 🛡️ [Backend](./backend/README.md)
Enterprise orchestration layer:
- User authentication & RBAC
- Media upload & persistence
- Service orchestration
- Report storage & retrieval

### ✨ [Frontend](./frontend/README.md)
Premium forensic interface:
- Real-time analysis visualization
- Responsive design for mobile & desktop
- Smooth animations with Framer Motion
- Professional data presentation

---

## 🤝 Contributing

This is **proprietary software**. Unauthorized distribution, modification, or use is prohibited.

For authorized collaborators:
1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Commit changes (`git commit -m 'Add your feature'`)
3. Push to branch (`git push origin feature/your-feature`)
4. Open a Pull Request

---

## 📜 License

**Proprietary Software** — All rights reserved.

This software is not open source. Unauthorized copying, distribution, modification, or use is strictly prohibited without explicit written permission.

For licensing inquiries, contact **[Sriram S](https://sriram.website/)**.

---

## 📧 Support & Contact

- **Author**: Sriram S
- **Website**: [sriram.website](https://sriram.website/)
- **Repository**: [github.com/SriramGandhiS/Javino-AI-Authenticity](https://github.com/SriramGandhiS/Javino-AI-Authenticity)

---

## 🎯 Roadmap

- [ ] Batch analysis API for bulk uploads
- [ ] Enhanced deepfake detection algorithms
- [ ] Video forensics support
- [ ] Advanced reporting templates
- [ ] Multi-language support
- [ ] Audit logging & compliance features
- [ ] Mobile applications (iOS/Android)

---

**Last Updated:** May 2026  
**Version:** 1.0.0
