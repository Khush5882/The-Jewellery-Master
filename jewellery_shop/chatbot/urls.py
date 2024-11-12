# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("get_suggestions/", views.get_jewelry_suggestions, name="get_suggestions"),
]
