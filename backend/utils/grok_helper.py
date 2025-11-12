# utils/grok_helper.py

import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Load Grok API key from the w.env file
GROK_API_KEY = os.getenv('GROK_API_KEY')
GROK_API_URL = 'https://api.x.ai/v1/chat/completions'  # Grok API URL for chat completions

def generate_grok_response(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {GROK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    }
    
    try:
        # Send POST request to the Grok API
        response = requests.post(GROK_API_URL, json=data, headers=headers)
        response.raise_for_status()  # Raise an error if the request failed
        response_data = response.json()
        
        # Extract the response message from the API's response
        return response_data.get("choices", [{}])[0].get("message", {}).get("content", "No response from Grok.")
    
    except requests.exceptions.RequestException as e:
        # In case of errors, log and return a friendly error message
        print(f"Error with Grok API request: {e}")
        return "Sorry, I couldn't generate a response at this time."
