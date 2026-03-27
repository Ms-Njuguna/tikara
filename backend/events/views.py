from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Event
from .serializers import EventSerializer
from tickets.models import TicketType


# GET all events
@api_view(['GET'])
def get_events(request):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


# CREATE event
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    user = request.user

    if user.role != "organizer":
        return Response({"error": "Only organizers can create events"}, status=403)

    ticket_data = request.data.get("ticket_types", [])

    event_serializer = EventSerializer(data=request.data)

    if event_serializer.is_valid():
        event = event_serializer.save(organizer=user)

        created_tickets = []

        for ticket in ticket_data:
            try:
                group_size = ticket.get("group_size")

                # 🔥 convert empty string to None
                if group_size == "":
                    group_size = None

                ticket_obj = TicketType.objects.create(
                    event=event,
                    name=ticket["name"],
                    price=ticket["price"],
                    quantity=ticket["quantity"],
                    group_size=group_size
                )
                created_tickets.append(ticket_obj.id)
            except Exception as e:
                return Response(
                    {"error": f"Ticket creation failed: {str(e)}"},
                    status=400
                )

        return Response({
            "message": "Event + tickets created 🎉",
            "event_id": event.id,
            "ticket_types": created_tickets
        }, status=201)

    return Response(event_serializer.errors, status=400)