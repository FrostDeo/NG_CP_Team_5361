from django.contrib import admin
from .models import (
    Destination, FoodItem, TravelVlog, UserProfile,
    Trip, TripDay, Review, ContactMessage
)


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'tagline', 'budget', 'best_time', 'created_at']
    list_filter = ['budget', 'type', 'created_at']
    search_fields = ['name', 'tagline', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'tagline', 'description', 'type', 'budget')
        }),
        ('Timing & Location', {
            'fields': ('best_time', 'bad_time', 'state_image', 'languages')
        }),
        ('Costs', {
            'fields': ('stay_cost', 'food_cost', 'transport_cost', 'activities_cost')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    list_display = ['dish', 'destination', 'price', 'is_vegetarian']
    list_filter = ['is_vegetarian', 'destination']
    search_fields = ['dish', 'description']


@admin.register(TravelVlog)
class TravelVlogAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'destination', 'type', 'views', 'likes', 'featured', 'upload_date']
    list_filter = ['type', 'featured', 'upload_date', 'destination']
    search_fields = ['title', 'description', 'author__username']
    readonly_fields = ['views', 'likes', 'upload_date']
    list_editable = ['featured']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'location', 'preferred_budget', 'trips_taken', 'average_rating']
    list_filter = ['preferred_budget', 'created_at']
    search_fields = ['user__username', 'user__email', 'location']
    readonly_fields = ['trips_taken', 'total_reviews', 'average_rating', 'created_at']


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'destination', 'start_date', 'end_date', 'status', 'total_budget']
    list_filter = ['status', 'travel_type', 'start_date', 'destination']
    search_fields = ['title', 'user__username', 'destination__name']
    readonly_fields = ['duration_days', 'total_budget', 'created_at', 'updated_at']
    date_hierarchy = 'start_date'


@admin.register(TripDay)
class TripDayAdmin(admin.ModelAdmin):
    list_display = ['trip', 'day_number', 'title']
    list_filter = ['trip__destination', 'trip__user']
    search_fields = ['title', 'description']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'destination', 'rating', 'title', 'is_verified', 'helpful_votes', 'created_at']
    list_filter = ['rating', 'is_verified', 'visit_date', 'recommended_budget']
    search_fields = ['title', 'content', 'user__username', 'destination__name']
    readonly_fields = ['helpful_votes', 'created_at', 'updated_at']
    list_editable = ['is_verified']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']
    list_editable = ['is_read']
