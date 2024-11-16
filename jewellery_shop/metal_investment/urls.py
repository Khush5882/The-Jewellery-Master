from django.urls import path
from . import views

urlpatterns = [
    path("get-metal-investment-recommendation/", views.get_metal_investment_recommendation, name="get_metal_investment_recommendation"),
]
