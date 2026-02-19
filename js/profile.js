/**
 * Safar.com - Profile Page Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Load user profile data (mock data for now)
    loadUserProfile();

    // Add event listeners for settings buttons
    document.querySelectorAll('.profile-section button').forEach(button => {
        button.addEventListener('click', handleSettingClick);
    });
});

function loadUserProfile() {
    // In a real app, this would fetch data from an API
    // For now, we'll use the static data in the HTML

    // You could add dynamic features here like:
    // - Loading trip history from localStorage
    // - Updating preferences
    // - Managing user settings
}

function handleSettingClick(event) {
    const buttonText = event.target.textContent.trim();

    switch(buttonText) {
        case 'Edit Profile':
            showEditProfileModal();
            break;
        case 'Notification Preferences':
            showNotificationSettings();
            break;
        case 'Privacy Settings':
            showPrivacySettings();
            break;
        case 'Sign Out':
            handleSignOut();
            break;
        default:
            alert('This feature is coming soon!');
    }
}

function showEditProfileModal() {
    // Simple alert for demo - in real app, show modal
    const newName = prompt('Enter your new name:', 'John Doe');
    if (newName) {
        document.querySelector('.profile-header h1').textContent = newName;
        alert('Profile updated successfully!');
    }
}

function showNotificationSettings() {
    alert('Notification settings would open here. You can manage email preferences, trip reminders, and promotional notifications.');
}

function showPrivacySettings() {
    alert('Privacy settings would open here. You can control data sharing, location permissions, and account visibility.');
}

function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        // In a real app, clear session/token
        alert('You have been signed out.');
        // Redirect to login page or home
        // window.location.href = 'index.html';
    }
}

// Trip management functions
function addTripToHistory(tripData) {
    const tripsContainer = document.getElementById('recentTrips');

    const tripCard = document.createElement('div');
    tripCard.className = 'trip-card';
    tripCard.innerHTML = `
        <h4>${tripData.destination}</h4>
        <p><strong>Duration:</strong> ${tripData.duration} days</p>
        <p><strong>Budget:</strong> ₹${tripData.budget}</p>
        <p><strong>Rating:</strong> ${'⭐'.repeat(tripData.rating || 5)}</p>
        <p style="font-style: italic; margin-top: 10px;">"${tripData.review || 'Great trip!'}"</p>
    `;

    // Insert at the beginning
    tripsContainer.insertBefore(tripCard, tripsContainer.firstChild);

    // Update stats
    updateTravelStats();
}

function updateTravelStats() {
    // In a real app, recalculate from actual data
    // For demo, just show the current values
    console.log('Stats updated');
}

// Export functions for use in other scripts
window.ProfileUtils = {
    addTripToHistory,
    updateTravelStats
};