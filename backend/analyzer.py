# backend/analyzer.py
import re
from data_fetcher import fetch_search_results
from custom_metrics import compute_readability, average_sentence_length, extract_keywords

def count_words(text):
    """
    Count words in the given text using a regex.
    """
    words = re.findall(r'\w+', text)
    return len(words)

def analyze_agency_word_count(agency_slug, query="Agriculture"):
    """
    Basic analysis: Fetches search results and returns agency, result count, and aggregated word count.
    """
    data = fetch_search_results(agency_slug, query=query)
    if not data:
        return {"error": "Failed to fetch search results for agency."}
    
    results = data.get("results", [])
    total_word_count = 0

    for item in results:
        headings = item.get("headings", {})
        text = " ".join(str(value) for value in headings.values() if value)
        total_word_count += count_words(text)
    
    return {
        "agency": agency_slug,
        "result_count": len(results),
        "word_count": total_word_count
    }

def analyze_agency_with_custom_metrics(agency_slug, query="Agriculture"):
    """
    Extended analysis: Fetches search results, aggregates text from headings, and computes:
      - Basic metrics: result count and word count.
      - Readability metrics (Flesch Reading Ease and Flesch-Kincaid Grade Level).
      - Average sentence length.
      - Top keywords extracted from the text.
    """
    data = fetch_search_results(agency_slug, query=query)
    if not data:
        return {"error": "Failed to fetch search results for agency."}
    
    results = data.get("results", [])
    aggregated_text = ""
    total_word_count = 0

    for item in results:
        headings = item.get("headings", {})
        text = " ".join(str(value) for value in headings.values() if value)
        aggregated_text += " " + text
        total_word_count += count_words(text)
    
    # Compute custom metrics on the aggregated text
    readability = compute_readability(aggregated_text)
    avg_sentence_len = average_sentence_length(aggregated_text)
    keywords = extract_keywords(aggregated_text)

    standard_metrics = {
        "agency": agency_slug,
        "result_count": len(results),
        "word_count": total_word_count
    }

    # Combine all metrics into a single result
    standard_metrics.update({
        "readability": readability,
        "average_sentence_length": avg_sentence_len,
        "keywords": keywords
    })

    return standard_metrics
