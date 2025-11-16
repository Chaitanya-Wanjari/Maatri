import os, faiss, json
from backend.rag import embed_texts
from backend import config

data_dir = "data"
docs = []
for fn in os.listdir(data_dir):
    if fn.endswith(".txt"):
        with open(os.path.join(data_dir, fn), encoding="utf-8") as f:
            docs.append(f.read().strip())

print(f"Loaded {len(docs)} docs")

embs = embed_texts(docs)
dim = embs.shape[1]

index = faiss.IndexFlatIP(dim)
index.add(embs)

os.makedirs(config.EMBEDDINGS_DIR, exist_ok=True)
faiss.write_index(index, os.path.join(config.EMBEDDINGS_DIR, "index.faiss"))
with open(os.path.join(config.EMBEDDINGS_DIR, "meta.json"), "w", encoding="utf-8") as f:
    json.dump(docs, f, ensure_ascii=False, indent=2)

print("✅ FAISS index built")
