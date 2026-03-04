IFA-EMS AI Modules
A small MERN + Tailwind project demonstrating AI-driven features for sustainable commerce.


Implemented Modules
1. Auto-Category & Tag Generator
Classifies a product into a primary & sub-category
Generates SEO tags
Detects sustainability filters (plastic-free, compostable, etc.)
Stores structured JSON in MongoDB


2. B2B Proposal Generator
Suggests a sustainable product mix
Allocates budget within limits
Calculates estimated cost breakdown
Generates an impact summary


Tech Stack
Frontend: React, Vite, Tailwind  
Backend: Node.js, Express, MongoDB, Mongoose  
AI Layer: Rules-based engine (LLM-ready design)


How Data Flows in the System
The system works like this:

1.User fills a form on the frontend.
2.React sends a JSON request to the backend.
3.The backend validates the input.
4.The AI service processes the request.
5.The result is stored in MongoDB. 
6.A clean structured JSON response is returned.
7.The frontend displays the output visually.

Architecture
Frontend → API Request → Express Routes → AI Service Layer → MongoDB → JSON Response → UI

Key APIs:
POST /api/catalog/classify
POST /api/proposals/generate
GET /health



Module 1 Example
Input:
{
"name": "Compostable coffee cup",
"description": "Bamboo fibre, plastic-free",
"materials": ["bamboo"]
}
Output:
{
"primaryCategory": "Food Service",
"seoTags": ["bamboo", "compostable"],
"sustainabilityFilters": ["plastic-free"]
}


Module 2 Example
Input:
{
"clientName": "Acme Corp",
"headcount": 500,
"budgetLimit": 100000
}
Output:
{
"suggestedMix": ["Recycled Notebook", "Bamboo Pen"],
"estimatedCostBreakdown": { "perPerson": 180 },
"impactSummary": "Plastic-free sustainable office kit."
}


Running Locally
Backend
cd backend
npm install
npm run dev
Frontend
cd frontend
npm install
npm run dev
Backend URL:
http://localhost:4000
Future Modules (Planned)
Impact Reporting (plastic saved, carbon avoided)
WhatsApp Support Bot (order queries, escalation)
Design Notes
Clear separation of routes, services, and models
Structured JSON outputs
Easy upgrade to LLM APIs (OpenAI / Gemini)