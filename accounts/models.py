from django.contrib.auth.models import AbstractUser
from django.db import models

class Artist(AbstractUser):
    # Additional fields beyond the default User
    artist_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    website = models.URLField(blank=True)
    spotify_url = models.URLField(blank=True)
    instagram_handle = models.CharField(max_length=50, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.artist_name or self.username
    
    class Meta:
        verbose_name = "Artist"
        verbose_name_plural = "Artists"
        