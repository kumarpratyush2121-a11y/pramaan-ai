# PramaanAI (प्रमाण AI) — National Forensic Document Verification & Biometric Screening Platform

> **Smart India Hackathon (SIH) 2026 Problem Statement ID: 21688**  
> **Category:** AI-Powered Fake Identity & Document Screening System  
> **Compliance:** GIGW 3.0 (Guidelines for Indian Government Websites) & Digital India Standards

---

## 🌟 Overview

**PramaanAI** is an advanced Government of India cyber-forensics platform engineered to detect forged, tampered, spliced, and counterfeit Indian identity documents (**Aadhaar, PAN, Voter ID, Passport, Driving License**) using a fused multi-signal forensic vision and biometric intelligence pipeline.

Built to run **100% client-side** for instantaneous deployment on **Netlify Drop**, while also providing an **ArcFace / MobileFaceNet ONNX CPU backend**.

---

## 🚀 Key Features

1. **Official Gov.in Design System**:
   - National Tricolor bar, Ashoka Lion Capital Emblem (*Satyameva Jayate*), animated 24-spoke Ashok Chakra emblem.
   - Hon'ble Prime Minister Narendra Modi's Digital Sovereignty & Forensics Vision section.
   - Bilingual support (**English / हिन्दी**) with instant translation across all views.
   - GIGW Accessibility Suite (Font resizer, High Contrast Mode, Light/Dark themes, Live IST clock).

2. **Real-Time Error Level Analysis (ELA) Engine**:
   - In-browser HTML5 Canvas JPEG quantization difference computation.
   - Dynamic Thermal / Jet Heatmap overlay with opacity and sensitivity sliders.
   - Automated anomaly clustering and bounding box generation around spliced text (e.g. altered DOB or names).

3. **Biometric Face Matching & Live Authentication**:
   - Lightweight normalized deep spatial feature embeddings with Cosine Distance.
   - Preserves exact API response contract:
     ```json
     {
       "similarity_score": 0.94,
       "face_detected_on_id": true,
       "face_detected_on_reference": true
     }
     ```
   - **Graceful Fallback**: Returns `face_detected_on_* = false` gracefully when no face is found, preventing server/client crashes.
   - Live WebCam capture with real-time biometric alignment.

4. **Algorithmic Checksums & Document Validators**:
   - **Aadhaar**: Real Dihedral Group $D_5$ Verhoeff Algorithm multiplication & permutation validator.
   - **PAN**: Regex + 4th character entity type decoder (`P` = Individual, `C` = Company, `F` = Firm, etc.) + 5th character last-name check.
   - **Voter ID (EPIC)**: Standard 3-Alpha + 7-Numeric format validator.
   - **Driving License**: MoRTH standard state & RTO code parser.
   - **Passport**: ICAO 9303 MRZ $[7, 3, 1]$ modulo-10 check-digit verification.

5. **DigiLocker Direct Connect Gateway**:
   - Simulated direct eKYC integration with UIDAI, Income Tax Department, and MoRTH repositories.
   - Authentic XML digital signature inspection and SHA-256 certificate thumbprints.

6. **Multi-Document Persona Cross-Verification**:
   - Correlates multiple identity cards for the same citizen (Aadhaar + PAN + Voter ID + DL).
   - Generates Cross-Verification Consistency Matrix and Persona Trust Rating.

7. **Forensic Rulebook & Authenticity Matrix**:
   - Interactive mathematical calculators (Live Verhoeff tester, PAN entity decoder).
   - Educational breakdown of ELA physics, Laplacian edge gradients, and microprint security.

8. **Official PDF Certificate Exporter**:
   - Generates official bilingual Forensic Examination Certificates with National Seal, SHA-256 integrity hash, QR code, and officer sign-off.

---

## 📦 How to Deploy to Netlify Drop in 10 Seconds

1. Open [https://app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
2. Drag and drop the folder `C:\Users\Pratyush\.gemini\antigravity-ide\scratch\pramaan-ai` directly onto the Netlify Drop page.
3. Your site is instantly live on a custom `.netlify.app` domain with 100% working client-side computer vision, ELA heatmaps, and biometric matching!

---

## 💻 Running Locally

```bash
# Option 1: Using Python built-in HTTP server
cd C:\Users\Pratyush\.gemini\antigravity-ide\scratch\pramaan-ai
python -m http.server 3000
# Open http://localhost:3000 in your browser

# Option 2: Using Node.js npx serve
npx serve .
```

---

## 🐍 Backend ArcFace ONNX Module (Optional for Python API)

The backend directory contains:
- `backend/face_matcher_onnx.py`: Drop-in replacement for ForensiX-AI's face matcher using ONNXRuntime CPU inference with graceful fallbacks.
- `backend/export_onnx_model.py`: Script to download/export lightweight ArcFace models.

---

## 🏆 SIH-21688 Pitch Flow (3-Minute Demonstration)

1. **Clean Aadhaar Test**: Click `🟢 1. Clean Aadhaar (Genuine)` → Fused Trust Score shows **95% (Genuine)**, Verhoeff checksum verified, 0 ELA splice hotspots.
2. **Tampered DOB Test**: Click `🔴 2. Tampered DOB PAN (Spliced)` → ELA Heatmap immediately illuminates the spliced `15/08/1999` patch in bright red with an anomaly bounding box. Trust score drops to **34% (Counterfeit / Tampered)**.
3. **WhatsApp Degradation Test**: Click `🟡 3. WhatsApp Degraded ID` → Shows amber advisory banner explaining multi-generation compression artifacts without false-flagging tampering.
4. **Biometric Impersonator Test**: Click `🟣 4. Mismatched Impersonator` → Face similarity drops to **18%**, flagging biometric identity mismatch.
5. **DigiLocker Portal**: Switch to `🔒 DigiLocker Direct Connect`, click Authenticate with OTP `123456`, and inspect cryptographically verified XML documents.
6. **Certificate Export**: Click `🖨️ Export Official Forensic Certificate (PDF)` to generate an official Government of India examination report.
