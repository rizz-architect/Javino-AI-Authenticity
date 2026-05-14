import os
from groq import Groq

from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client with API credentials from environment
groq_api_token = os.getenv("GROQ_TOKEN") or os.getenv("GROQ_API_KEY")
if not groq_api_token:
    raise ValueError("Groq API token not found. Set GROQ_TOKEN or GROQ_API_KEY environment variable.")
groq_client = Groq(api_key=groq_api_token)

try:
    chat_completion = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": "Hello, this is a test."}],
        model="llama-3.3-70b-versatile",
    )
    print(chat_completion.choices[0].message.content)
except Exception as e:
    print(f"GROQ ERROR: {e}")
