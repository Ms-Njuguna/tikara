from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    is_organizer = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_organizer')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_organizer=validated_data.get('is_organizer', False)
        )
        return user