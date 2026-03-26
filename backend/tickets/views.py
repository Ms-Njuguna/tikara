import qrcode
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Ticket, TicketType
from .serializers import TicketSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def buy_ticket(request):
    ticket_type_id = request.data.get("ticket_type")

    ticket_type = TicketType.objects.get(id=ticket_type_id)

    # check availability
    if ticket_type.quantity <= 0:
        return Response({"error": "Sold out"}, status=400)

    ticket_type.quantity -= 1
    ticket_type.save()

    ticket = Ticket.objects.create(
        user=request.user,
        event=ticket_type.event,
        ticket_type=ticket_type,
        is_paid=True
    )

    return Response({"message": "Ticket purchased 🎟️"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_tickets(request):
    tickets = Ticket.objects.filter(user=request.user)

    data = []
    for ticket in tickets:
        data.append({
            "event": ticket.event.title,
            "ticket_type": ticket.ticket_type.name,
            "qr_code": str(ticket.qr_code)
        })

    return Response(data)

def generate_qr(request, ticket_id):
    ticket = Ticket.objects.get(id=ticket_id)

    qr_data = str(ticket.qr_code)

    qr = qrcode.make(qr_data)

    response = HttpResponse(content_type="image/png")
    qr.save(response, "PNG")

    return response