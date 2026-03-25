from django.db import models
from django.conf import settings
from events.models import Event

User = settings.AUTH_USER_MODEL

class Ticket(models.Model):
    TICKET_TYPE_CHOICES = (
        ('earlybird', 'Earlybird'),
        ('regular', 'Regular'),
        ('vip', 'VIP'),
        ('vvip', 'VVIP'),
        ('group', 'Group'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets')

    ticket_type = models.CharField(max_length=10, choices=TICKET_TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    is_paid = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.event}"