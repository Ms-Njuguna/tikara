from django.urls import path
from .views import buy_ticket, my_tickets, generate_qr

urlpatterns = [
    path('buy/', buy_ticket),
    path('my/', my_tickets),
    path("qr/<int:ticket_id>/", generate_qr),
]