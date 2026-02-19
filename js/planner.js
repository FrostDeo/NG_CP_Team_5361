/**
 * Safar.com - Trip Planner Functionality
 */

document.getElementById('tripForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const destination = document.getElementById('destination').value;
    const duration = parseInt(document.getElementById('duration').value);
    const travelType = document.getElementById('travelType').value;
    const budget = document.getElementById('budget').value;
    const interests = document.getElementById('interests').value;

    generateItinerary(destination, duration, travelType, budget, interests);
});

function generateItinerary(destination, duration, travelType, budget, interests) {
    const itineraryDisplay = document.getElementById('itineraryDisplay');
    const itineraryContent = document.getElementById('itineraryContent');

    // Get destination data
    const destKey = destination.toLowerCase().replace(/\s+/g, '');
    const destData = DESTINATIONS[destKey];

    let itineraryHtml = '';

    // Generate day-by-day itinerary
    for (let day = 1; day <= duration; day++) {
        itineraryHtml += generateDayPlan(day, destination, travelType, budget, interests, destData);
    }

    // Add budget summary
    itineraryHtml += generateBudgetSummary(duration, budget, destData);

    itineraryContent.innerHTML = itineraryHtml;
    itineraryDisplay.style.display = 'block';

    // Smooth scroll to results
    itineraryDisplay.scrollIntoView({ behavior: 'smooth' });
}

function generateDayPlan(day, destination, travelType, budget, interests, destData) {
    const activities = getActivitiesForDay(day, destination, travelType, interests);

    let html = `
        <div class="day-plan">
            <h3><i class="ri-calendar-line"></i> Day ${day}</h3>
    `;

    activities.forEach(activity => {
        html += `
            <div class="activity">
                <i class="${activity.icon}"></i>
                <div>
                    <strong>${activity.title}</strong>
                    <p style="margin: 5px 0; color: #666;">${activity.description}</p>
                    <small style="color: var(--primary);">Estimated cost: ₹${activity.cost}</small>
                </div>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

function getActivitiesForDay(day, destination, travelType, interests) {
    const activities = [];

    // Sample activities based on destination and day
    const baseActivities = {
        kerala: [
            { title: "Backwater Cruise", description: "Relaxing boat ride through serene backwaters", icon: "ri-ship-line", cost: "800" },
            { title: "Tea Plantation Visit", description: "Explore Munnar tea estates", icon: "ri-leaf-line", cost: "300" },
            { title: "Local Food Tour", description: "Try authentic Kerala cuisine", icon: "ri-restaurant-line", cost: "400" },
            { title: "Cultural Performance", description: "Watch traditional Kathakali dance", icon: "ri-dance-line", cost: "200" }
        ],
        goa: [
            { title: "Beach Time", description: "Relax at beautiful beaches", icon: "ri-sun-line", cost: "100" },
            { title: "Water Sports", description: "Try parasailing or jet skiing", icon: "ri-sailboat-line", cost: "1000" },
            { title: "Seafood Dinner", description: "Fresh seafood at beach shack", icon: "ri-restaurant-line", cost: "600" },
            { title: "Night Market", description: "Explore local markets and shops", icon: "ri-shopping-bag-line", cost: "200" }
        ],
        rajasthan: [
            { title: "Palace Visit", description: "Explore royal palaces and forts", icon: "ri-building-line", cost: "500" },
            { title: "Desert Safari", description: "Camel ride in the Thar desert", icon: "ri-sun-line", cost: "700" },
            { title: "Cultural Dance", description: "Watch folk dance performances", icon: "ri-dance-line", cost: "300" },
            { title: "Local Bazaar", description: "Shop for handicrafts and textiles", icon: "ri-shopping-bag-line", cost: "400" }
        ]
    };

    const destKey = destination.toLowerCase().replace(/\s+/g, '');
    const destActivities = baseActivities[destKey] || baseActivities.kerala;

    // Return 2-3 activities per day
    const startIndex = (day - 1) % destActivities.length;
    return destActivities.slice(startIndex, startIndex + 3);
}

function generateBudgetSummary(duration, budget, destData) {
    const dailyBudget = parseInt(budget);
    const totalBudget = dailyBudget * duration;

    let html = `
        <div class="day-plan" style="background: linear-gradient(135deg, var(--primary), #FF5722); color: white;">
            <h3><i class="ri-money-rupee-circle-line"></i> Budget Summary</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                <div>
                    <h4>Per Day: ₹${dailyBudget.toLocaleString()}</h4>
                    <p>Stay: ₹${Math.round(dailyBudget * 0.4).toLocaleString()}</p>
                    <p>Food: ₹${Math.round(dailyBudget * 0.3).toLocaleString()}</p>
                    <p>Activities: ₹${Math.round(dailyBudget * 0.2).toLocaleString()}</p>
                    <p>Transport: ₹${Math.round(dailyBudget * 0.1).toLocaleString()}</p>
                </div>
                <div>
                    <h4>Total for ${duration} days: ₹${totalBudget.toLocaleString()}</h4>
                    <p style="margin-top: 10px; font-size: 0.9em;">
                        This is an estimate. Actual costs may vary based on your choices and season.
                    </p>
                </div>
            </div>
        </div>
    `;

    return html;
}

// Pre-fill destination from URL parameters
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const destParam = params.get('dest');
    if (destParam) {
        document.getElementById('destination').value = destParam;
    }
});