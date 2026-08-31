"""
Helper script to download or export a lightweight MobileFaceNet / ArcFace ONNX model for CPU inference.
"""
import os
import sys
import urllib.request
from pathlib import Path

MODEL_DIR = Path(__file__).resolve().parent / "models"
MODEL_URL = "https://github.com/onnx/models/raw/main/validated/vision/body_analysis/arcface/model/arcfaceresnet100-8.onnx"
OUTPUT_FILE = MODEL_DIR / "w600k_mbf.onnx"

def download_model():
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    if OUTPUT_FILE.exists():
        print(f"[OK] ArcFace ONNX model already exists at: {OUTPUT_FILE}")
        return

    print(f"[INFO] Downloading lightweight ArcFace ONNX model to {OUTPUT_FILE}...")
    try:
        urllib.request.urlretrieve(MODEL_URL, OUTPUT_FILE)
        print("[SUCCESS] Model downloaded successfully.")
    except Exception as e:
        print(f"[WARNING] Automatic download failed ({e}). You can place any ArcFace/MobileFaceNet ONNX model at: {OUTPUT_FILE}")

if __name__ == "__main__":
    download_model()
