from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Artist

@admin.register(Artist)
class ArtistAdmin(UserAdmin):
    # Add our custom fields to the admin interface
    fieldsets = UserAdmin.fieldsets + (
        ('Artist Info', {
            'fields': ('artist_name', 'bio', 'profile_image', 'website', 'spotify_url', 'instagram_handle')
        }),
    )
    
    list_display = ['username', 'artist_name', 'email', 'is_staff', 'created_at']
    list_filter = ['is_staff', 'is_superuser', 'created_at']