# services/chat.py - Working with your Gemini models!
import os
import json
import re
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ No GEMINI_API_KEY found in .env")
    from .rule_based import process_message
else:
    genai.configure(api_key=api_key)
    
    # Use the models we confirmed work!
    # From your list: models/gemini-2.5-flash works perfectly
    MODEL_NAME = 'models/gemini-2.5-flash'  # Fast and free!
    
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        # Test it
        test_response = model.generate_content("Say 'OK'")
        if test_response.text:
            print(f"✅ Gemini ACTIVE with model: {MODEL_NAME}")
            print(f"   Your AI is now using Google's Gemini 2.5 Flash! 🚀")
            
            def process_message(message: str):
                """Gemini-powered intent detection"""
                prompt = f"""You are Derash AI, a smart resort assistant for an Ethiopian resort.

Analyze this guest message and return ONLY JSON.

Message: "{message}"

Return JSON in this exact format:
{{
    "intent": "booking|complaint|recommendation|question|greeting",
    "entities": {{
        "service": "spa|dinner|cultural_show|coffee|null",
        "time": "tonight|tomorrow|morning|afternoon|evening|null",
        "category": "maintenance|cleaning|service|null",
        "priority": "high|medium|low|null"
    }},
    "response": "A warm, friendly response to the guest"
}}

Rules:
- For booking: Suggest available times and ask for confirmation
- For complaints: Apologize sincerely and offer immediate solution
- For recommendations: Suggest popular services based on time of day
- For questions: Provide helpful information
- Keep responses warm and hospitable (Ethiopian hospitality style)
- Return ONLY the JSON, no other text"""

                try:
                    response = model.generate_content(prompt)
                    content = response.text
                    
                    # Extract JSON
                    json_match = re.search(r'\{.*\}', content, re.DOTALL)
                    if json_match:
                        result = json.loads(json_match.group())
                        # Ensure response exists
                        if 'response' not in result:
                            result['response'] = "How can I help you today?"
                        return result
                    else:
                        return {
                            "intent": "unknown",
                            "entities": {},
                            "response": "I'm here to help! What would you like to know?"
                        }
                        
                except Exception as e:
                    print(f"❌ Gemini error: {e}")
                    return {
                        "intent": "error",
                        "entities": {},
                        "response": "I'm having trouble connecting. Please try again."
                    }
                    
    except Exception as e:
        print(f"❌ Failed to initialize Gemini: {e}")
        print("   Falling back to rule-based system")
        from .rule_based import process_message