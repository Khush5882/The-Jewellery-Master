# views.py
from django.http import JsonResponse
from langchain_google_genai import GoogleGenerativeAI
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GOOGLE_GENAI_API_KEY')
llm = GoogleGenerativeAI(model="models/gemini-1.5-flash", google_api_key=api_key)

suggestion_prompt = PromptTemplate(
    input_variables=["preference"],
    template="Given the user preference: {preference}, provide jewelry suggestions suitable for the occasion, type, and budget and dont provide where to shop suggestions instead say shop on our website."
)

suggestion_chain = LLMChain(llm=llm, prompt=suggestion_prompt)

def get_jewelry_suggestions(request):
    user_preference = request.GET.get("preference", "")
    suggestions = suggestion_chain.run(preference=user_preference)
    return JsonResponse({"suggestions": suggestions})
