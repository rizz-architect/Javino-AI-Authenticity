import os
import base64
import json
import re
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import uvicorn
from groq import Groq
from PIL import Image
import io
from PIL.ExifTags import TAGS

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Media Authenticity API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client with API credentials from environment
groq_api_token = os.getenv("GROQ_TOKEN") or os.getenv("GROQ_API_KEY")
if not groq_api_token:
    raise ValueError("Groq API token not found. Set GROQ_TOKEN or GROQ_API_KEY environment variable.")
groq_client = Groq(api_key=groq_api_token)

# Vision model for actual image analysis
VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
# Text model for forensic report generation
TEXT_MODEL = "llama-3.3-70b-versatile"


class AnalysisResponse(BaseModel):
    status: str
    deepfake_probability: float
    manipulation_type: str
    confidence_score: float
    explanation: str
    ai_tool_prediction: str
    visual_flags: list[str]


# ─────────────────────────────────────────────
# LAYER 1: EXIF Metadata Forensics
# ─────────────────────────────────────────────

def analyze_exif(file_bytes: bytes) -> dict:
    """Extract and analyze EXIF metadata for authenticity signals."""
    result = {
        "has_exif": False,
        "camera_model": None,
        "camera_make": None,
        "has_datetime": False,
        "has_gps": False,
        "software": None,
        "exif_tags_count": 0,
        "score_modifier": 0,  # negative = more authentic, positive = more suspicious
        "flags": [],
    }

    try:
        image = Image.open(io.BytesIO(file_bytes))
        exif = image.getexif()

        if exif:
            result["has_exif"] = True
            result["exif_tags_count"] = len(exif)

            for tag_id, value in exif.items():
                tag = TAGS.get(tag_id, tag_id)
                if tag == "Model":
                    result["camera_model"] = str(value)
                elif tag == "Make":
                    result["camera_make"] = str(value)
                elif tag == "DateTimeOriginal" or tag == "DateTime":
                    result["has_datetime"] = True
                elif tag == "GPSInfo":
                    result["has_gps"] = True
                elif tag == "Software":
                    result["software"] = str(value)

            # Scoring: Camera hardware signatures strongly indicate authentic capture
            if result["camera_model"] and result["camera_make"]:
                result["score_modifier"] = -35  # Strong authentic signal
                result["flags"].append(f"Hardware camera verified: {result['camera_make']} {result['camera_model']}")
            elif result["camera_model"] or result["camera_make"]:
                result["score_modifier"] = -25
                result["flags"].append(f"Partial camera signature found")

            if result["has_datetime"]:
                result["score_modifier"] -= 10
                result["flags"].append("Original capture timestamp present")

            if result["has_gps"]:
                result["score_modifier"] -= 5
                result["flags"].append("GPS coordinates embedded")

            # Known AI tool software signatures
            if result["software"]:
                ai_indicators = ["stable diffusion", "midjourney", "dall-e", "comfyui", "automatic1111", "novelai"]
                sw_lower = result["software"].lower()
                if any(ind in sw_lower for ind in ai_indicators):
                    result["score_modifier"] = +40
                    result["flags"].append(f"AI generation software detected: {result['software']}")
                else:
                    result["flags"].append(f"Processing software: {result['software']}")
        else:
            # No EXIF is NEUTRAL — not proof of AI generation
            # Many legitimate images lose EXIF (screenshots, scans, social media, messaging apps)
            result["score_modifier"] = 0
            result["flags"].append("No EXIF metadata (common in scans, screenshots, and shared images)")

    except Exception:
        result["flags"].append("Unable to parse image metadata")

    return result


# ─────────────────────────────────────────────
# LAYER 2: AI Vision Analysis (THE REAL ENGINE)
# ─────────────────────────────────────────────

