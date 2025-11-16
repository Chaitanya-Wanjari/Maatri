!pip install -q sentence-transformers
import json, random
from sentence_transformers import CrossEncoder, InputExample
from torch.utils.data import DataLoader
# --- Step 1: Load your Q–A data ---
with open("/content/mother_question_and_answer_pairs_data.json", "r") as f: data = json.load(f)
# --- Step 2: Build training examples ---
examples = []
for qa in data: q = qa["question"]
a = qa["answer"]
# Positive pair
examples.append(InputExample(texts=[q, a], label=1.0))
# Negative pair: wrong answer for this question
neg_a = random.choice(data)["answer"]
while neg_a == a: neg_a = random.choice(data)["answer"]
examples.append(InputExample(texts=[q, neg_a], label=0.0))
print("Total training pairs:", len(examples))
# --- Step 3: DataLoader ---
train_dataloader = DataLoader(examples, shuffle=True, batch_size=16)
# --- Step 4: CrossEncoder ---
model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2", num_labels=1)
# --- Step 5: Train ---
model.fit( train_dataloader=train_dataloader, epochs=2, warmup_steps=100, output_path="/content/fine_tuned_cross_encoder" )
print("Training complete. Model saved to /content/fine_tuned_cross_encoder")
