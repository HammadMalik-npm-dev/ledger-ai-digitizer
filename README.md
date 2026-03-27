# Ledger AI Digitizer 📊

A full-stack application that transforms handwritten ledger images into structured CSV data using Vision Language Models (VLM).



## 🚀 How it Works
1. **Frontend:** A React/Next.js interface allows users to drag and drop images of handwritten ledgers.
2. **Backend:** A FastAPI server processes the image, converting it to Base64.
3. **AI Inference:** The system uses **Ollama** running the **Llava (7B)** model to perform OCR and structured data extraction via a Chain-of-Thought prompt.
4. **Data Export:** The structured CSV data is returned to the frontend for instant download.

## 🛠️ Tech Stack
* **Frontend:** Next.js, React, Tailwind CSS, Axios
* **Backend:** FastAPI, Uvicorn, Python
* **AI/ML:** Ollama, Llava (Vision Model)
* **DevOps:** CORS Middleware, Base64 Encoding

## ⚙️ Setup
### Backend
1. Install requirements: `pip install -r backend/requirements.txt`
2. Ensure Ollama is running with: `ollama run llava`
3. Start server: `python backend/main.py`

### Frontend
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
