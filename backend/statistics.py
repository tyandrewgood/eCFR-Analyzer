import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from data_fetcher import fetch_agencies, fetch_search_results
from analyzer import count_words

# Ensure necessary NLTK resources are downloaded (if not already done globally)
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

def compute_statistics(query="Regulations"):
    """
    Compute aggregated statistics across all agencies:
      - Total word count across all agencies.
      - Top 10 most common words (excluding stopwords).
      - Number of agencies analyzed.
      - Average word count per agency.
    """
    agencies_data = fetch_agencies()
    if not agencies_data:
        return {"error": "Unable to fetch agencies"}
    
    agencies = agencies_data.get("agencies", [])
    total_word_count = 0
    aggregated_text = ""
    
    # For demonstration, we loop through all agencies.
    # In production, you might limit this or run it as a batch process.
    for agency in agencies:
        slug = agency.get("slug")
        search_data = fetch_search_results(slug, query=query)
        if search_data:
            results = search_data.get("results", [])
            for item in results:
                headings = item.get("headings", {})
                text = " ".join(str(value) for value in headings.values() if value)
                total_word_count += count_words(text)
                aggregated_text += " " + text

    # Tokenize aggregated text and filter out stopwords
    tokens = word_tokenize(aggregated_text)
    tokens = [token.lower() for token in tokens if token.isalpha()]
    stop_words = set(stopwords.words("english"))
    filtered_tokens = [w for w in tokens if w not in stop_words]
    
    # Use NLTK's FreqDist to get the top 10 words
    freq_dist = nltk.FreqDist(filtered_tokens)
    top_10_words = freq_dist.most_common(10)
    
    agency_count = len(agencies)
    average_word_count = total_word_count / agency_count if agency_count > 0 else 0
    
    return {
        "total_word_count": total_word_count,
        "top_10_words": top_10_words,
        "agency_count": agency_count,
        "average_word_count": average_word_count
    }
