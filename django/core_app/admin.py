from django.contrib import admin
from core_app.models import User

@admin.register(User)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['username']