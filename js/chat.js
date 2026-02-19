/**
 * Safar.com - AI Chat Functionality
 */

function sendMessage(message) {
    addMessage(message, 'user');
    // Simulate AI response
    setTimeout(() => {
        const response = getAIResponse(message);
        addMessage(response, 'bot');
    }, 1000);
}

function sendMessageFromInput(event) {
    event.preventDefault();
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message) {
        sendMessage(message);
        input.value = '';
    }
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    if (sender === 'bot') {
        messageDiv.innerHTML = `<strong>Safar AI:</strong> ${text}`;
    } else {
        messageDiv.textContent = text;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Simple keyword-based responses
    if (lowerMessage.includes('goa') && lowerMessage.includes('beach')) {
        return "Goa has amazing beaches! Anjuna, Baga, and Calangute are popular. For a more relaxed vibe, try Palolem or Agonda. Best time to visit is November-February. Budget around ₹2,000-4,000 per day including stay and food.";
    }

    if (lowerMessage.includes('kerala') && lowerMessage.includes('budget')) {
        return "A Kerala trip can cost ₹1,500-3,000 per day. Backwater houseboat stays are around ₹2,000-5,000 per person. Food is affordable (₹200-400/meal). Best to visit October-March for pleasant weather.";
    }

    if (lowerMessage.includes('rajasthan') && lowerMessage.includes('time') || lowerMessage.includes('weather')) {
        return "Best time to visit Rajasthan is October-February when temperatures are mild (15-25°C). Avoid April-June (extremely hot, up to 45°C) and July-September (monsoon). December-February can be cooler in desert areas.";
    }

    if (lowerMessage.includes('family')) {
        return "For family trips, I recommend Kerala (backwaters and houseboats), Goa (beaches and resorts), or Himachal Pradesh (hill stations). These destinations offer safe, comfortable travel with activities for all ages.";
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
        return "For budget travel in India, consider Goa, Himachal Pradesh, or Kerala. Daily costs can be kept under ₹2,000 including stay, food, and local transport. Use local buses, stay in guesthouses, and eat at local restaurants.";
    }

    if (lowerMessage.includes('food') || lowerMessage.includes('eat')) {
        return "Indian cuisine varies by region! In Kerala, try appam with fish curry. Rajasthan offers dal baati churma. Goa has amazing seafood. Always try local street food, but choose clean establishments. Most dishes are vegetarian-friendly.";
    }

    // Default responses
    const defaultResponses = [
        "That's an interesting question! Let me help you with that. What specific destination are you planning to visit?",
        "I'd be happy to help with your travel plans. Could you tell me more about what you're looking for?",
        "Great question! I can provide information about destinations, budgets, itineraries, and local tips. What would you like to know?",
        "Travel planning is exciting! I can help you find the perfect destination based on your preferences, budget, and travel style."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Initialize chat on page load
document.addEventListener('DOMContentLoaded', () => {
    // Chat is already initialized with welcome message
});