# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import PyPDF2
import io
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Mentora API", description="Backend for Mentora AI Career Assistant")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

# Models
class ChatRequest(BaseModel):
    message: str
    user_id: str
    history: Optional[List[dict]] = []

class CommsRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Welcome to Mentora API", "status": "online"}

# Roadmap Routes
@app.get("/roadmap/{user_id}")
async def get_roadmap(user_id: str):
    return {"user_id": user_id, "steps": []}

# Daily Tasks Routes
@app.get("/tasks/{user_id}")
async def get_tasks(user_id: str):
    return {"user_id": user_id, "tasks": []}

@app.post("/tasks/complete/{task_id}")
async def complete_task(task_id: str):
    return {"status": "success", "xp_earned": 50}

# AI Mentor Routes
@app.post("/ai/chat")
async def chat_with_mentor(request: ChatRequest):
    if not model:
        return {"response": "I'm in demo mode because the Gemini API key is missing. How can I help you generally?"}

    try:
        chat = model.start_chat(history=[])
        prompt = f"You are Mentora, an expert AI career coach. The user says: {request.message}"
        response = chat.send_message(prompt)
        return {"response": response.text}
    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail="Chat failed")

# Resume Analysis Routes
@app.post("/resume/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    if not model:
        return {
            "score": 85, 
            "feedback": ["Gemini API Key missing - running in demo mode"], 
            "ats_compatibility": "Medium",
            "strengths": ["Clear structure", "Industry relevant"],
            "weaknesses": ["Missing metrics", "Quantify achievements"],
            "missing_skills": ["Docker", "Kubernetes"]
        }
    
    try:
        # Extract text from PDF
        content = ""
        if file.filename.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(await file.read()))
            for page in pdf_reader.pages:
                content += page.extract_text()
        else:
            content = (await file.read()).decode('utf-8', errors='ignore')

        prompt = f"""
        Analyze the following resume text and provide a professional career assessment.
        Return the response ONLY as a JSON object with the following fields:
        - score (0-100)
        - ats_compatibility (High, Medium, Low)
        - strengths (list of strings)
        - weaknesses (list of strings)
        - missing_skills (list of strings)
        - feedback (list of strings)

        Resume Text:
        {content[:4000]}
        """
        
        response = model.generate_content(prompt)
        ai_content = response.text.strip()
        if "```json" in ai_content:
            ai_content = ai_content.split("```json")[1].split("```")[0].strip()
        return json.loads(ai_content)
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process resume")

# Communication Practice Routes
@app.post("/comms/analyze")
async def analyze_speech(request: CommsRequest):
    if not model:
        return {
            "score": 88,
            "tone": "Professional",
            "confidence": "High",
            "grammar_check": "No major errors.",
            "fluency_feedback": "Excellent flow.",
            "suggestions": ["Use more active voice", "Be more concise"]
        }

    prompt = f"""
    Analyze the following communication text for professional impact.
    Return the response ONLY as a JSON object with the following fields:
    - score (0-100)
    - tone (string)
    - confidence (Low, Medium, High)
    - grammar_check (string)
    - fluency_feedback (string)
    - suggestions (list of strings)

    Text:
    {request.text}
    """
    
    try:
        response = model.generate_content(prompt)
        content = response.text.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        return json.loads(content)
    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
