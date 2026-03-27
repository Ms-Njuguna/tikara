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

class EventStaff(models.Model):
    PERMISSION_CHOICES = (
        ('scan', 'Scan Only'),
        ('manage', 'Manage Event'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey("Event", on_delete=models.CASCADE, related_name="staff")

    permission = models.CharField(max_length=20, choices=PERMISSION_CHOICES, default='scan')

    expires_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def is_active(self):
        from django.utils import timezone
        return not self.expires_at or self.expires_at > timezone.now()

    def __str__(self):
        return f"{self.user} - {self.event}"