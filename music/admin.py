from django.contrib import admin
from .models import Genre, Track

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ['title', 'artist', 'genre', 'status', 'release_date', 'created_at']
    list_filter = ['status', 'genre', 'explicit_content', 'created_at']
    search_fields = ['title', 'artist__username', 'artist__artist_name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'artist', 'genre', 'release_date', 'explicit_content')
        }),
        ('Files', {
            'fields': ('audio_file', 'artwork')
        }),
        ('Metadata', {
            'fields': ('duration', 'isrc', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )