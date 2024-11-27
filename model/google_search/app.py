import os
import requests  # Importing requests to interact with the Groc Cloud API
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
from serpapi import GoogleSearch
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# FastAPI app instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Fetch API keys from .env file
SERP_API_KEY = os.getenv("SERP_API_KEY")
GROC_API_KEY = os.getenv("GROC_API_KEY")

groq_client = Groq(api_key=GROC_API_KEY)

if not SERP_API_KEY or not GROC_API_KEY:
    raise ValueError("API keys not found. Please set SERP_API_KEY and GROC_API_KEY in the .env file.")

# Function to fetch Google News results
def fetch_google_news(keyword: str):
    params = {
        "api_key": SERP_API_KEY,
        "q": keyword,
        "engine": "google_news",
        "num": 100  # Fetch top 100 results
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    return results.get("news_results", []) 

# Function to summarize news content using Groc Cloud API
def summarize_with_groc(news_articles):
    # Extract all titles and concatenate them into a single string
    all_titles = " ".join([article.get("title", "") for article in news_articles])

    # Only summarize if there are titles to summarize
    if all_titles:
        try:
            response = groq_client.chat.completions.create(
                messages=[{"role": "user", "content": f"You are a new article summarizer. New article titles are attached below: {all_titles} Make sure to do the following: 1. Provide a detailed summary of the following new article titles. 2. Include key aspects or themes that are most frequently mentioned across the articles. 3. Any key criticisms or issues highlighted in the negative titles."}],
                model="llama3-8b-8192"
            )
            summary = response.choices[0].message.content
            print("Comments summarized using Groq")
            return summary
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error in summarizing comments with Groq: {str(e)}")
    else:
        return {
            "titles": [],
            "summary": "No titles available for summarization."
        }

# Function to fetch Google Search results
def fetch_google_search(keyword: str):
    params = {
        "api_key": SERP_API_KEY,
        "q": keyword,
        "engine": "google",
        "num": 100  # Fetch top 100 results
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    organic_results = results.get("organic_results", [])
    discussions = results.get("discussions", [])
    return {
        "organic_results": organic_results,
        "discussions": discussions
    }

# Function to fetch Google Trends data
def fetch_google_trends(keyword: str):
    params = {
        "api_key": SERP_API_KEY,
        "q": keyword,
        "engine": "google_trends",
        "include_low_search_volume": "true"
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    interest_over_time = results.get("interest_over_time", [])
    interest_by_region = results.get("interest_by_region", [])
    return {
        "interest_over_time": interest_over_time,
        "interest_by_region": interest_by_region
    }

import json
from fastapi import FastAPI, HTTPException
from pathlib import Path
@app.get("/fetch_data_test")
async def fetch_data():
    current_dir = Path(__file__).resolve().parent  # This gets the directory of app.py
    json_file_path = current_dir / 'results.json'
    try:
        with open(json_file_path, 'r') as f:
            data = json.load(f)  # Parse the JSON data
        return data  # Return the parsed JSON as the response
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error parsing JSON file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# FastAPI endpoint for data
@app.get("/fetch_data")
async def fetch_data(
    keyword: str = Query(..., description="Keyword to search for")
):
    # Fetch data
    news_results = fetch_google_news(keyword)
    summarized_news = summarize_with_groc(news_results)
    search_results = fetch_google_search(keyword)
    trends_data = fetch_google_trends(keyword)

    # Construct response with separate news and summarized news
    response = {
        "keyword": keyword,
        "news": news_results,  # Raw news data
        "summarized_news": summarized_news,  # Summarized news data
        "search": search_results,
        "trends": trends_data
    }
    return response
