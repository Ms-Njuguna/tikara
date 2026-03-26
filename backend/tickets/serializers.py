from rest_framework import serializers
from .models import Ticket, TicketType

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = '__all__'

    def validate(self, data):
        if data['name'] == 'group':
            group_size = data.get('group_size')

            if not group_size:
                raise serializers.ValidationError("Group tickets must have group_size")

            if group_size < 4 or group_size > 10:
                raise serializers.ValidationError("Group size must be between 4 and 10")

        return data