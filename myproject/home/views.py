from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.forms import UserCreationForm
from django.db.models import Q, Avg, Count
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy, reverse
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.utils import timezone
from .models import (
    Destination, FoodItem, TravelVlog, UserProfile,
    Trip, TripDay, Review, ContactMessage
)
from .forms import TripForm, ReviewForm, ContactForm, UserProfileForm, VlogUploadForm


def custom_logout(request):
    """Custom logout view that renders our template"""
    logout(request)
    return redirect('home:index')


def register(request):
    """User registration view"""
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Account created successfully! You can now log in.')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'home/register.html', {'form': form})


# Home Page View
def index(request):
    """Home page with featured destinations and vlogs"""
    featured_destinations = Destination.objects.all()[:6]
    featured_vlogs = TravelVlog.objects.filter(featured=True)[:4]
    recent_reviews = Review.objects.select_related('user', 'destination').order_by('-created_at')[:3]

    context = {
        'featured_destinations': featured_destinations,
        'featured_vlogs': featured_vlogs,
        'recent_reviews': recent_reviews,
    }
    return render(request, 'home/index.html', context)


# Destination Views
class DestinationListView(ListView):
    """List all destinations with search and filtering"""
    model = Destination
    template_name = 'home/destinations.html'
    context_object_name = 'destinations'
    paginate_by = 12

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.GET.get('q')
        budget_filter = self.request.GET.get('budget')
        type_filter = self.request.GET.get('type')

        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(tagline__icontains=search_query)
            )

        if budget_filter:
            queryset = queryset.filter(budget=budget_filter)

        if type_filter:
            queryset = queryset.filter(type__icontains=type_filter)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_query'] = self.request.GET.get('q', '')
        context['budget_filter'] = self.request.GET.get('budget', '')
        context['type_filter'] = self.request.GET.get('type', '')
        return context


class DestinationDetailView(DetailView):
    """Detailed view of a destination"""
    model = Destination
    template_name = 'home/destination_detail.html'
    context_object_name = 'destination'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        destination = self.get_object()

        # Get related data
        context['food_items'] = destination.food_items.all()
        context['vlogs'] = destination.vlogs.all()[:6]
        context['reviews'] = destination.reviews.select_related('user').order_by('-created_at')[:5]
        context['average_rating'] = destination.reviews.aggregate(Avg('rating'))['rating__avg'] or 0
        context['review_count'] = destination.reviews.count()

        # Calculate costs
        context['total_daily_cost'] = destination.get_total_daily_cost()

        return context


# Travel Vlog Views
class VlogListView(ListView):
    """List all travel vlogs with filtering"""
    model = TravelVlog
    template_name = 'home/vlogs.html'
    context_object_name = 'vlogs'
    paginate_by = 12

    def get_queryset(self):
        queryset = super().get_queryset().select_related('destination', 'author')
        search_query = self.request.GET.get('q')
        type_filter = self.request.GET.get('type')
        destination_filter = self.request.GET.get('destination')
        sort_by = self.request.GET.get('sort', 'latest')

        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(tags__icontains=search_query)
            )

        if type_filter:
            queryset = queryset.filter(type=type_filter)

        if destination_filter:
            queryset = queryset.filter(destination__name__icontains=destination_filter)

        # Sorting
        if sort_by == 'popular':
            queryset = queryset.order_by('-views')
        elif sort_by == 'liked':
            queryset = queryset.order_by('-likes')
        elif sort_by == 'oldest':
            queryset = queryset.order_by('upload_date')
        else:  # latest
            queryset = queryset.order_by('-upload_date')

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'search_query': self.request.GET.get('q', ''),
            'type_filter': self.request.GET.get('type', ''),
            'destination_filter': self.request.GET.get('destination', ''),
            'sort_by': self.request.GET.get('sort', 'latest'),
            'total_vlogs': self.get_queryset().count(),
            'total_views': sum(vlog.views for vlog in self.get_queryset()),
            'total_likes': sum(vlog.likes for vlog in self.get_queryset()),
        })
        return context


