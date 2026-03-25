from django.urls import path
from .views import get_events, create_event

urlpatterns = [
    path('', get_events),
    path('create/', create_event),
]