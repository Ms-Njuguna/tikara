from django.db import models
from django.conf import settings
from events.models import Event
import uuid

User = settings.AUTH_USER_MODEL

class TicketType(models.Model):
    TICKET_TYPE_CHOICES = (
        ('earlybird', 'Earlybird'),
        ('regular', 'Regular'),
        ('vip', 'VIP'),
        ('vvip', 'VVIP'),
        ('group', 'Group'),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='ticket_types')

    name = models.CharField(max_length=20, choices=TICKET_TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    quantity = models.PositiveIntegerField()  # ✅ prevents negative values

    group_size = models.PositiveIntegerField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # 🔥 enforce group logic
        if self.name == 'group':
            if not self.group_size:
                raise ValueError("Group tickets must have a group_size")
            if self.group_size < 4 or self.group_size > 10:
                raise ValueError("Group size must be between 4 and 10")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.event} - {self.name}"

class Ticket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets')

    ticket_type = models.ForeignKey(TicketType, on_delete=models.CASCADE)
    qr_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    is_paid = models.BooleanField(default=False)
    is_used = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.event}"