from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Event(models.Model):
    EVENT_TYPE_CHOICES = (
        ('physical', 'Physical'),
        ('virtual', 'Virtual'),
        ('hybrid', 'Hybrid'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True, null=True)
    event_type = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES)

    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title