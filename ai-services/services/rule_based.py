# services/rule_based.py - Backup if Gemini fails
def process_message(message: str):
    """Fallback rule-based processor"""
    message_lower = message.lower()
    
    # Booking
    if any(word in message_lower for word in ['book', 'reserve', 'want']):
        if 'spa' in message_lower:
            return {
                "intent": "booking",
                "entities": {"service": "spa"},
                "response": "Great! Our spa has availability tonight at 6PM and 8PM. Would you like to book?"
            }
        elif 'dinner' in message_lower:
            return {
                "intent": "booking", 
                "entities": {"service": "dinner"},
                "response": "Our restaurant serves traditional Ethiopian cuisine. Available at 7PM, 8PM, or 9PM."
            }
    
    # Complaint
    if 'ac' in message_lower and ('not working' in message_lower or 'broken' in message_lower):
        return {
            "intent": "complaint",
            "entities": {"category": "maintenance", "priority": "high"},
            "response": "I apologize for the AC issue. Maintenance has been notified and will arrive in 10 minutes. Enjoy a complimentary drink while you wait! 🍹"
        }
    
    # Recommendation
    if 'tonight' in message_lower and any(word in message_lower for word in ['do', 'activities']):
        return {
            "intent": "recommendation",
            "entities": {"type": "activities"},
            "response": "Tonight's recommendations: Cultural Show at 8PM, Traditional Dinner at 7PM, or Spa Evening until 9PM!"
        }
    
    return {
        "intent": "question",
        "entities": {},
        "response": "I'm Derash AI, your resort assistant! I can help with bookings, recommendations, or resolving issues. What do you need?"
    }