class VlogDetailView(DetailView):
    """Detailed view of a vlog"""
    model = TravelVlog
    template_name = 'home/vlog_detail.html'
    context_object_name = 'vlog'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        vlog = self.get_object()

        # Increment view count
        vlog.views += 1
        vlog.save(update_fields=['views'])

        # Get related vlogs
        context['related_vlogs'] = TravelVlog.objects.filter(
            destination=vlog.destination
        ).exclude(id=vlog.id)[:4]

        return context


class VlogCreateView(LoginRequiredMixin, CreateView):
    """Upload a new vlog"""
    model = TravelVlog
    form_class = VlogUploadForm
    template_name = 'home/vlog_form.html'
    success_url = reverse_lazy('home:vlogs')

    def form_valid(self, form):
        form.instance.author = self.request.user
        messages.success(self.request, 'Vlog uploaded successfully!')
        return super().form_valid(form)


class VlogUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    """Edit an existing vlog (Admins only)"""
    model = TravelVlog
    form_class = VlogUploadForm
    template_name = 'home/vlog_form.html'
    success_url = reverse_lazy('home:vlogs')

    def test_func(self):
        # Only allow staff/admin users to edit
        return self.request.user.is_staff

    def handle_no_permission(self):
        messages.error(self.request, "You do not have permission to edit vlogs.")
        return redirect('home:vlogs')

    def form_valid(self, form):
        messages.success(self.request, 'Vlog updated successfully!')
        return super().form_valid(form)


        return context


class VlogCreateView(LoginRequiredMixin, CreateView):
    """Upload a new vlog"""
    model = TravelVlog
    form_class = VlogUploadForm
    template_name = 'home/vlog_form.html'
    success_url = reverse_lazy('home:vlogs')

    def form_valid(self, form):
        form.instance.author = self.request.user
        messages.success(self.request, 'Vlog uploaded successfully!')
        return super().form_valid(form)


class VlogUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    """Edit an existing vlog (Admins only)"""
    model = TravelVlog
    form_class = VlogUploadForm
    template_name = 'home/vlog_form.html'
    success_url = reverse_lazy('home:vlogs')

    def test_func(self):
        # Only allow staff/admin users to edit
        return self.request.user.is_staff

    def handle_no_permission(self):
        messages.error(self.request, "You do not have permission to edit vlogs.")
        return redirect('home:vlogs')

    def form_valid(self, form):
        messages.success(self.request, 'Vlog updated successfully!')
        return super().form_valid(form)


# Trip Planning Views
@login_required
def trip_planner(request):
    """Trip planner page"""
    destinations = Destination.objects.all()
    # Fetch planned and completed (visited) trips
    planned_trips = Trip.objects.filter(user=request.user, status='planned').order_by('-created_at')
    visited_trips = Trip.objects.filter(user=request.user, status='completed').order_by('-created_at')
    
    return render(request, 'home/trip_planner.html', {
        'destinations': destinations,
        'planned_trips': planned_trips,
        'visited_trips': visited_trips
    })


@login_required
def generate_itinerary(request):
    """AJAX view to generate trip itinerary"""
    if request.method == 'POST':
        destination_id = request.POST.get('destination')
        duration = int(request.POST.get('duration', 5))
        travel_type = request.POST.get('travel_type', 'family')
        
        # Handle budget input (Low/Medium/High)
        budget_input = request.POST.get('budget', 'Medium')
        budget_map = {
            'Low': 2000.0,  # ₹2,000 per day
            'Medium': 5000.0,  # ₹5,000 per day
            'High': 10000.0   # ₹10,000 per day
        }
        # Try to parse as float if not in map (fallback), otherwise use map
        try:
            daily_budget = float(budget_input)
        except ValueError:
            daily_budget = budget_map.get(budget_input, 5000.0)
            
        interests = request.POST.getlist('interests[]')

        try:
            destination = Destination.objects.get(id=destination_id)

            # Create trip
            trip = Trip.objects.create(
                user=request.user,
                destination=destination,
                title=f"{travel_type.title()} Trip to {destination.name}",
                start_date=timezone.now().date(),
                end_date=timezone.now().date() + timezone.timedelta(days=duration-1),
                duration_days=duration,
                daily_budget=daily_budget,
                travel_type=travel_type,
                interests=interests,
                status='planned'
            )

            # Generate itinerary days
            generate_trip_days(trip)

            # Serialize trip days for frontend
            trip_days = []
            for day in trip.days.all():
                trip_days.append({
                    'day': day.day_number,
                    'title': day.title,
                    'description': day.description,
                    'activities': day.activities
                })

            return JsonResponse({
                'success': True,
                'trip_id': trip.id,
                'message': 'Trip itinerary generated successfully!',
                'days': trip_days,
                'destination_name': destination.name,
                'trip_title': trip.title,
                'image_url': destination.state_image
            })

        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            })

    return JsonResponse({'success': False, 'message': 'Invalid request'})


