# backend/data_fetcher.py
import requests

BASE_URL = "https://www.ecfr.gov"

def fetch_agencies():
    """
    Fetch the list of agencies from the eCFR Admin Service.
    Returns the JSON response (expected format: {"agencies": [...]})
    or None on failure.
    """
    url = f"{BASE_URL}/api/admin/v1/agencies.json"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching agencies: {e}")
        return None

def fetch_search_results(agency_slug, per_page=50, page=1, query="Agriculture"):
    """
    Fetch search results for a given agency using the eCFR Search Service endpoint.
    
    Parameters:
      - agency_slug: The agency slug (e.g., 'agriculture-department')
      - per_page: Number of results per page (default: 50)
      - page: The page number to fetch (default: 1)
      - query: The search term (default: "Agriculture")
    
    Returns:
      - The JSON response (expected format: {"results": [...], "meta": {...}})
        or None on error.
    """
    url = f"{BASE_URL}/api/search/v1/results"
    params = {
        "agency_slugs[]": [agency_slug],  # requests will encode this as agency_slugs[]=value
        "per_page": per_page,
        "page": page,
        "query": query,
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching search results for agency '{agency_slug}': {e}")
        return None
