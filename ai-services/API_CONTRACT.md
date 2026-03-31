# Derash AI Service API Contract

## Base URL: `http://localhost:8000`

1. Chat Processing (Main)
`POST /ai/process`
```json
Request: { "message": "string" }
Response: { "intent": "string", "entities": {}, "response": "string" }

2. Complaint Handling 
`POST /ai/complaint`
Request: { "message": "string" }
Response: { "is_complaint": bool, "category": "string", "priority": "string", "auto_response": "string" }

3. Recommendations
`POST /ai/recommend`
Request: { "time_of_day": "string", "mood": "string" }
Response: { "recommendations": [], "message": "string" }

4. Upsell Engine
`POST /ai/upsell`
Request: { "service_id": "string" }
Response: { "upsell": { "offer": "string", "benefits": [], "price_diff": int } }