def generate_trip_days(trip):
    """Generate sample itinerary for trip days"""
    activities = {
        'family': [
            "Visit local temples and cultural sites",
            "Enjoy traditional cuisine at local restaurants",
            "Relax at beaches/resorts",
            "Shopping at local markets",
            "Nature walks and sightseeing"
        ],
        'solo': [
            "Explore hidden gems and local spots",
            "Try adventure activities",
            "Visit cafes and work remotely",
            "Cultural immersion activities",
            "Photography and journaling"
        ],
        'couple': [
            "Romantic dinners and sunsets",
            "Spa treatments and relaxation",
            "Private boat rides or tours",
            "Photography sessions",
            "Local festival participation"
        ],
        'adventure': [
            "Trekking and hiking",
            "Water sports and activities",
            "Wildlife safaris",
            "Camping experiences",
            "Extreme sports"
        ]
    }

    base_activities = activities.get(trip.travel_type, activities['family'])

    for day in range(1, trip.duration_days + 1):
        day_activities = base_activities[:3]  # 3 activities per day

        TripDay.objects.create(
            trip=trip,
            day_number=day,
            title=f"Day {day} in {trip.destination.name}",
            description=f"Explore the beauty of {trip.destination.name}",
            activities=day_activities
        )


class TripListView(LoginRequiredMixin, ListView):
    """List user's trips"""
    model = Trip
    template_name = 'home/my_trips.html'
    context_object_name = 'trips'
    paginate_by = 10

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).prefetch_related('destination')


class TripDetailView(LoginRequiredMixin, DetailView):
    """Detailed view of a trip"""
    model = Trip
    template_name = 'home/trip_detail.html'
    context_object_name = 'trip'

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).prefetch_related('days', 'destination')


# User Profile Views
@login_required
def profile(request):
    """User profile page"""
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    trips = Trip.objects.filter(user=request.user)
    reviews = Review.objects.filter(user=request.user).select_related('destination')

    context = {
        'user_profile': user_profile,
        'trips': trips,
        'reviews': reviews,
        'trips_count': trips.count(),
        'reviews_count': reviews.count(),
        'average_rating': reviews.aggregate(Avg('rating'))['rating__avg'] or 0,
    }
    return render(request, 'home/profile.html', context)


@login_required
def edit_profile(request):
    """Edit user profile"""
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=user_profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('profile')
    else:
        form = UserProfileForm(instance=user_profile)

    return render(request, 'home/edit_profile.html', {'form': form})


# Review Views
class ReviewCreateView(LoginRequiredMixin, CreateView):
    """Create a new review"""
    model = Review
    form_class = ReviewForm
    template_name = 'home/create_review.html'
    success_url = reverse_lazy('profile')

    def form_valid(self, form):
        form.instance.user = self.request.user
        messages.success(self.request, 'Review submitted successfully!')
        return super().form_valid(form)


class ReviewUpdateView(LoginRequiredMixin, UpdateView):
    """Update an existing review"""
    model = Review
    form_class = ReviewForm
    template_name = 'home/edit_review.html'

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def get_success_url(self):
        return reverse('destination_detail', kwargs={'pk': self.object.destination.pk})


class ReviewDeleteView(LoginRequiredMixin, DeleteView):
    """Delete a review"""
    model = Review
    template_name = 'home/delete_review.html'

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def get_success_url(self):
        return reverse('profile')


