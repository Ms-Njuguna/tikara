from django.urls import path
from .views import buy_ticket, my_tickets, generate_qr, verify_ticket

urlpatterns = [
    path('buy/', buy_ticket),
    path('my/', my_tickets),
    path("qr/<int:ticket_id>/", generate_qr),
    path("verify/", verify_ticket),
]