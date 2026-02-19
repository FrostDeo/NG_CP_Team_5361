from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Trip, Review, ContactMessage, UserProfile, TravelVlog


class TripForm(forms.ModelForm):
    """Form for creating and editing trips"""
    start_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}),
        help_text="When does your trip start?"
    )
    end_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}),
        help_text="When does your trip end?"
    )

    class Meta:
        model = Trip
        fields = [
            'destination', 'title', 'description', 'start_date', 'end_date',
            'travelers_count', 'daily_budget', 'travel_type', 'interests'
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
            'interests': forms.Textarea(attrs={
                'rows': 2,
                'placeholder': 'e.g., beaches, culture, food, adventure'
            }),
        }

    def clean(self):
        cleaned_data = super().clean()
        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')

        if start_date and end_date and start_date >= end_date:
            raise forms.ValidationError("End date must be after start date.")

        return cleaned_data


class ReviewForm(forms.ModelForm):
    """Form for creating and editing reviews"""
    visit_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}),
        help_text="When did you visit this destination?"
    )

    class Meta:
        model = Review
        fields = [
            'destination', 'rating', 'title', 'content', 'pros', 'cons',
            'visit_date', 'travel_type', 'recommended_budget'
        ]
        widgets = {
            'content': forms.Textarea(attrs={
                'rows': 4,
                'placeholder': 'Share your experience...'
            }),
            'pros': forms.Textarea(attrs={
                'rows': 2,
                'placeholder': 'What did you like?'
            }),
            'cons': forms.Textarea(attrs={
                'rows': 2,
                'placeholder': 'What could be improved?'
            }),
        }


class ContactForm(forms.ModelForm):
    """Form for contact messages"""

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']
        widgets = {
            'message': forms.Textarea(attrs={
                'rows': 5,
                'placeholder': 'How can we help you?'
            }),
        }


class UserProfileForm(forms.ModelForm):
    """Form for editing user profile"""
    TRAVEL_TYPES_CHOICES = [
        ('solo', 'Solo Travel'),
        ('family', 'Family Travel'),
        ('couple', 'Couple Travel'),
        ('adventure', 'Adventure Travel'),
        ('cultural', 'Cultural Travel'),
        ('luxury', 'Luxury Travel'),
    ]

    travel_types = forms.MultipleChoiceField(
        choices=TRAVEL_TYPES_CHOICES,
        widget=forms.CheckboxSelectMultiple,
        required=False,
        help_text="Select your preferred types of travel"
    )

    class Meta:
        model = UserProfile
        fields = [
            'bio', 'avatar', 'location', 'preferred_budget',
            'travel_types', 'favorite_destinations'
        ]
        widgets = {
            'bio': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': 'Tell us about yourself...'
            }),
            'favorite_destinations': forms.SelectMultiple(attrs={
                'class': 'form-control',
                'size': '5'
            }),
        }


class UserRegistrationForm(UserCreationForm):
    """Form for user registration"""
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        if commit:
            user.save()
            # Create user profile
            UserProfile.objects.create(user=user)
        return user


class UserUpdateForm(forms.ModelForm):
    """Form for updating user information"""
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']


class TripPlannerForm(forms.Form):
    """Form for trip planning"""
    destination = forms.ModelChoiceField(
        queryset=None,
        empty_label="Choose a destination",
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    duration = forms.IntegerField(
        min_value=1,
        max_value=30,
        initial=5,
        widget=forms.NumberInput(attrs={'class': 'form-control'}),
        help_text="Number of days"
    )
    travel_type = forms.ChoiceField(
        choices=[
            ('family', 'Family'),
            ('solo', 'Solo'),
            ('couple', 'Couple'),
            ('adventure', 'Adventure'),
        ],
        initial='family',
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    daily_budget = forms.IntegerField(
        min_value=500,
        max_value=50000,
        initial=2000,
        widget=forms.NumberInput(attrs={'class': 'form-control'}),
        help_text="Daily budget in rupees"
    )
    interests = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 2,
            'placeholder': 'e.g., beaches, culture, food, adventure'
        }),
        help_text="Optional: What are you interested in?"
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Import here to avoid circular imports
        from .models import Destination
        self.fields['destination'].queryset = Destination.objects.all()


class SearchForm(forms.Form):
    """Form for search functionality"""
    q = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search destinations, vlogs, reviews...'
        })
    )
    category = forms.ChoiceField(
        required=False,
        choices=[
            ('', 'All'),
            ('destinations', 'Destinations'),
            ('vlogs', 'Vlogs'),
            ('reviews', 'Reviews'),
        ],
        widget=forms.Select(attrs={'class': 'form-control'})
    )


class VlogUploadForm(forms.ModelForm):
    """Form for uploading vlogs"""
    tags = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'placeholder': 'Enter tags separated by commas'
        }),
        help_text="Separate tags with commas"
    )

    class Meta:
        model = TravelVlog
        fields = [
            'title', 'description', 'destination', 'type',
            'video_url', 'video_file', 'tags'
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
            'video_url': forms.URLInput(attrs={
                'placeholder': 'YouTube or Vimeo URL'
            }),
            'video_file': forms.FileInput(attrs={
                'accept': 'video/*',
                'class': 'form-control'
            }),
        }

    def clean(self):
        cleaned_data = super().clean()
        video_url = cleaned_data.get('video_url')
        video_file = cleaned_data.get('video_file')

        if not video_url and not video_file:
            raise forms.ValidationError("Please provide either a video URL or upload a video file.")
        
        if video_url and video_file:
            raise forms.ValidationError("Please provide only one video source (URL or file).")

        if video_file:
            if video_file.size > 500 * 1024 * 1024:
                raise forms.ValidationError("Video file too large (max 500MB).")
            if not video_file.content_type.startswith('video/'):
                raise forms.ValidationError("Invalid file type. Please upload a video.")

        return cleaned_data

    def clean_tags(self):
        tags = self.cleaned_data.get('tags', '')
        if tags:
            return [tag.strip() for tag in tags.split(',') if tag.strip()]
        return []

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.tags = self.cleaned_data.get('tags', [])
        if commit:
            instance.save()
        return instance

