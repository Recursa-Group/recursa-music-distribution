from django.urls import path
from . import views

urlpatterns = [
    path('tracks/', views.TrackListCreateView.as_view(), name='track-list-create'),
    path('tracks/<int:pk>/', views.TrackDetailView.as_view(), name='track-detail'),
    path('genres/', views.GenreListView.as_view(), name='genre-list'),
    path('upload/', views.upload_track, name='track-upload'),
]