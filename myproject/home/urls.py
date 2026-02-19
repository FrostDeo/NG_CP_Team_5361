from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
    # Home page
    path('', views.index, name='index'),

    # Authentication
    path('logout/', views.custom_logout, name='logout'),
    path('register/', views.register, name='register'),

    # Destination views
    path('destinations/', views.DestinationListView.as_view(), name='destinations'),
    path('destinations/<int:pk>/', views.DestinationDetailView.as_view(), name='destination_detail'),

    # Vlog views
    path('vlogs/', views.VlogListView.as_view(), name='vlogs'),
    path('vlogs/upload/', views.VlogCreateView.as_view(), name='upload_vlog'),
    path('vlogs/<int:pk>/', views.VlogDetailView.as_view(), name='vlog_detail'),
    path('vlogs/<int:pk>/edit/', views.VlogUpdateView.as_view(), name='edit_vlog'),


    # User profile views
    path('profile/', views.profile, name='profile'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),

    # Review views
    path('reviews/create/', views.ReviewCreateView.as_view(), name='create_review'),
    path('reviews/<int:pk>/edit/', views.ReviewUpdateView.as_view(), name='edit_review'),
    path('reviews/<int:pk>/delete/', views.ReviewDeleteView.as_view(), name='delete_review'),

    # Contact view
    path('contact/', views.contact, name='contact'),

    # AI Guide
    path('ai-guide/', views.ai_guide, name='ai_guide'),
    path('ai-chat/', views.ai_chat, name='ai_chat'),

    # Search
    path('search/', views.search, name='search'),

    # AJAX endpoints
    path('api/destinations/<int:destination_id>/', views.get_destination_data, name='destination_data'),
    path('api/vlogs/<int:vlog_id>/like/', views.like_vlog, name='like_vlog'),

    # Trip planning views
    path('trip-planner/', views.trip_planner, name='trip_planner'),
    path('generate-itinerary/', views.generate_itinerary, name='generate_itinerary'),
    path('my-trips/', views.TripListView.as_view(), name='my_trips'),
    path('trips/<int:pk>/', views.TripDetailView.as_view(), name='trip_detail'),
    path('trips/<int:pk>/complete/', views.mark_trip_completed, name='mark_trip_completed'),
    path('trips/create/', views.create_trip, name='create_trip'),
]