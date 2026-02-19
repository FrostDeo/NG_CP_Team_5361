from django.db import models
import re
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Destination(models.Model):
    """Model for travel destinations"""
    name = models.CharField(max_length=100, unique=True)
    tagline = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=100, help_text="e.g., Family, Honeymoon, Adventure")
    budget = models.CharField(max_length=20, choices=[
        ('Low', 'Low Budget'),
        ('Medium', 'Medium Budget'),
        ('High', 'Luxury Budget')

























        
    ])
    best_time = models.CharField(max_length=100)
    bad_time = models.CharField(max_length=100, blank=True)
    state_image = models.URLField(help_text="URL to destination image")
    state_image = models.URLField(help_text="URL to destination image")
    languages = models.CharField(max_length=200, help_text="Comma-separated languages (e.g. English, Hindi)", default="")

    def get_languages_list(self):
        """Return languages as a list"""
        if not self.languages:
            return []
        return [lang.strip() for lang in self.languages.split(',')]

    # Expenses breakdown
    stay_cost = models.DecimalField(max_digits=8, decimal_places=2, help_text="Average cost per night")
    food_cost = models.DecimalField(max_digits=8, decimal_places=2, help_text="Average cost per day")
    transport_cost = models.DecimalField(max_digits=8, decimal_places=2, help_text="Average transport cost")
    activities_cost = models.DecimalField(max_digits=8, decimal_places=2, help_text="Average activities cost")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_total_daily_cost(self):
        """Calculate total daily cost"""
        return self.stay_cost + self.food_cost + self.transport_cost + self.activities_cost


class FoodItem(models.Model):
    """Model for food items at destinations"""
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='food_items')
    dish = models.CharField(max_length=100)
    price = models.CharField(max_length=50, help_text="Price range, e.g., ₹60–120")
    is_vegetarian = models.BooleanField(default=True)
    image = models.URLField(blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.dish} - {self.destination.name}"


class TravelVlog(models.Model):
    """Model for travel vlogs"""
    VLOG_TYPES = [
        ('local-insider', 'Local Insider'),
        ('budget-travel', 'Budget Travel'),
        ('food-tour', 'Food Tour'),
        ('adventure', 'Adventure'),
        ('cultural', 'Cultural'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='vlogs')
    type = models.CharField(max_length=20, choices=VLOG_TYPES)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vlogs')

    # Media
    thumbnail = models.URLField(blank=True, null=True)
    video_url = models.URLField(blank=True, null=True, help_text="YouTube or Vimeo URL")
    video_file = models.FileField(upload_to='vlogs/', blank=True, null=True, help_text="Upload video file")
    duration = models.CharField(max_length=10, blank=True, null=True, help_text="e.g., 12:34")

    # Stats
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    upload_date = models.DateField(auto_now_add=True)

    # Metadata
    tags = models.JSONField(default=list, help_text="List of tags")
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-upload_date']

    def __str__(self):
        return self.title

    def get_embed_url(self):
        """Convert YouTube URL to embed URL"""
        if not self.video_url:
            return ""
        
        # Handle youtube.com/watch?v=ID
        match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', self.video_url)
        if match:
            return f"https://www.youtube.com/embed/{match.group(1)}"
            
        return self.video_url


class UserProfile(models.Model):
    """Extended user profile for travel preferences"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)

    # Travel preferences
    preferred_budget = models.CharField(max_length=20, choices=[
        ('Low', 'Budget Traveler'),
        ('Medium', 'Mid-range'),
        ('High', 'Luxury Traveler')
    ], default='Medium')

    travel_types = models.JSONField(default=list, help_text="Preferred travel types")
    favorite_destinations = models.ManyToManyField(Destination, blank=True)

    # Stats
    trips_taken = models.PositiveIntegerField(default=0)
    total_reviews = models.PositiveIntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00,
                                       validators=[MinValueValidator(0), MaxValueValidator(5)])

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Trip(models.Model):
    """Model for planned trips"""
    TRIP_STATUS = [
        ('planned', 'Planned'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    # Trip details
    start_date = models.DateField()
    end_date = models.DateField()
    duration_days = models.PositiveIntegerField()
    travelers_count = models.PositiveIntegerField(default=1)

    # Budget
    daily_budget = models.DecimalField(max_digits=8, decimal_places=2)
    total_budget = models.DecimalField(max_digits=10, decimal_places=2)

    # Travel details
    travel_type = models.CharField(max_length=50, help_text="e.g., Family, Solo, Couple")
    interests = models.JSONField(default=list, help_text="List of interests")

    # Status
    status = models.CharField(max_length=20, choices=TRIP_STATUS, default='planned')
    rating = models.PositiveIntegerField(null=True, blank=True,
                                       validators=[MinValueValidator(1), MaxValueValidator(5)])

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"

    def save(self, *args, **kwargs):
        # Calculate duration and total budget
        if self.start_date and self.end_date:
            self.duration_days = (self.end_date - self.start_date).days + 1
            self.total_budget = self.daily_budget * self.duration_days
        super().save(*args, **kwargs)


class TripDay(models.Model):
    """Individual days within a trip"""
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='days')
    day_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    activities = models.JSONField(default=list, help_text="List of activities for the day")

    class Meta:
        ordering = ['day_number']
        unique_together = ['trip', 'day_number']

    def __str__(self):
        return f"Day {self.day_number}: {self.title}"


class Review(models.Model):
    """Model for destination reviews"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='reviews')
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, null=True, blank=True)

    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=200)
    content = models.TextField()
    pros = models.TextField(blank=True, help_text="What you liked")
    cons = models.TextField(blank=True, help_text="What could be improved")

    # Review metadata
    visit_date = models.DateField()
    travel_type = models.CharField(max_length=50, help_text="e.g., Family, Solo, Business")
    recommended_budget = models.CharField(max_length=20, choices=[
        ('Low', 'Low Budget'),
        ('Medium', 'Medium Budget'),
        ('High', 'Luxury Budget')
    ])

    # Moderation
    is_verified = models.BooleanField(default=False)
    helpful_votes = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'destination']  # One review per user per destination

    def __str__(self):
        return f"{self.user.username}'s review of {self.destination.name}"


class ContactMessage(models.Model):
    """Model for contact form messages"""
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.name}"

