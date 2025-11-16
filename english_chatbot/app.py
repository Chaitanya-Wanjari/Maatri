from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, CrossEncoder
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import faiss, numpy as np, json, os, asyncio
from functools import lru_cache

app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Load Models --------------------
print("🔹 Loading models...")

encoder = SentenceTransformer("multi-qa-mpnet-base-dot-v1")
cross_encoder = CrossEncoder("./models/fine_tuned_cross_encoder")

gen_tokenizer = AutoTokenizer.from_pretrained("./models/gemma-2b-it")
gen_model = AutoModelForCausalLM.from_pretrained(
    "./models/gemma-2b-it", device_map="auto", torch_dtype="auto"
)
chat_pipe = pipeline(
    "text-generation",
    model=gen_model,
    tokenizer=gen_tokenizer,
    device_map="auto"
)

# -------------------- Load FAISS Indexes --------------------
def load_index(name, path="./models/english"):
    index = faiss.read_index(os.path.join(path, f"{name}.faiss"))
    embs = np.load(os.path.join(path, f"{name}_emb.npy"))
    with open(os.path.join(path, f"{name}_texts.json"), "r", encoding="utf-8") as f:
        texts = json.load(f)
    return index, texts, embs

qa_index, qa_texts, _ = load_index("qa_index")
article_index, article_texts, _ = load_index("doc")
book_index, book_texts, _ = load_index("bookwho")

# -------------------- Intent Classification --------------------
def classify_intent(query: str):
    q = query.lower()
    if any(w in q for w in ["eat", "food", "diet", "nutrition"]):
        return "diet"
    if any(w in q for w in ["pain", "symptom", "nausea", "vomit"]):
        return "symptom"
    if any(w in q for w in ["exercise", "yoga", "workout"]):
        return "exercise"
    if any(w in q for w in ["risk", "safe", "complication"]):
        return "risk"
    return "general"

# -------------------- Retrieval --------------------
def hybrid_retrieve(query: str, top_k=5):
    q_emb = encoder.encode([query], convert_to_numpy=True, normalize_embeddings=True)
    results = []

    for index, texts, source in [
        (qa_index, qa_texts, "qa"),
        (article_index, article_texts, "article"),
        (book_index, book_texts, "book"),
    ]:
        scores, ids = index.search(q_emb, top_k * 3)
        for i, idx in enumerate(ids[0]):
            results.append(
                {"text": texts[idx], "source": source, "dense": float(scores[0][i])}
            )

    # Limit reranking candidates to top 15
    results = sorted(results, key=lambda x: x["dense"], reverse=True)[:15]
    pairs = [(query, r["text"]) for r in results]
    rerank_scores = cross_encoder.predict(pairs)

    for r, s in zip(results, rerank_scores):
        r["rerank"] = float(s)

    results.sort(key=lambda x: x["rerank"], reverse=True)
    return results[:top_k]

# -------------------- Caching Generator --------------------
@lru_cache(maxsize=256)
def generate_answer_cached(prompt: str):
    output = chat_pipe(
        prompt,
        max_new_tokens=200,
        temperature=0.7,
        top_p=0.9,
        truncation=True,
    )[0]["generated_text"]
    return output

# -------------------- Generator --------------------
async def generate_answer(query: str, retrieved_docs):
    context = "\n".join([r["text"] for r in retrieved_docs])
    prompt = (
        "You are a helpful and empathetic pregnancy medical assistant. "
        "Use only the context provided to answer the question briefly and accurately. "
        "If not sure, say you don’t know.\n\n"
        f"Context:\n{context}\n\nUser: {query}\nAssistant:"
    )

    output = await asyncio.to_thread(generate_answer_cached, prompt)
    response = output[len(prompt):].strip()

    disclaimer = (
        "⚠️ This information is for educational purposes only. "
        "Please consult a qualified healthcare provider for medical advice."
    )
    return response, disclaimer

# -------------------- API --------------------
class Query(BaseModel):
    question: str

@app.post("/ask")
async def ask_bot(request: Query):
    retrieved = hybrid_retrieve(request.question, top_k=5)
    answer, disclaimer = await generate_answer(request.question, retrieved)
    return {"answer": answer, "sources": retrieved, "disclaimer": disclaimer}

@app.get("/")
def root():
    return {"message": "Maternal Health Chatbot API is running ✅"}