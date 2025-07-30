from rest_framework import serializers
from .models import Track, Genre

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class TrackSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source='artist.artist_name', read_only=True)
    genre_name = serializers.CharField(source='genre.name', read_only=True)
    
    class Meta:
        model = Track
        fields = [
            'id', 'title', 'artist', 'artist_name', 'audio_file', 'artwork', 
            'duration', 'genre', 'genre_name', 'release_date', 'explicit_content',
            'status', 'isrc', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'artist', 'created_at', 'updated_at', 'status']
    
    def create(self, validated_data):
        validated_data['artist'] = self.context['request'].user
        return super().create(validated_data)

class TrackUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['title', 'audio_file', 'artwork', 'genre', 'release_date', 'explicit_content']