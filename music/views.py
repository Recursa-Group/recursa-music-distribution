from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Track, Genre
from .serializers import TrackSerializer, TrackUploadSerializer, GenreSerializer

class TrackListCreateView(generics.ListCreateAPIView):
    serializer_class = TrackSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        return Track.objects.filter(artist=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(artist=self.request.user)

class TrackDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TrackSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Track.objects.filter(artist=self.request.user)

class GenreListView(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_track(request):
    serializer = TrackUploadSerializer(data=request.data)
    if serializer.is_valid():
        track = serializer.save(artist=request.user)
        return Response(TrackSerializer(track).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)