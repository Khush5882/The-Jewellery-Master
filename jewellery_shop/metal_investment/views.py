from django.http import JsonResponse
import requests
from requests.structures import CaseInsensitiveDict
import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

load_dotenv()  # Load environment variables

# Initialize GenAI model for LangChain
api_key = os.getenv('GOOGLE_GENAI_API_KEY')
llm = GoogleGenerativeAI(model="models/gemini-1.5-flash", google_api_key=api_key)

# Define the prompt template for generating investment recommendations
investment_prompt = PromptTemplate(
    input_variables=["metal_data"],
    template="Given the following metal data: {metal_data}, generate an investment recommendation based on current metal prices and making costs. Provide a recommendation whether it's a good idea to invest in each metal. Consider the user's budget constraints and suggest the best investment choices."
)

# Set up the LangChain LLMChain with the investment prompt
investment_chain = LLMChain(llm=llm, prompt=investment_prompt)

def get_metal_investment_recommendation(request):
    api_key = os.getenv("API_KEY")
    url = f"https://api.metals.dev/v1/latest?api_key=41XQGJR7V9ETRGWX23LU307WX23LU&currency=USD&unit=toz"
    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"

    try:
        # Request the latest metal prices
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Check for HTTP errors
        data = response.json()

        # Parse metal prices from the API response
        metals_data = data.get("metals", {})
        investment_recommendations = {}

        # Generate investment recommendations for each metal
        for metal, price in metals_data.items():
            investment_cost = price * 1.1  # Add 10% to the base price as making cost
            recommendation = "Yes" if investment_cost < 2000 else "No"
            investment_recommendations[metal] = {
                "price": price,
                "investment_cost": investment_cost,
                "recommendation": recommendation
            }

        # Format the metal data into a string for the model
        metal_data_string = "\n".join(
            [f"{metal}: Price: {details['price']}, Investment Cost: {details['investment_cost']}, Recommendation: {details['recommendation']}" 
             for metal, details in investment_recommendations.items()]
        )

        # Generate decision and suggestions using GenAI Flash through LangChain
        user_preference = request.GET.get("preference", "")  # Get user's preference
        investment_suggestions = investment_chain.run(metal_data=metal_data_string)
        
        # Return the processed data as JSON
        return JsonResponse({
            "status": data.get("status", "unknown"),
            "currency": data.get("currency", "USD"),
            "unit": data.get("unit", "toz"),
            "timestamp": data.get("timestamps", {}).get("metal", ""),
            "investment_recommendations": investment_recommendations,
            "investment_suggestions": investment_suggestions  # LangChain generated suggestions
        })

    except requests.RequestException as e:
        # Return an error message if the API request fails
        return JsonResponse({"error": f"Request failed: {str(e)}"}, status=500)
