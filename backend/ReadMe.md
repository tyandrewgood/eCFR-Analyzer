# eCFR Analyzer Backend

The eCFR Analyzer Backend is a FastAPI-based service that retrieves and analyzes Federal Regulations data from the public electronic Code of Federal Regulations (eCFR). This backend aggregates data—including recursively processing child agencies—to compute various metrics such as total word counts, readability scores, top keywords, and historical trends. Computed statistics are cached locally to improve performance.

------------------------------------------------------------
TABLE OF CONTENTS
------------------------------------------------------------
1. Overview
2. Features
3. Technology Stack
4. Setup Instructions
5. API Endpoints
6. Recursive Agency Processing
7. Caching Strategy
8. Notes
9. License
10. Contact

------------------------------------------------------------
1. OVERVIEW
------------------------------------------------------------
The eCFR Analyzer Backend fetches agency metadata from the eCFR Admin Service and uses the eCFR Search Service to retrieve regulatory text. It aggregates and analyzes this text to provide overall statistics (e.g., total word count, average, median, standard deviation, top 10 keywords) and detailed metrics for individual agencies. A key improvement in this version is the recursive processing of child agencies—ensuring that all nested agencies are included in the analysis.

------------------------------------------------------------
2. FEATURES
------------------------------------------------------------
- **Agency Data Retrieval:** Fetches agency metadata from eCFR’s public API.
- **Recursive Processing:** Uses a helper function to flatten the agency hierarchy, ensuring that child agencies are processed along with top-level agencies.
- **Text Analysis:** Computes word counts, readability metrics (Flesch Reading Ease and Flesch-Kincaid Grade), average sentence length, and identifies top keywords.
- **Aggregated Statistics:** Provides overall statistics across all agencies and per-agency word counts.
- **Caching:** Caches computed statistics in JSON files to improve performance.

------------------------------------------------------------
3. TECHNOLOGY STACK
------------------------------------------------------------
- **Python 3.9+**
- **FastAPI:** Web framework for building APIs
- **Uvicorn:** ASGI server for running the FastAPI app
- **Requests:** For HTTP requests to the eCFR API
- **NLTK:** For text tokenization and stopword filtering
- **Textstat:** For readability calculations
- **Standard Python Libraries:** os, json, re, math, datetime

------------------------------------------------------------
4. SETUP INSTRUCTIONS
------------------------------------------------------------
1. **Clone the Repository and Navigate to the Backend Directory:**
2. **Install Dependencies:**
Ensure you have a `requirements.txt` file listing dependencies such as fastapi, uvicorn, requests, nltk, and textstat. Then run:
`pip install -r requirements.txt`.

3. **Run the Backend Server:**
Start the server using uvicorn:
`uvicorn app:app --host 0.0.0.0 --port 8091 --reload`


4. **Access the API Documentation:**
Open your browser and visit:
- Swagger UI: http://localhost:8091/docs
- ReDoc: http://localhost:8091/redoc

------------------------------------------------------------
5. API ENDPOINTS
------------------------------------------------------------
- **GET /analyze**  
Returns basic analysis for an agency (result count and total word count).

- **GET /metrics**  
Provides detailed metrics for a single agency by aggregating data from the agency and all its descendant agencies.  
*Response includes:*  
 - `result_count`  
 - `word_count`  
 - `average_sentence_length`  
 - `readability` (Flesch Reading Ease and Flesch-Kincaid Grade)  
 - `keywords` (Top 10 keywords)

- **GET /agencies**  
Returns the list of agencies from the eCFR Admin Service.

- **GET /history**  
Returns mock historical data for demonstration purposes.

- **GET /statistics**  
Aggregates overall statistics (e.g., total word count, average, median, standard deviation, etc.) across all agencies. Uses cached JSON if available and includes a "last_updated" field.

- **GET /agency_word_count**  
Returns per-agency word count data (including child agencies) using caching.

------------------------------------------------------------
6. RECURSIVE AGENCY PROCESSING
------------------------------------------------------------
The backend uses the helper function `flatten_agencies()` to recursively traverse the agency hierarchy obtained from the eCFR Admin Service. This function produces a flat list of all agencies, ensuring that any agency nested within the `children` arrays is included in the analysis. The function `is_descendant()` helps filter agencies when computing detailed metrics so that a parent agency’s data includes that of its child agencies.

------------------------------------------------------------
7. CACHING STRATEGY
------------------------------------------------------------
Computed statistics are cached locally in two JSON files:
- `cached_statistics.json` for overall aggregated statistics.
- `cached_agency_word_count.json` for per-agency word count data.

The cached data includes a `"last_updated"` field to indicate the last time the statistics were refreshed. There is no refresh button; the cached data is used for performance and remains until manually updated.
