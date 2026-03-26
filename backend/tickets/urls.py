from django.urls import path
from .views import buy_ticket, my_tickets

urlpatterns = [
    path('buy/', buy_ticket),
    path('my/', my_tickets),
]