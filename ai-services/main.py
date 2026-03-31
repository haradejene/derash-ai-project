# main.py - Complete AI service
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from services.chat import process_message
from services.complaint import classify_complaint
from services.recommendation import get_recommendations, get_upsell

app = FastAPI(title="Derash AI Service", version="2.0.0")

# Request Models
class MessageRequest(BaseModel):
    message: str

class ComplaintRequest(BaseModel):
    message: str

class RecommendationRequest(BaseModel):
    user_id: Optional[str] = None
    time_of_day: Optional[str] = None
    preferences: Optional[dict] = None
    mood: Optional[str] = None

class UpsellRequest(BaseModel):
    service_id: str

@app.get("/")
def root():
    return {
        "service": "Derash AI",
        "status": "running",
        "ai_powered": True,
        "model": "gemini-2.5-flash",
        "version": "2.0.0"
    }

@app.post("/ai/process")
def process(req: MessageRequest):
    """Main chat endpoint - understands everything"""
    return process_message(req.message)

@app.post("/ai/complaint")
def complaint(req: ComplaintRequest):
    """Specialized complaint handling"""
    return classify_complaint(req.message)

@app.post("/ai/recommend")
def recommend(req: RecommendationRequest):
    """Smart recommendations based on context"""
    return get_recommendations(
        user_id=req.user_id,
        time_of_day=req.time_of_day,
        preferences=req.preferences,
        mood=req.mood
    )

@app.post("/ai/upsell")
def upsell(req: UpsellRequest):
    """Upsell offers for services"""
    offer = get_upsell(req.service_id)
    return {"upsell": offer} if offer else {"message": "No upsell available"}

@app.get("/ai/status")
def status():
    """Check AI system status"""
    return {
        "ai_active": True,
        "model": "gemini-2.5-flash",
        "endpoints": ["/ai/process", "/ai/complaint", "/ai/recommend", "/ai/upsell"]
    }