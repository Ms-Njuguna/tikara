from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Ticket
from .serializers import TicketSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def buy_ticket(request):
    data = request.data.copy()
    data['user'] = request.user.id
    data['is_paid'] = True  # simulate payment for now

    serializer = TicketSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)