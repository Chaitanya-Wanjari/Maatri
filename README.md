# Maatri – Bilingual Maternal Health Assistant

A bilingual maternal healthcare assistant that provides reliable pregnancy-related guidance in English and Hindi through a hybrid retrieval pipeline combining dense semantic search, reranking, and transformer-based response generation.

---

## Overview

Maatri is a web-based maternal health assistant designed to answer pregnancy-related questions in both English and Hindi. Unlike conventional chatbots that depend solely on Large Language Models (LLMs), Maatri retrieves information from a curated medical knowledge base before generating a response. This retrieval-first architecture reduces hallucinations and produces responses grounded in trusted medical sources.

The system integrates modern NLP techniques including dense vector retrieval, neural reranking, and transformer-based generation to deliver natural, context-aware, and medically reliable answers.

---

# Key Features

## Hybrid Retrieval Pipeline

- Dense semantic retrieval using multilingual Sentence Transformers.
- FAISS vector database for efficient similarity search.
- Fine-tuned Cross-Encoder for neural reranking.
- Transformer-based response generation from retrieved evidence.

## Bilingual Chatbot

- English and Hindi conversational interfaces.
- Context-aware pregnancy guidance.
- Medical disclaimer with every response.
- Source passages available on demand.

## FAQ Module

- Curated FAQs for both languages.
- Live search suggestions.
- Language toggle.
- Collapsible question cards.

## Responsive Web Application

- React-based frontend.
- FastAPI backend.
- Tailwind CSS UI.
- Smooth conversational experience.

---

# Retrieval Pipeline

The chatbot follows a four-stage retrieval pipeline.

## Step 1 — Dense Retrieval

The user query is encoded into a dense embedding using the multilingual **E5 Sentence Transformer**.

All document chunks are also stored as dense embeddings.

The query embedding is searched against the FAISS vector index using cosine similarity (implemented through normalized Inner Product search).

The top **25** semantically similar passages are retrieved.

---

## Step 2 — Reranking

The retrieved passages are passed to a **fine-tuned Cross-Encoder**.

Unlike the Bi-Encoder, which encodes queries and documents independently, the Cross-Encoder jointly processes each query-document pair and predicts a relevance score.

The passages are sorted according to these scores.

The highest-ranked **five passages** are selected for generation.

---

## Step 3 — Response Generation

Rather than returning fragmented retrieved passages directly to the user, the selected context is passed to a **fine-tuned transformer generation model**.

The generation model:

- Combines information across multiple passages.
- Removes redundancy.
- Produces coherent and conversational responses.
- Preserves factual information from the retrieved evidence.

This allows the chatbot to provide natural answers while remaining grounded in trusted medical content.

---

## Step 4 — Response Delivery

The generated answer, along with supporting source passages and a medical disclaimer, is returned through the FastAPI backend to the React frontend.

---

# Models Used

| Component | Model |
|------------|-------|
| Dense Retrieval | multilingual-e5-base |
| Vector Search | FAISS (IndexFlatIP) |
| Neural Reranking | Fine-tuned mMiniLMv2 Cross-Encoder |
| Response Generation | Fine-tuned Hindi BART |
| Backend Framework | FastAPI |
| Frontend Framework | React |

---

# Technology Stack

## Frontend

- React
- Tailwind CSS
- React Router
- Framer Motion
- Vite

## Backend

- FastAPI
- Python

## Machine Learning

- Sentence Transformers
- Transformers
- FAISS
- PyTorch

---

# Project Structure

```
Maatri/

├── Frontend/
│   └── virtualr-main/
│       ├── src/
│       │   ├── components/
│       │   ├── assets/
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   └── index.css
│       ├── public/
│       ├── package.json
│       └── vite.config.js
│
├── english_chatbot/
│   ├── app.py
│   ├── models/
│   ├── embeddings/
│   ├── faiss_indexes/
│   └── requirements.txt
│
├── hindi_chatbot/
│   ├── backend/
│   │   ├── app.py
│   │   ├── rag.py
│   │   ├── crossencoder.py
│   │   ├── config.py
│   │   └── models_io.py
│   ├── embeddings/
│   └── models/
│
└── README.md
```

---

# Running the Project

## Clone Repository

```bash
git clone https://github.com/Chaitanya-Wanjari/Maatri.git

cd Maatri
```

---

## Frontend

```bash
cd Frontend/virtualr-main

npm install

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

## English Backend

```bash
cd english_chatbot

pip install -r requirements.txt

uvicorn app:app --reload --port 8000
```

---

## Hindi Backend

```bash
cd hindi_chatbot/backend

pip install -r requirements.txt

uvicorn app:app --reload --port 8001
```

---

# API Endpoints

## English

```
POST /ask
```

Example Request

```json
{
    "question": "Can I eat papaya during pregnancy?"
}
```

---

## Hindi

```
POST /ask
```

Example Request

```json
{
    "question":"क्या गर्भावस्था में पपीता खाना सुरक्षित है?"
}
```

---

# Screenshots

### Home Page
![Home](assets/herosection.png)


### Friendly conversational interface
![Hindi](assets/selectchatbot.png)

### English Chatbot
![Chatbot](assets/englishchatbot.png)

### Resources
![Resources](assets/resources.png)

### FAQ Page
![FAQ](assets/faqs.png)

If you found this project useful or interesting, consider giving the repository a ⭐.
