from django.urls import path
from .views import get_events, create_event, assign_staff

urlpatterns = [
    path('', get_events),
    path('create/', create_event),
    path('<int:event_id>/assign-staff/', assign_staff),
]