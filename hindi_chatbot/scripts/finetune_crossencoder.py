import os, json, random, re
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from sentence_transformers import CrossEncoder, InputExample

# -----------------------------
# Config
# -----------------------------
CE_MODEL = "./models/cross-encoder"
DATA_DIR = "./data"
OUTPUT_CE = "./models/crossencoder_finetuned"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# -----------------------------
# Utils
# -----------------------------
_ws_re = re.compile(r"\s+")

def normalize_hi(text):
    if not isinstance(text, str): 
        return ""
    return _ws_re.sub(" ", text.strip())

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def prepare_qa(qa_raw):
    qa=[]
    for i,item in enumerate(qa_raw):
        q = normalize_hi(item.get("question") or item.get("Question") or "")
        a = normalize_hi(item.get("answer") or item.get("Answer") or "")
        qa.append({"id": item.get("id", f"qa_{i}"), "question": q, "answer": a})
    return qa

# -----------------------------
# Load dataset
# -----------------------------
final_q_path = os.path.join(DATA_DIR, "finaldata.json")

qa_pairs_raw = load_json(final_q_path)
qa_pairs = prepare_qa(qa_pairs_raw)
print("✅ Loaded QA pairs:", len(qa_pairs))

answers_pool = [q["answer"] for q in qa_pairs if q.get("answer")]
if not answers_pool:
    raise RuntimeError("No answers found — check your finaldata.json")

# -----------------------------
# Build samples
# -----------------------------
train_samples = []
NEG_PER_Q = 2

for item in qa_pairs:
    qtext = item["question"].strip()
    atext = item["answer"].strip()
    if not qtext or not atext:
        continue
    # positive
    train_samples.append(InputExample(texts=[qtext, atext], label=1.0))
    # negatives
    negs = random.sample(answers_pool, k=min(NEG_PER_Q, len(answers_pool)-1))
    for na in negs:
        if na != atext:
            train_samples.append(InputExample(texts=[qtext, na], label=0.0))

random.shuffle(train_samples)
split = int(0.9 * len(train_samples))
train_list, dev_list = train_samples[:split], train_samples[split:]

print(f"✅ Dataset built → total={len(train_samples)}, train={len(train_list)}, dev={len(dev_list)}")

# -----------------------------
# DataLoaders
# -----------------------------
BATCH_SIZE = 16
train_dataloader = DataLoader(train_list, shuffle=True, batch_size=BATCH_SIZE)
dev_dataloader   = DataLoader(dev_list, shuffle=False, batch_size=64)

# -----------------------------
# Model
# -----------------------------
print("🔄 Loading base cross-encoder:", CE_MODEL)
cross_encoder = CrossEncoder(CE_MODEL, device=DEVICE, num_labels=1)

loss_fct = nn.BCEWithLogitsLoss()

# -----------------------------
# Training
# -----------------------------
print("🚀 Starting fine-tuning...")
cross_encoder.fit(
    train_dataloader=train_dataloader,
    epochs=2,
    warmup_steps=max(10, int(0.1 * len(train_dataloader))),
    evaluator=None,   # or use CEBinaryClassificationEvaluator(dev_dataloader)
    evaluation_steps=0,
    output_path=OUTPUT_CE,
    optimizer_params={'lr': 2e-5},
    loss_fct=loss_fct
)

print("✅ Fine-tuned cross-encoder saved at:", OUTPUT_CE)
