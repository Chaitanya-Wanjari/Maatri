import requests

url = "http://127.0.0.1:8000/ask"  # must match your FastAPI endpoint
queries = [
    "What are the symptoms of early pregnancy?",
    "How can I manage morning sickness?",
    "What foods should I eat during pregnancy?",
    "Is it safe to exercise while pregnant?",
    "How often should I visit my doctor during pregnancy?",
    "What are warning signs of preeclampsia?",
    "Can I take medication for headaches while pregnant?",
    "How much weight should I gain during pregnancy?"
]

for q in queries:
    payload = {"question": q}  # matches the Pydantic model
    response = requests.post(url, json=payload)  # note json=, not data=
    if response.status_code == 200:
        print(f"Query: {q}\nResponse: {response.json()['answer']}\n")
    else:
        print(f"Query: {q} failed with status code {response.status_code}")

