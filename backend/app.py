# backend/app.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from analyzer import analyze_agency_word_count, analyze_agency_with_custom_metrics
from data_fetcher import fetch_agencies
import uvicorn

app = FastAPI(
    title="eCFR Analyzer API", 
    description="Analyze Federal Regulations from the eCFR API."
)

# Enable CORS so that the frontend (running on a different origin) can access the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify the allowed origins.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/analyze")
async def analyze(
    agency: str = Query(..., description="Agency slug (e.g., 'agriculture-department')"),
    query: str = Query("Agriculture", description="Search query (default: 'Agriculture')")
):
    """
    Basic analysis endpoint returning agency, result count, and word count.
    """
    result = analyze_agency_word_count(agency, query)
    return result

@app.get("/metrics")
async def metrics(
    agency: str = Query(..., description="Agency slug (e.g., 'agriculture-department')"),
    query: str = Query("Agriculture", description="Search query (default: 'Agriculture')")
):
    """
    Extended analysis endpoint returning basic metrics plus:
      - Readability metrics.
      - Average sentence length.
      - Top keywords.
    """
    result = analyze_agency_with_custom_metrics(agency, query)
    return result

@app.get("/agencies")
async def agencies():
    """
    Endpoint to fetch the list of agencies from the eCFR Admin Service.
    """
    data = fetch_agencies()
    if not data:
        return {"error": "Unable to fetch agencies"}
    return data

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8091, reload=True)

@app.get("/history")
async def history(
    agency: str = Query(..., description="Agency slug"),
    query: str = Query("Regulations", description="Search query")
):
    """
    Returns time-series data for the given agency and query.
    Typically, you'd build or fetch data that includes date + metric values over time.
    """
    # Example of returning mock data (in reality, you might query a database or 
    # call an external eCFR "historical" endpoint, if available).
    # We'll just return some hard-coded data for demonstration.

    # The shape: [
    #   { "date": "2023-01-01", "wordCount": 1200 },
    #   { "date": "2023-02-01", "wordCount": 1350 },
    #   ...
    # ]
    data = [
        {"date": "2023-01-01", "wordCount": 1000},
        {"date": "2023-02-01", "wordCount": 1500},
        {"date": "2023-03-01", "wordCount": 1800},
        {"date": "2023-04-01", "wordCount": 2200},
    ]
    return data
