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

    if not user.is_organizer:
        return Response({"error": "Only organizers can create events"}, status=403)

    ticket_data = request.data.pop("ticket_types", [])

    event_serializer = EventSerializer(data=request.data)

    if event_serializer.is_valid():
        event = event_serializer.save(organizer=user)

        # 🔥 CREATE TICKET TYPES
        for ticket in ticket_data:
            TicketType.objects.create(
                event=event,
                name=ticket["name"],
                price=ticket["price"],
                quantity=ticket["quantity"],
                group_size=ticket.get("group_size")
            )

        return Response({"message": "Event + tickets created 🎉"}, status=201)

    return Response(event_serializer.errors, status=400)