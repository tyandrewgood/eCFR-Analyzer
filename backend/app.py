# backend/app.py

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import requests
import re
import json
import os
from datetime import datetime
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import math
import textstat

# Download required NLTK resources quietly
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

# -------------------------
# Simple Statistics Helper Functions
# -------------------------

def simple_median(values):
    """Compute the median of a list of numbers."""
    sorted_values = sorted(values)
    n = len(sorted_values)
    if n == 0:
        return None
    if n % 2 == 1:
        return sorted_values[n // 2]
    else:
        return (sorted_values[n // 2 - 1] + sorted_values[n // 2]) / 2

def simple_stdev(values):
    """Compute the sample standard deviation of a list of numbers."""
    n = len(values)
    if n < 2:
        return 0
    mean_val = sum(values) / n
    variance = sum((x - mean_val) ** 2 for x in values) / (n - 1)
    return math.sqrt(variance)

# -------------------------
# Utility Functions
# -------------------------

def count_words(text):
    """
    Count words in the given text using a regex.
    """
    words = re.findall(r'\w+', text)
    return len(words)

# -------------------------
# Data Fetching Functions
# -------------------------

BASE_URL = "https://www.ecfr.gov"

def fetch_agencies():
    """
    Fetch the list of agencies from the eCFR Admin Service.
    Returns a JSON object (expected format: {"agencies": [...]}) or None on failure.
    """
    url = f"{BASE_URL}/api/admin/v1/agencies.json"
    print(f"[DEBUG] Fetching agencies from: {url}")
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        agencies = response.json()
        print(f"[DEBUG] Fetched {len(agencies.get('agencies', []))} agencies")
        return agencies
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Error fetching agencies: {e}")
        return None

def fetch_search_results(agency_slug, per_page=50, page=1, query="Regulations"):
    """
    Fetch search results for a given agency using the eCFR Search Service endpoint.
    """
    url = f"{BASE_URL}/api/search/v1/results"
    params = {
        "agency_slugs[]": [agency_slug],
        "per_page": per_page,
        "page": page,
        "query": query,
    }
    print(f"[DEBUG] Fetching search results for agency '{agency_slug}' with query '{query}'")
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        results = data.get("results", [])
        print(f"[DEBUG] Agency '{agency_slug}' returned {len(results)} results")
        return data
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Error fetching search results for agency '{agency_slug}': {e}")
        return None

# -------------------------
# Statistics Computation Functions
# -------------------------

def compute_statistics(query="Regulations"):
    """
    Compute aggregated statistics across all agencies (using the Search Service):
      - Total word count across all agencies.
      - Top 10 most common words (excluding stopwords).
      - Number of agencies analyzed.
      - Average, median, standard deviation, minimum, and maximum word counts.
      - The agencies with minimum and maximum word counts.
      - Aggregated readability metrics (Flesch Reading Ease and Flesch-Kincaid Grade).
      - A hard-coded "last_updated" value.
    """
    agencies_data = fetch_agencies()
    if not agencies_data:
        print("[ERROR] No agencies data fetched.")
        return {"error": "Unable to fetch agencies"}
    
    agencies = agencies_data.get("agencies", [])
    total_word_count = 0
    aggregated_text = ""
    agency_word_counts_list = []  # list of tuples: (agency_name, word_count)
    
    print(f"[DEBUG] Processing statistics for {len(agencies)} agencies...")
    for agency in agencies:
        slug = agency.get("slug")
        agency_name = agency.get("display_name") or agency.get("slug")
        search_data = fetch_search_results(slug, query=query)
        if search_data:
            results = search_data.get("results", [])
            agency_total = 0
            for item in results:
                headings = item.get("headings", {})
                text = " ".join(str(value) for value in headings.values() if value)
                word_count = count_words(text)
                agency_total += word_count
                aggregated_text += " " + text
            total_word_count += agency_total
            agency_word_counts_list.append((agency_name, agency_total))
            print(f"[DEBUG] Agency '{agency_name}': {len(results)} results, word count = {agency_total}")
        else:
            print(f"[DEBUG] No search data for agency '{agency_name}'")
    
    word_counts_only = [wc for (_, wc) in agency_word_counts_list]
    if word_counts_only:
        median_word_count = simple_median(word_counts_only)
        std_word_count = simple_stdev(word_counts_only)
        min_word_count = min(word_counts_only)
        max_word_count = max(word_counts_only)
        min_agency = min(agency_word_counts_list, key=lambda x: x[1])[0]
        max_agency = max(agency_word_counts_list, key=lambda x: x[1])[0]
    else:
        median_word_count = std_word_count = min_word_count = max_word_count = 0
        min_agency = max_agency = None

    agency_count = len(agencies)
    average_word_count = total_word_count / agency_count if agency_count > 0 else 0
    
    tokens = word_tokenize(aggregated_text)
    tokens = [token.lower() for token in tokens if token.isalpha()]
    stop_words = set(stopwords.words("english"))
    filtered_tokens = [w for w in tokens if w not in stop_words]
    freq_dist = nltk.FreqDist(filtered_tokens)
    top_10_words = freq_dist.most_common(10)
    
    aggregated_readability = {
        "flesch_reading_ease": textstat.flesch_reading_ease(aggregated_text) if aggregated_text.strip() else None,
        "flesch_kincaid_grade": textstat.flesch_kincaid_grade(aggregated_text) if aggregated_text.strip() else None
    }
    
    last_updated = "Monday Feb 10 2025"
    
    print("[DEBUG] Completed statistics computation.")
    return {
        "total_word_count": total_word_count,
        "top_10_words": top_10_words,
        "agency_count": agency_count,
        "average_word_count": average_word_count,
        "median_word_count": median_word_count,
        "std_word_count": std_word_count,
        "min_word_count": min_word_count,
        "max_word_count": max_word_count,
        "min_agency": min_agency,
        "max_agency": max_agency,
        "aggregated_readability": aggregated_readability,
        "last_updated": last_updated
    }

def compute_agency_word_count(query="Regulations"):
    """
    Compute the total word count for each agency using the Search Service.
    Returns a list of objects: { "agency": "Agency Name", "word_count": number }
    """
    agencies_data = fetch_agencies()
    if not agencies_data:
        print("[ERROR] No agencies data fetched in compute_agency_word_count.")
        return {"error": "Unable to fetch agencies"}
    agencies = agencies_data.get("agencies", [])
    results = []
    print(f"[DEBUG] Computing per-agency word counts for {len(agencies)} agencies...")
    for agency in agencies:
        slug = agency.get("slug")
        agency_name = agency.get("display_name") or agency.get("slug")
        search_data = fetch_search_results(slug, query=query)
        if search_data:
            results_list = search_data.get("results", [])
            total_count = 0
            for item in results_list:
                headings = item.get("headings", {})
                text = " ".join(str(value) for value in headings.values() if value)
                total_count += count_words(text)
            results.append({
                "agency": agency_name,
                "word_count": total_count
            })
            print(f"[DEBUG] Agency '{agency_name}' computed word count: {total_count}")
        else:
            print(f"[DEBUG] No search data for agency '{agency_name}' in compute_agency_word_count")
    return results

def analyze_agency_with_custom_metrics(agency_slug, query="Regulations"):
    """
    Compute detailed metrics for a single agency using the Search Service:
      - Total word count and result count.
      - Readability metrics.
      - Average sentence length.
      - Top 10 keywords.
    This is used for the Detailed Analysis page.
    """
    print(f"[DEBUG] Analyzing agency '{agency_slug}' with query '{query}'")
    search_data = fetch_search_results(agency_slug, query=query)
    if not search_data:
        print(f"[ERROR] Failed to fetch search results for agency '{agency_slug}'")
        return {"error": "Failed to fetch search results for agency."}
    results = search_data.get("results", [])
    aggregated_text = ""
    total_word_count = 0
    for item in results:
        headings = item.get("headings", {})
        text = " ".join(str(value) for value in headings.values() if value)
        total_word_count += count_words(text)
        aggregated_text += " " + text

    try:
        readability = {
            "flesch_reading_ease": textstat.flesch_reading_ease(aggregated_text),
            "flesch_kincaid_grade": textstat.flesch_kincaid_grade(aggregated_text)
        }
    except Exception as e:
        print(f"[ERROR] Error computing readability metrics: {e}")
        readability = {"flesch_reading_ease": None, "flesch_kincaid_grade": None}

    sentences = sent_tokenize(aggregated_text)
    if sentences and len(sentences) > 0:
        total_words = len(word_tokenize(aggregated_text))
        avg_sentence_length = total_words / len(sentences)
    else:
        avg_sentence_length = 0

    tokens = word_tokenize(aggregated_text)
    tokens = [token.lower() for token in tokens if token.isalpha()]
    stop_words = set(stopwords.words("english"))
    filtered_tokens = [w for w in tokens if w not in stop_words]
    freq_dist = nltk.FreqDist(filtered_tokens)
    top_keywords = freq_dist.most_common(10)

    print(f"[DEBUG] Detailed analysis for agency '{agency_slug}': result_count = {len(results)}, word_count = {total_word_count}")
    return {
       "agency": agency_slug,
       "result_count": len(results),
       "word_count": total_word_count,
       "readability": readability,
       "average_sentence_length": avg_sentence_length,
       "keywords": top_keywords
    }

CACHED_STATS_FILE = "cached_statistics.json"
CACHED_AGENCY_WORD_COUNT_FILE = "cached_agency_word_count.json"

def cache_data_to_file(data, filepath):
    try:
        with open(filepath, "w") as f:
            json.dump(data, f)
        print(f"[DEBUG] Cached data saved to {filepath}")
    except Exception as e:
        print(f"[ERROR] Error caching data to {filepath}: {e}")

def load_cached_data(filepath):
    if os.path.exists(filepath):
        try:
            with open(filepath, "r") as f:
                data = json.load(f)
            print(f"[DEBUG] Loaded cached data from {filepath}")
            return data
        except Exception as e:
            print(f"[ERROR] Error loading cached data from {filepath}: {e}")
    return None

app = FastAPI(
    title="eCFR Analyzer API", 
    description="Analyze Federal Regulations from the eCFR API."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/analyze")
async def analyze(
    agency: str = Query(..., description="Agency slug (e.g., 'agriculture-department')"),
    query: str = Query("Regulations", description="Search query (default: 'Regulations')")
):
    print(f"[DEBUG] /analyze endpoint called for agency '{agency}' with query '{query}'")
    data = fetch_search_results(agency, query=query)
    if not data:
        print(f"[ERROR] No search results for agency '{agency}'")
        return {"error": "Failed to fetch search results for agency."}
    
    results = data.get("results", [])
    total_word_count = 0
    for item in results:
        headings = item.get("headings", {})
        text = " ".join(str(value) for value in headings.values() if value)
        total_word_count += count_words(text)
    
    print(f"[DEBUG] /analyze: agency '{agency}' has {len(results)} results with word_count = {total_word_count}")
    return {
        "agency": agency,
        "result_count": len(results),
        "word_count": total_word_count
    }

@app.get("/metrics")
async def metrics(
    agency: str = Query(..., description="Agency slug (e.g., 'agriculture-department')"),
    query: str = Query("Regulations", description="Search query (default: 'Regulations')")
):
    print(f"[DEBUG] /metrics endpoint called for agency '{agency}' with query '{query}'")
    return analyze_agency_with_custom_metrics(agency, query)

@app.get("/agencies")
async def agencies():
    print("[DEBUG] /agencies endpoint called")
    data = fetch_agencies()
    if not data:
        return {"error": "Unable to fetch agencies"}
    return data

@app.get("/history")
async def history(
    agency: str = Query(..., description="Agency slug"),
    query: str = Query("Regulations", description="Search query")
):
    print(f"[DEBUG] /history endpoint called for agency '{agency}'")
    data = [
        {"date": "2023-01-01", "wordCount": 1000},
        {"date": "2023-02-01", "wordCount": 1500},
        {"date": "2023-03-01", "wordCount": 1800},
        {"date": "2023-04-01", "wordCount": 2200},
    ]
    return data

@app.get("/statistics")
async def statistics(query: str = Query("Regulations", description="Search query for statistics")):
    print(f"[DEBUG] /statistics endpoint called with query '{query}'")
    cached_stats = load_cached_data(CACHED_STATS_FILE)
    if cached_stats:
        return cached_stats
    stats = compute_statistics(query)
    cache_data_to_file(stats, CACHED_STATS_FILE)
    return stats

@app.get("/agency_word_count")
async def agency_word_count(query: str = Query("Regulations", description="Search query for agency word count")):
    print(f"[DEBUG] /agency_word_count endpoint called with query '{query}'")
    cached_agency_data = load_cached_data(CACHED_AGENCY_WORD_COUNT_FILE)
    if cached_agency_data:
        return cached_agency_data
    data = compute_agency_word_count(query)
    cache_data_to_file(data, CACHED_AGENCY_WORD_COUNT_FILE)
    return data

@app.post("/refresh_statistics")
async def refresh_statistics(query: str = Query("Regulations", description="Search query for refreshing statistics")):
    print(f"[DEBUG] /refresh_statistics endpoint called with query '{query}'")
    stats = compute_statistics(query)
    cache_data_to_file(stats, CACHED_STATS_FILE)
    agency_data = compute_agency_word_count(query)
    cache_data_to_file(agency_data, CACHED_AGENCY_WORD_COUNT_FILE)
    return {
        "message": "Statistics refreshed",
        "last_updated": stats.get("last_updated")
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8091, reload=True)
