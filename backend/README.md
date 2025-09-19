AgriGuide - AI Crop Recommendation (Backend)

Stack: Node.js, Express, Axios, CORS, dotenv

Setup
1) Create a .env file in backend/ with:

PORT=5000
GEMINI_API_KEY=your_google_generative_ai_api_key_here

2) Install dependencies:

npm install

3) Start server:

npm run start

Dev mode (Node 18+):

npm run dev

Endpoint
- POST /recommend

Request JSON:
{
  "soil": "Loam",
  "ph": 6.5,
  "rainfall": 800,
  "temperature": 28,
  "state": "Maharashtra",
  "budget": 50000
}

Response JSON (example):
{
  "crops": [
    { "name": "Rice", "reason": "Grows well in high rainfall and warm climate.", "fertilizer": "Urea, DAP" },
    { "name": "Sugarcane", "reason": "Thrives in loamy soil with sufficient rainfall.", "fertilizer": "Nitrogen, Potash" }
  ]
}

Notes
- Input validation and basic error handling included
- Health check: GET /health
- Code structure: routes/, controllers/, services/, utils/


