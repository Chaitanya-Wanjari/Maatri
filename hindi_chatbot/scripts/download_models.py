# scripts/download_models.py
import os
from sentence_transformers import SentenceTransformer, CrossEncoder

# Define paths
MODELS_DIR = "./models"
os.makedirs(MODELS_DIR, exist_ok=True)

BI_ENCODER = "intfloat/multilingual-e5-base"
CROSS_ENCODER = "cross-encoder/mmarco-mMiniLMv2-L12-H384-v1"

print("⏳ Downloading Bi-Encoder:", BI_ENCODER)
biencoder = SentenceTransformer(BI_ENCODER)
biencoder.save(os.path.join(MODELS_DIR, "bi-encoder"))
print("✅ Saved Bi-Encoder at", os.path.join(MODELS_DIR, "bi-encoder"))

print("⏳ Downloading Cross-Encoder:", CROSS_ENCODER)
crossencoder = CrossEncoder(CROSS_ENCODER)
crossencoder.save(os.path.join(MODELS_DIR, "cross-encoder"))
print("✅ Saved Cross-Encoder at", os.path.join(MODELS_DIR, "cross-encoder"))
