from rest_framework import serializers
from .models import Event
from tickets.models import TicketType

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = ['id', 'name', 'price', 'quantity', 'group_size']


class EventSerializer(serializers.ModelSerializer):
    ticket_types = TicketTypeSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['organizer']