# Contact View
def contact(request):
    """Contact form"""
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Message sent successfully! We\'ll get back to you soon.')
            return redirect('contact')
    else:
        form = ContactForm()

    return render(request, 'home/contact.html', {'form': form})


# AI Chat View
def ai_guide(request):
    """AI travel assistant page"""
    return render(request, 'home/ai_guide.html')


def ai_chat(request):
    """AJAX endpoint for AI chat"""
    if request.method == 'POST':
        message = request.POST.get('message', '').lower()

        # Simple AI responses based on keywords
        responses = {
            'budget': "For budget travel, consider staying in guesthouses, using local transport, and eating at local restaurants. Daily costs can be kept under ₹2,000-3,000 depending on the destination.",
            'food': "Indian cuisine varies by region. Try local specialties like Kerala seafood, Rajasthan dal baati, or Goa pork vindaloo. Most places offer vegetarian options too!",
            'weather': "Best time to visit depends on the destination. Generally, October-February is good for most places, avoiding monsoon season.",
            'safety': "Travel safely by staying in well-lit areas, using registered transport, and keeping valuables secure. Most tourist destinations are very safe.",
            'visa': "Check visa requirements based on your nationality. Most countries offer e-visa or visa-on-arrival for Indians.",
        }

        response = "I'm here to help with your travel questions! Ask me about destinations, budgets, food, weather, or safety tips."

        for keyword, reply in responses.items():
            if keyword in message:
                response = reply
                break

        return JsonResponse({'response': response})

    return JsonResponse({'error': 'Invalid request'})


# Search View
def search(request):
    """Global search functionality"""
    query = request.GET.get('q', '')
    results = {}

    if query:
        # Search destinations
        results['destinations'] = Destination.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(tagline__icontains=query)
        )[:5]

        # Search vlogs
        results['vlogs'] = TravelVlog.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(tags__icontains=query)
        ).select_related('destination', 'author')[:5]

        # Search reviews
        results['reviews'] = Review.objects.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query)
        ).select_related('user', 'destination')[:5]

    return render(request, 'home/search_results.html', {
        'query': query,
        'results': results
    })


# AJAX Views for dynamic content
def get_destination_data(request, destination_id):
    """AJAX endpoint to get destination data"""
    try:
        destination = Destination.objects.get(id=destination_id)
        data = {
            'id': destination.id,
            'name': destination.name,
            'description': destination.description,
            'budget': destination.budget,
            'best_time': destination.best_time,
            'daily_cost': float(destination.get_total_daily_cost()),
            'image': destination.state_image,
        }
        return JsonResponse({'success': True, 'destination': data})
    except Destination.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Destination not found'})


@login_required
def like_vlog(request, vlog_id):
    """AJAX endpoint to like/unlike a vlog"""
    try:
        vlog = TravelVlog.objects.get(id=vlog_id)
        # In a real app, you'd have a many-to-many relationship for likes
        vlog.likes += 1
        vlog.save(update_fields=['likes'])
        return JsonResponse({'success': True, 'likes': vlog.likes})
    except TravelVlog.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Vlog not found'})


# Error handlers
def handler404(request, exception):
    """Custom 404 page"""
    return render(request, 'home/404.html', status=404)


def handler500(request):
    """Custom 500 page"""
    return render(request, 'home/500.html', status=500)

from .forms import TripForm

def create_trip(request):
    if request.method == 'POST':
        form = TripForm(request.POST)
        if form.is_valid():
            trip = form.save(commit=False)
            trip.user = request.user
            trip.save()
            return redirect('home:my_trips')
    else:
        form = TripForm()

    return render(request, 'home/create_trip.html', {'form': form})


@login_required
def mark_trip_completed(request, pk):
    """Mark a trip as completed (visited)"""
    if request.method == 'POST':
        trip = get_object_or_404(Trip, pk=pk, user=request.user)
        trip.status = 'completed'
        trip.save()
        messages.success(request, f'Trip "{trip.title}" marked as visited!')
        
        # Return JSON if it's an AJAX request
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': True})
            
    return redirect('home:my_trips')

