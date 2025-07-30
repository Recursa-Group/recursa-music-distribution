from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import ArtistRegistrationSerializer, ArtistSerializer, LoginSerializer
from .models import Artist

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = ArtistRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        artist = serializer.save()
        refresh = RefreshToken.for_user(artist)
        return Response({
            'artist': ArtistSerializer(artist).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            'artist': ArtistSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = ArtistSerializer(request.user)
    return Response(serializer.data)