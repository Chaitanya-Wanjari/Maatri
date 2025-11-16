# backend/hindi_app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, CrossEncoder
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import faiss, numpy as np, json, asyncio, torch, os
from functools import lru_cache

app = FastAPI(title="Hindi Maternal Health Chatbot API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# --------------------------------------------------
# Load models
# --------------------------------------------------
print("🔹 Loading multilingual bi-encoder & cross-encoder...")
bi_encoder = SentenceTransformer("./models/bi-encoder", device=DEVICE)
cross_encoder = CrossEncoder("./models/cross-encoder", device=DEVICE)

print("🔹 Loading Hindi summarization model...")
SUM_MODEL = "l3cube-pune/hindi-bart-summary"
tokenizer = AutoTokenizer.from_pretrained(SUM_MODEL, use_fast=False)
gen_model = AutoModelForSeq2SeqLM.from_pretrained(SUM_MODEL).to(DEVICE)

# --------------------------------------------------
# Load FAISS + metadata
# --------------------------------------------------
INDEX_PATH = "./embeddings/merged_corpus_faiss.index"
META_PATH = "./embeddings/merged_corpus_meta.json"

print("🔹 Loading FAISS index & metadata...")
index = faiss.read_index(INDEX_PATH)
with open(META_PATH, "r", encoding="utf-8") as f:
    corpus_meta = json.load(f)
print(f"✅ Loaded {index.ntotal} vectors & {len(corpus_meta)} metadata entries")

# --------------------------------------------------
# Retrieval & Reranking
# --------------------------------------------------
def retrieve_topk(query: str, top_k: int = 25):
    q_emb = bi_encoder.encode([f"query: {query}"], normalize_embeddings=True, convert_to_numpy=True)
    scores, ids = index.search(q_emb, top_k)
    out = []
    for s, i in zip(scores[0], ids[0]):
        if i < 0:
            continue
        meta = corpus_meta[int(i)]
        out.append({"score": float(s), **meta})
    return out

def rerank_with_ce(query: str, candidates, final_k: int = 5):
    pairs = [[query, c["text"]] for c in candidates]
    ce_scores = cross_encoder.predict(pairs)
    for i, s in enumerate(ce_scores):
        candidates[i]["ce_score"] = float(s)
    candidates.sort(key=lambda x: x["ce_score"], reverse=True)
    seen, result = set(), []
    for c in candidates:
        if c["text"] not in seen:
            seen.add(c["text"])
            result.append(c)
        if len(result) >= final_k:
            break
    return result

# --------------------------------------------------
# Summarization
# --------------------------------------------------
def build_prompt(contexts):
    joined = "\n".join(contexts)
    return f"निम्नलिखित जानकारी पढ़ें और एक संक्षिप्त सारांश लिखें:\n{joined}\n\nसारांश:"

def wrap_polite(summary):
    return f"आपके प्रश्न का उत्तर इस प्रकार है:\n{summary}\nआशा है यह जानकारी आपके लिए उपयोगी होगी।"

@lru_cache(maxsize=256)
def summarize_with_bart(prompt):
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1024).to(DEVICE)
    inputs.pop("token_type_ids", None)
    outputs = gen_model.generate(**inputs, max_new_tokens=256, min_length=50, num_beams=4, do_sample=False)
    return tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

async def generate_summary(query, docs):
    contexts = [d["text"][:600] for d in docs[:5]]
    prompt = build_prompt(contexts)
    summary = await asyncio.to_thread(summarize_with_bart, prompt)
    return wrap_polite(summary)

# --------------------------------------------------
# API Routes
# --------------------------------------------------
class Query(BaseModel):
    question: str

@app.post("/ask")
async def ask_hindi(req: Query):
    query = req.question.strip()
    retrieved = retrieve_topk(query)
    reranked = rerank_with_ce(query, retrieved)
    summary = await generate_summary(query, reranked)
    disclaimer = (
        "⚠️ यह जानकारी केवल शैक्षिक उद्देश्यों के लिए है। "
        "कृपया किसी योग्य स्वास्थ्य विशेषज्ञ से सलाह लें।"
    )
    return {"answer": summary, "sources": reranked, "disclaimer": disclaimer}

@app.get("/")
def root():
    return {"message": "Hindi Maternal Health Chatbot API is running ✅"}
