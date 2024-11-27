from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from googleapiclient.discovery import build
from groq import Groq
from typing import List, Dict
import requests
import re
import time
import os
from dotenv import load_dotenv

load_dotenv()

# Get API keys from environment variables
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")


app = FastAPI()
youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
groq_client = Groq(api_key=GROQ_API_KEY)
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models"

HEADERS = {
    "Authorization": f"Bearer {HUGGINGFACE_API_KEY}"
}

# Pydantic models for input validation
class VideoSearchRequest(BaseModel):
    video_url: str

class SentimentAnalysisResponse(BaseModel):
    positive: int
    negative: int
    neutral: int
    summary: str

def extract_video_id(video_url: str) -> str:
    video_id_pattern = re.compile(r'(?:https?://)?(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)([A-Za-z0-9_-]{11})')
    match = video_id_pattern.search(video_url)
    if match:
        return match.group(1)
    else:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

@app.get("/extract-video-id/")
async def extract_video_id_from_url(video_url: str):
    video_id = extract_video_id(video_url)
    return {"video_id": video_id}

# Function to get the top comments for a video
def get_top_comments(video_id: str):
    comments = []
    request = youtube.commentThreads().list(
        part="snippet",
        videoId=video_id,
        maxResults=50,
        order="relevance"
    )
    response = request.execute()
    for item in response.get("items", []):
        comment = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
        comments.append(comment)
    print("Got top comments")
    return comments


def analyze_sentiment_huggingface(model: str, comments: List[str]) -> Dict[str, int]:
    positive, negative, neutral = 0, 0, 0
    max_retries = 5  
    backoff_factor = 2

    for comment in comments:
        payload = {"inputs": comment}
        
        retries = 0
        while retries < max_retries:
            response = requests.post(
                f"{HUGGINGFACE_API_URL}/{model}",
                headers=HEADERS,
                json=payload
            )
            
            if response.status_code == 200:
                # Process response if successful
                result = response.json()[0]
                result_sorted = sorted(result, key=lambda x: x['score'], reverse=True)
                result = result_sorted[0]['label']
                
                if result:
                    label = result
                    if label in ["POSITIVE", "LABEL_1"]:
                        positive += 1
                    elif label in ["NEGATIVE", "LABEL_0"]:
                        negative += 1
                    else:
                        neutral += 1
                break  # Exit the retry loop if successful
            elif response.status_code == 503 and "loading" in response.text:
                # If model is still loading, retry after waiting
                retries += 1
                wait_time = backoff_factor ** retries  # Exponential backoff
                print(f"Model is loading, retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                # Raise an HTTPException if it's a different error
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Hugging Face API error: {response.text}"
                )

        else:
            # If the loop exits without success, raise an error
            raise HTTPException(
                status_code=500,
                detail="Failed to get a valid response after retries"
            )

    print(f"Sentiment analysis using {model} completed")
    return {"positive": positive, "negative": negative, "neutral": neutral}

# Function to summarize comments using Groq API
def summarize_comments(comments: List[str]) -> str:
    combined_comments = " ".join(comments[:50])  # Limit to the first 50 comments for API input size
    try:
        response = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": f"Summarize the following YouTube comments into three categories: positive, negative, and neutral. For each category, include the key aspects or themes that are most frequently mentioned. Additionally, provide a general summary of the overall comment section. Comments: {combined_comments} Make sure to extract: 1. Key themes or common points mentioned in the positive comments. 2. Key criticisms or issues highlighted in the negative comments. 3.Neutral observations or comments that do not lean toward either side. Provide a clear and concise summary for each category, as well as an overall summary of the comment section."}],
            model="llama3-8b-8192"
        )
        summary = response.choices[0].message.content
        print("Comments summarized using Groq")
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in summarizing comments with Groq: {str(e)}")

# Endpoint for sentiment analysis and summarization
@app.post("/analyze-sentiment/", response_model=SentimentAnalysisResponse)
async def analyze_sentiment_for_video(request: VideoSearchRequest):
    try:
        print(request.video_url)
        video_id = extract_video_id(request.video_url)
        comments = get_top_comments(video_id)

        # Step 3: Perform sentiment analysis using Hugging Face Inference API (with retry for model loading)
        sentiment_result_distilbert = analyze_sentiment_huggingface(
            "distilbert-base-uncased-finetuned-sst-2-english", comments
        )
        # sentiment_result_albert = analyze_sentiment_huggingface(
        #     "textattack/albert-base-v2-SST-2", comments
        # )

        # Step 4: Summarize comments using Groq
        summary = summarize_comments(comments)

        # Combine sentiment results (optionally, you could return both results separately)
        combined_result = {
            "positive": sentiment_result_distilbert["positive"], # + sentiment_result_albert["positive"],
            "negative": sentiment_result_distilbert["negative"], # + sentiment_result_albert["negative"],
            "neutral": sentiment_result_distilbert["neutral"], # + sentiment_result_albert["neutral"],
            "summary": summary
        }

        print("Sentiment analysis and summarization completed")
        return combined_result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
