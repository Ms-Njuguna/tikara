from django.urls import path
from .views import register_user, login_user, create_staff

urlpatterns = [
    path('register/', register_user),
    path('login/', login_user),
    path('create-staff/', create_staff),  # 🔥 ADD THIS
]