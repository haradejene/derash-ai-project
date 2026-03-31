# services/complaint.py
import os
import json
import re
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Use the same working model
MODEL_NAME = 'models/gemini-2.5-flash'
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(MODEL_NAME)

def classify_complaint(message: str):
    """
    Detect complaints, classify them, and generate appropriate responses
    """
    prompt = f"""You are Derash AI's complaint handling system for a resort.

Analyze this guest message and determine if it's a complaint.

Message: "{message}"

Return ONLY JSON in this exact format:
{{
    "is_complaint": true/false,
    "category": "maintenance|cleaning|service|food|noise|other",
    "priority": "high|medium|low",
    "auto_response": "An empathetic apology and immediate action plan",
    "suggested_action": "What staff should do"
}}

Rules:
- high priority: AC broken, safety issues, no hot water, serious service failures
- medium priority: Cleaning issues, slow service, minor maintenance
- low priority: General feedback, suggestions, minor inconveniences
- Auto-response should be warm, apologize sincerely, and promise action
- For non-complaints, return is_complaint: false

Return ONLY JSON, no other text."""

    try:
        response = model.generate_content(prompt)
        content = response.text
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        return {
            "is_complaint": False,
            "category": "none",
            "priority": "none",
            "auto_response": "",
            "suggested_action": ""
        }
    except Exception as e:
        print(f"Complaint classification error: {e}")
        return {
            "is_complaint": False,
            "category": "error",
            "priority": "none",
            "auto_response": "I'm having trouble processing. Please contact staff directly.",
            "suggested_action": "Manual review needed"
        }