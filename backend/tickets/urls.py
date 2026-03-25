from django.urls import path
from .views import buy_ticket

urlpatterns = [
    path('buy/', buy_ticket),
]