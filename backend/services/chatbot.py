# # services/chatbot.py

# from transformers import pipeline

# chat_model = pipeline("text-generation", model="distilgpt2")

# def generate_chat_response(message: str) -> str:
#     """Generate response using Hugging Face model."""
#     output = chat_model(message, max_length=100, do_sample=True, top_k=50)[0]['generated_text']
#     return output.replace(message, "").strip()



import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Load Grok API key from the .env file
GROK_API_KEY = os.getenv('GROK_API_KEY')
GROK_API_URL = 'https://api.x.ai/v1/chat/completions'  # Grok API URL for chat completions

def generate_chat_response(prompt: str) -> str:
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
        # Send POST request to the Grok API with a timeout of 10 seconds
        response = requests.post(GROK_API_URL, json=data, headers=headers, timeout=10)
        
        # Raise an error if the request failed (4xx, 5xx errors)
        response.raise_for_status()
        
        # Attempt to parse the response data
        response_data = response.json()

        # Extract the message content from the API response
        message_content = response_data.get("choices", [{}])[0].get("message", {}).get("content", "No response from Grok.")
        
        return message_content
    
    except requests.exceptions.Timeout:
        # Timeout error handling
        print("The request to Grok API timed out.")
        return "Sorry, the request timed out. Please try again later."
    
    except requests.exceptions.RequestException as e:
        # General request error (e.g., network issues, invalid response, etc.)
        print(f"Error with Grok API request: {e}")
        print(f"Response Text: {response.text[:500]}")  # Log only the first 500 characters of the response for debugging
        return "Sorry, I couldn't generate a response at this time."

    except ValueError as e:
        # Handle errors in case of invalid JSON format in the response
        print(f"Invalid JSON response: {e}")
        return "Sorry, there was an issue processing the response from Grok."
    
    except Exception as e:
        # General error handling for unexpected cases
        print(f"Unexpected error: {e}")
        return "Sorry, an unexpected error occurred while generating the response."
