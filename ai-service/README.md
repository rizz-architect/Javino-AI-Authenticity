# 🧠 Javino AI Service: Forensic Vision Core

**Proprietary Software by [Sriram S](https://sriram.website/)**

The **AI Service** is the analytical heart of the Javino platform. It leverages state-of-the-art Large Multimodal Models (LMMs) and metadata forensics to provide a multi-layered verdict on media authenticity.

## 🔬 Forensic Methodology

Javino uses a proprietary **4-Layer Analysis Engine**:

1.  **Layer 1: EXIF Metadata Forensics**
    *   Scans for hardware camera signatures (Make/Model).
    *   Identifies known AI tool software signatures (Stable Diffusion, Midjourney, etc.).
    *   Verifies capture timestamps and GPS consistency.
2.  **Layer 2: AI Vision Analysis (The Engine)**
    *   Uses **Llama-4 Scout (17B)** to visually inspect images for artifacts.
    *   Detects anatomical errors (hands/fingers), garbled text, facial asymmetries, and impossible lighting.
3.  **Layer 3: Multi-Signal Fusion**
    *   Weights Vision signals (70%) against Metadata signals (30%).
    *   Applies a "Document Bias" to prevent false positives on scanned IDs/Passports.
4.  **Layer 4: Forensic Report Generation**
    *   Uses **Llama-3.3 (70B)** to translate technical flags into human-readable, authoritative reports.

## 🛠️ Technical Stack

- **Framework**: FastAPI (Python 3.10+)
- **Inference Engine**: Groq (Llama-4-Scout & Llama-3.3-70B)
- **Image Processing**: PIL (Pillow)
- **Production Server**: Uvicorn

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Groq API Key

### Installation
1.  Navigate to the directory:
    ```bash
    cd ai-service
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure environment:
    Create a `.env` file:
    ```env
    GROQ_API_KEY=your_api_key_here
    ```
4.  Run the server:
    ```bash
    python main.py
    ```

## 🔌 API Endpoints

### `POST /analyze`
Uploads a file for multi-layered forensic analysis.
- **Input**: `multipart/form-data` (file)
- **Response**: `AnalysisResponse` JSON containing probability, manipulation type, confidence, and explanation.

---
*Developed for high-security media verification environments.*
