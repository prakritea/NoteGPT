# # backend/services/flashcards_logic.py

# import os
# from typing import List
# from backend.models.schemas import FlashcardRequest, Card
# import openai

# # Ensure you have OPENAI_API_KEY in your environment
# openai.api_key = os.getenv("OPENAI_API_KEY")

# def generate_flashcards(req: FlashcardRequest) -> List[Card]:
#     """
#     Generate flashcards given topic / text / file_name.
#     If text is provided, use that. Otherwise use topic to prompt AI.
#     """
#     # Create prompt
#     prompt_parts = []
#     if req.topic:
#         prompt_parts.append(f"Topic: {req.topic}")
#     if req.text:
#         prompt_parts.append(f"Text: {req.text}")
#     if req.file_name:
#         prompt_parts.append(f"File: {req.file_name}")
    
#     prompt_body = "\n".join(prompt_parts) if prompt_parts else "Generate flashcards on a general topic."
    
#     prompt = (
#         f"Generate 5 flashcards (question-answer) from the following content:\n"
#         f"{prompt_body}\n\n"
#         f"Format the output as JSON list like this:\n"
#         f"[{{\"q\": \"Question one?\", \"a\": \"Answer one.\"}}, ...]"
#     )
    
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {"role": "system", "content": "You are a helpful assistant that creates flashcards."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.7,
#         max_tokens=200
#     )
    
#     content = response.choices[0].message.content.strip()
    
#     # Try to parse JSON from content
#     import json
#     try:
#         cards_list = json.loads(content)
#     except json.JSONDecodeError:
#         # Fallback: simple parsing
#         # Not ideal, but handle if AI didn't format exactly as JSON
#         cards_list = []
#         # e.g. split by lines, colon etc.
#         for line in content.splitlines():
#             if line.strip().startswith("{"):
#                 try:
#                     card = json.loads(line.strip().rstrip(','))
#                     if "q" in card and "a" in card:
#                         cards_list.append(card)
#                 except:
#                     continue
    
#     # Convert to List[Card]
#     result = []
#     for c in cards_list:
#         q = c.get("q", "").strip()
#         a = c.get("a", "").strip()
#         if q and a:
#             result.append(Card(q=q, a=a))
#     return result



from typing import List
from backend.models.schemas import FlashcardRequest, Card
from backend.utils.grok_helper import generate_grok_response
import json

def generate_flashcards(req: FlashcardRequest) -> List[Card]:
    """
    Generate flashcards given topic / text / file_name using Grok API.
    If text is provided, use that. Otherwise use topic to prompt AI.
    """
    # Create the prompt based on the user's input
    prompt_parts = []
    if req.topic:
        prompt_parts.append(f"Topic: {req.topic}")
    if req.text:
        prompt_parts.append(f"Text: {req.text}")
    if req.file_name:
        prompt_parts.append(f"File: {req.file_name}")
    
    # Create the body for the prompt
    prompt_body = "\n".join(prompt_parts) if prompt_parts else "Generate flashcards on a general topic."
    
    # Format the final prompt for Grok
    prompt = (
        f"Generate 5 flashcards (question-answer) from the following content:\n"
        f"{prompt_body}\n\n"
        f"Format the output as JSON list like this:\n"
        f"[{{\"q\": \"Question one?\", \"a\": \"Answer one.\"}}, ...]"
    )
    
    # Use Grok API to generate flashcards
    content = generate_grok_response(prompt)
    
    # Try parsing the Grok API response into flashcards
    try:
        # Attempt to load JSON from the response
        cards_list = json.loads(content)
    except json.JSONDecodeError:
        # Fallback parsing if the response is not in valid JSON format
        cards_list = []
        print(f"Response was not in expected JSON format. Response: {content}")
        # Simple fallback: Split by lines and attempt to extract flashcards manually
        for line in content.splitlines():
            # Look for lines that could represent flashcards (i.e., contain "q" and "a" fields)
            if line.strip().startswith("{"):
                try:
                    card = json.loads(line.strip().rstrip(','))
                    if "q" in card and "a" in card:
                        cards_list.append(card)
                except Exception as e:
                    # Print error if fallback parsing fails
                    print(f"Error parsing line into card: {line}. Error: {e}")
                    continue
    
    # Convert the parsed response into List[Card] for the application
    result = []
    for c in cards_list:
        q = c.get("q", "").strip()
        a = c.get("a", "").strip()
        if q and a:
            result.append(Card(q=q, a=a))
    
    return result
