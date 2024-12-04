import os
os.environ["API_KEY"] = "AIzaSyD9zU2jqbpQ-BXdg2Q180v6jjeGN0iboKw"
import google.generativeai as genai

genai.configure(api_key=os.environ["API_KEY"])
DocterApparao = genai.GenerativeModel("gemini-1.5-flash")
def generate_response_for_query(prompt):
    response = DocterApparao.generate_content(prompt+"generate respone in 3 points and the points should be small and clear")
    return response.text

def generate_remedy(stress_level):
    prompt = f"I'm experiencing a stress level of {stress_level} on a scale of 0 to 4. Can you suggest 3 simple, evidence-based techniques to manage stress effectively? Please keep each point brief and number them.Each point should be small a single line"
    response = DocterApparao.generate_content(prompt)
    return response.text

# Save user data to a file

