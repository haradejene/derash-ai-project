# services/recommendation.py
import os
import json
import re
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Use the same working model
MODEL_NAME = 'models/gemini-2.5-flash'
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(MODEL_NAME)

# Resort services database
SERVICES = {
    "spa": {
        "name": "Ethiopian Spa Experience",
        "price": 500,
        "vip_price": 800,
        "category": "wellness",
        "duration": "1 hour",
        "description": "Traditional coffee scrub and massage"
    },
    "dinner": {
        "name": "Traditional Ethiopian Dinner",
        "price": 300,
        "vip_price": 500,
        "category": "dining",
        "duration": "2 hours",
        "description": "Authentic Doro Wat, Tibs, and live music"
    },
    "cultural_show": {
        "name": "Ethiopian Cultural Night",
        "price": 200,
        "vip_price": 350,
        "category": "entertainment",
        "duration": "1.5 hours",
        "description": "Traditional dancing and coffee ceremony"
    },
    "coffee": {
        "name": "Ethiopian Coffee Ceremony",
        "price": 150,
        "vip_price": 250,
        "category": "experience",
        "duration": "45 min",
        "description": "Authentic Jebena coffee ceremony"
    }
}

def get_recommendations(user_id=None, time_of_day=None, preferences=None, mood=None):
    """
    AI-powered recommendation engine
    """
    # Get time of day if not provided
    if not time_of_day:
        hour = datetime.now().hour
        if hour < 12:
            time_of_day = "morning"
        elif hour < 18:
            time_of_day = "afternoon"
        else:
            time_of_day = "evening"
    
    prompt = f"""You are Derash AI's recommendation engine for a luxury Ethiopian resort.

Available services:
{json.dumps(SERVICES, indent=2)}

Context:
- Time: {time_of_day}
- Guest preferences: {preferences or "none provided"}
- Guest mood: {mood or "neutral"}

Recommend 3 services to suggest to the guest.

Return ONLY JSON:
{{
    "recommendations": [
        {{
            "service_id": "spa|dinner|cultural_show|coffee",
            "reason": "Why this suits the guest",
            "upsell": "VIP upgrade offer if applicable"
        }}
    ],
    "message": "A warm, inviting message to present these recommendations"
}}

Make recommendations:
- {time_of_day} appropriate services
- Include 1 upsell opportunity
- Keep message warm and hospitable
- Return ONLY JSON"""

    try:
        response = model.generate_content(prompt)
        content = response.text
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        return {"recommendations": [], "message": "What would you like to explore today?"}
    except Exception as e:
        print(f"Recommendation error: {e}")
        return {"recommendations": [], "message": "How can I help you discover our services?"}

def get_upsell(service_id: str):
    """
    Get upsell offer for a specific service
    """
    if service_id in SERVICES:
        service = SERVICES[service_id]
        prompt = f"""Create a compelling upsell offer for {service['name']}.

Service: {service['name']}
Regular price: {service['price']} ETB
VIP price: {service['vip_price']} ETB
Description: {service['description']}

Return ONLY JSON:
{{
    "offer": "VIP upgrade offer text",
    "benefits": ["benefit1", "benefit2", "benefit3"],
    "price_diff": {service['vip_price'] - service['price']}
}}"""

        try:
            response = model.generate_content(prompt)
            content = response.text
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except:
            pass
        
        # Fallback
        return {
            "offer": f"Upgrade to VIP {service['name']}",
            "benefits": ["Priority service", "Complimentary drink", "Best views"],
            "price_diff": service['vip_price'] - service['price']
        }
    return None