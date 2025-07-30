from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator

class Genre(models.Model):
    """Predefined music genres"""
    name = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']

class Track(models.Model):
    STATUS_CHOICES = [
        ('uploaded', 'Uploaded'),
        ('processing', 'Processing'),
        ('distributed', 'Distributed'),
        ('failed', 'Failed'),
    ]
    
    # Basic Info
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tracks')
    
    # File uploads
    audio_file = models.FileField(
        upload_to='tracks/audio/',
        validators=[FileExtensionValidator(allowed_extensions=['mp3', 'wav', 'flac'])]
    )
    artwork = models.ImageField(
        upload_to='tracks/artwork/', 
        blank=True, 
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    
    # Metadata
    duration = models.DurationField(null=True, blank=True)
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, blank=True)
    release_date = models.DateField()
    explicit_content = models.BooleanField(default=False)
    
    # Distribution
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='uploaded')
    isrc = models.CharField(max_length=12, blank=True, help_text="International Standard Recording Code")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.artist.artist_name or self.artist.username}"
    
    class Meta:
        ordering = ['-created_at']