def analyze_with_vision(file_bytes: bytes, content_type: str) -> dict:
    """Use Groq Vision model to actually LOOK at the image for AI artifacts."""
    result = {
        "ai_probability": 50,  # neutral default
        "manipulation_type": "Inconclusive",
        "tool_prediction": "Unknown",
        "visual_flags": [],
        "raw_analysis": "",
    }

    try:
        # Encode image to base64
        base64_image = base64.b64encode(file_bytes).decode("utf-8")

        # Determine MIME type
        mime = "image/jpeg"
        if content_type:
            mime = content_type
        elif base64_image[:4] == "iVBO":
            mime = "image/png"

        # Ask the vision model to forensically analyze the image
        vision_prompt = """You are an expert forensic image analyst specializing in AI-generated image detection.

Analyze this image carefully for signs of AI generation or manipulation. Look for:

1. HANDS & FINGERS: Extra digits, fused fingers, impossible joint angles, inconsistent fingernail details
2. TEXT & WRITING: Garbled text, nonsensical characters, inconsistent fonts within same context
3. FACIAL FEATURES: Asymmetric eyes, earring mismatches, teeth irregularities, hairline artifacts
4. BACKGROUNDS: Impossible architecture, melting objects, inconsistent perspective/vanishing points
5. LIGHTING & SHADOWS: Contradictory light sources, missing shadows, shadow direction mismatch
6. TEXTURES & PATTERNS: Repetitive textures, overly smooth skin, waxy appearance, plastic-like surfaces
7. EDGES & BOUNDARIES: Blending artifacts at object boundaries, floating objects, cut-off elements
8. DOCUMENT FEATURES: For documents/IDs - check if text is consistent, fonts match, photo looks naturally embedded. NOTE: Official documents often have complex patterns; do not mistake these for AI noise.

You MUST respond in this EXACT JSON format and nothing else:
{
    "ai_probability": <number 0-100>,
    "is_ai_generated": <true or false>,
    "is_document": <true or false>,
    "manipulation_type": "<None Detected | Face Manipulation | Full Synthesis | Style Transfer | Inpainting | Document Authentic | Inconclusive>",
    "tool_prediction": "<Likely Camera/Scanner | Likely AI Tool | Ambiguous>",
    "visual_flags": ["<flag1>", "<flag2>", "<flag3>"],
    "reasoning": "<2-3 sentence reasoning>"
}

Be accurate. A real photograph or high-quality scan should get a LOW ai_probability.
Missing EXIF metadata alone does NOT mean the image is AI-generated. Scanned passports will NEVER have camera EXIF."""

        completion = groq_client.chat.completions.create(
            model=VISION_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": vision_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime};base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            temperature=0.1,
            max_completion_tokens=1024,
            response_format={"type": "json_object"},
        )

        raw_response = completion.choices[0].message.content.strip()
        result["raw_analysis"] = raw_response

        # Parse the JSON response
        parsed = json.loads(raw_response)

        result["ai_probability"] = max(0, min(100, float(parsed.get("ai_probability", 50))))
        result["is_document"] = parsed.get("is_document", False)
        result["manipulation_type"] = parsed.get("manipulation_type", "Inconclusive")
        result["tool_prediction"] = parsed.get("tool_prediction", "Unknown")
        result["visual_flags"] = parsed.get("visual_flags", [])

    except json.JSONDecodeError:
        # If JSON parsing fails, try to extract probability from raw text
        result["visual_flags"].append("Vision analysis returned non-structured response")
        result["raw_analysis"] = raw_response if 'raw_response' in dir() else "Parse error"
    except Exception as e:
        print(f"Vision Analysis Error: {e}")
        result["visual_flags"].append(f"Vision analysis unavailable: {str(e)[:100]}")

    return result


# ─────────────────────────────────────────────
# LAYER 3: Multi-Signal Fusion
# ─────────────────────────────────────────────

def fuse_scores(exif_result: dict, vision_result: dict) -> dict:
    """Combine EXIF forensics and Vision AI analysis into a final verdict."""

    # Vision analysis is primary (weight: 70%), EXIF is secondary (weight: 30%)
    vision_score = vision_result["ai_probability"]
    exif_modifier = exif_result["score_modifier"]

    # Apply EXIF modifier to vision score
    # Documents/Scans are naturally EXIF-less; we reduce suspicion if it's a document
    score_reduction = 0
    if vision_result.get("is_document", False):
        score_reduction = 15  # Document bias: trust scans more
        if exif_result["score_modifier"] == 0:
            # If it's a document and has no EXIF (typical scan), don't penalize at all
            exif_modifier = -10 

    raw_score = vision_score + (exif_modifier * 0.4) - score_reduction

    # Clamp to 0-100
    final_probability = round(max(0.0, min(100.0, raw_score)), 2)

    # Determine confidence based on signal agreement
    if vision_result.get("is_document") and final_probability < 30:
        confidence = 92.0  # High confidence for clean document scans
    elif exif_result["has_exif"] and exif_result["camera_model"]:
        if vision_score < 30:
            confidence = 95.0  # Both signals agree: authentic
        else:
            confidence = 70.0  # Signals conflict
    elif vision_score < 20 or vision_score > 80:
        confidence = 88.0  # Vision is very decisive
    else:
        confidence = 72.0  # Ambiguous zone

    # Build combined flags
    all_flags = exif_result["flags"] + vision_result["visual_flags"]

    # Determine manipulation type
    if final_probability < 25:
        manipulation = "None Detected"
    elif vision_result["manipulation_type"] != "Inconclusive":
        manipulation = vision_result["manipulation_type"]
    else:
        manipulation = "Inconclusive"

    # Determine tool prediction
    if exif_result["camera_model"] and exif_result["camera_make"]:
        tool = f"Hardware Camera ({exif_result['camera_make']} {exif_result['camera_model']})"
    elif vision_result["tool_prediction"] != "Unknown":
        tool = vision_result["tool_prediction"]
    elif final_probability < 30:
        tool = "Likely Authentic Capture Device"
    else:
        tool = "Ambiguous (Requires Further Analysis)"

    return {
        "probability": final_probability,
        "confidence": round(confidence, 2),
        "manipulation": manipulation,
        "tool": tool,
        "flags": all_flags[:6],  # cap at 6 flags for clean UI
    }


# ─────────────────────────────────────────────
# LAYER 4: Forensic Report Generation
# ─────────────────────────────────────────────

def generate_report(fused: dict, vision_raw: str) -> str:
    """Generate a professional forensic explanation using Groq text model."""
    is_authentic = fused["probability"] < 40

    prompt = f"""Act as a senior cybersecurity forensic analyst writing a brief report.

Image Analysis Results:
- AI Generation Probability: {fused['probability']}%
- Confidence Score: {fused['confidence']}%
- Manipulation Type: {fused['manipulation']}
- Origin: {fused['tool']}
- Forensic Flags: {', '.join(fused['flags'])}

Vision AI Raw Assessment: {vision_raw[:500]}

Write a 3-sentence professional forensic summary.
{"The image appears AUTHENTIC — explain why based on the evidence." if is_authentic else "The image has SUSPICIOUS indicators — explain what was detected."}
Be precise, technical, and authoritative. No introductory filler. Output the report directly."""

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=TEXT_MODEL,
            temperature=0.3,
            max_completion_tokens=300,
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Report Generation Error: {e}")
        return f"Forensic probability: {fused['probability']}%. {fused['manipulation']}. Confidence: {fused['confidence']}%."


# ─────────────────────────────────────────────
# API ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "AI Media Authenticity Engine v2.0 — Vision-Powered Analysis"}


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_media(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    file_bytes = await file.read()

    # Check file size (max 4MB for Groq vision base64)
    if len(file_bytes) > 4 * 1024 * 1024:
        # Compress the image to fit within limits
        try:
            img = Image.open(io.BytesIO(file_bytes))
            img.thumbnail((2048, 2048), Image.LANCZOS)
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=80)
            file_bytes = buffer.getvalue()
        except Exception:
            raise HTTPException(status_code=413, detail="File too large. Max 4MB for analysis.")

    # LAYER 1: EXIF Metadata Forensics
    exif_result = analyze_exif(file_bytes)

    # LAYER 2: AI Vision Analysis (actually looks at the image)
    vision_result = analyze_with_vision(file_bytes, file.content_type)

    # LAYER 3: Multi-Signal Fusion
    fused = fuse_scores(exif_result, vision_result)

    # LAYER 4: Forensic Report
    explanation = generate_report(fused, vision_result.get("raw_analysis", ""))

    return AnalysisResponse(
        status="success",
        deepfake_probability=fused["probability"],
        manipulation_type=fused["manipulation"],
        confidence_score=fused["confidence"],
        explanation=explanation,
        ai_tool_prediction=fused["tool"],
        visual_flags=fused["flags"],
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
