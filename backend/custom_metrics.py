# backend/custom_metrics.py
import textstat
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords

# Ensure necessary NLTK resources are downloaded.
nltk.download('punkt')
nltk.download('stopwords')

def compute_readability(text):
    """
    Compute Flesch Reading Ease and Flesch-Kincaid Grade Level.
    """
    reading_ease = textstat.flesch_reading_ease(text)
    grade_level = textstat.flesch_kincaid_grade(text)
    return {
        "flesch_reading_ease": reading_ease,
        "flesch_kincaid_grade": grade_level
    }

def average_sentence_length(text):
    """
    Compute the average sentence length (in words).
    """
    sentences = sent_tokenize(text)
    if not sentences:
        return 0
    words = word_tokenize(text)
    return len(words) / len(sentences)

def extract_keywords(text, num_keywords=10):
    """
    Extract the most common keywords from the text, excluding stopwords.
    Returns a list of tuples (word, frequency).
    """
    tokens = word_tokenize(text)
    # Filter out non-alphabetical tokens and convert to lowercase.
    tokens = [token.lower() for token in tokens if token.isalpha()]
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [w for w in tokens if w not in stop_words]
    freq_dist = nltk.FreqDist(filtered_tokens)
    return freq_dist.most_common(num_keywords)
