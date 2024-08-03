from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.AutoField(primary_key=True)  # Django creará el ID automáticamente
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(null=True)
    is_superuser = models.BooleanField(default=0)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=254)
    is_staff = models.BooleanField(default=0)
    is_active = models.BooleanField(default=1)
    date_joined = models.DateTimeField(auto_now_add=True, auto_now=False)
    def __str__(self):
        return f"{self.username}"