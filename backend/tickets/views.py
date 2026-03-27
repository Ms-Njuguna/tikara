import qrcode
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Ticket, TicketType
from .serializers import TicketSerializer
from events.models import EventStaff


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
            "id": ticket.id,
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_ticket(request):
    qr_code = request.data.get("qr_code")

    try:
        ticket = Ticket.objects.get(qr_code=qr_code)

        # 🔐 CHECK STAFF ACCESS
        if request.user.role == "staff":
            staff_record = EventStaff.objects.filter(
                user=request.user,
                event=ticket.event
            ).first()

            if not staff_record or not staff_record.is_active():
                return Response({
                    "status": "error",
                    "message": "No access to this event ❌"
                }, status=403)

        # ❌ already used
        if ticket.is_used:
            return Response({
                "status": "warning",
                "message": "Ticket already used ⚠️"
            })

        ticket.is_used = True
        ticket.save()

        return Response({
            "status": "success",
            "message": f"Welcome to {ticket.event.title} 🎉"
        })

    except Ticket.DoesNotExist:
        return Response({
            "status": "error",
            "message": "Invalid ticket ❌"
        }, status=400)