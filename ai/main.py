from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import base64
import requests
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_image_with_ollama(base64_image):
    # 1. We switch to "llava" (Smarter than moondream)
    # 2. We use a "Chain of Thought" prompt (Read first, then Format)
    prompt = """
    Look at this handwritten ledger page carefully.
    Step 1: Transcribe all the text you see on the page, line by line.
    Step 2: Identify any Dates, Descriptions (Items), and Amounts (Numbers).
    Step 3: Format the identified data into a CSV format.
    
    Output ONLY the CSV data. Do not output the transcription or any chat text.
    The CSV columns must be: Date, Description, Amount.
    """
    
    try:
        print("Sending request to Ollama...")
        response = requests.post('http://localhost:11434/api/chat', json={
            "model": "llava",  # <--- CHANGED TO LLAVA
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                    "images": [base64_image]
                }
            ],
            "stream": False,
            "options": {
                "temperature": 0.1 # Low temperature = More precise/Less creative
            }
        })
        
        # DEBUGGING: Print the raw answer to the terminal so we can see what happened
        full_response = response.json()['message']['content']
        print(f"\n--- RAW AI RESPONSE ---\n{full_response}\n-----------------------\n")
        
        return full_response
        
    except Exception as e:
        print(f"Error: {e}")
        return f"Error: {str(e)}"

@app.post("/process-page")
async def process_page(file: UploadFile = File(...)):
    print(f"Receiving file: {file.filename}")
    image_bytes = await file.read()
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    
    ai_response = analyze_image_with_ollama(base64_image)
    
    return {
        "csv_data": ai_response,
        "raw_text_found": "Processed by Llava (7B)"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)