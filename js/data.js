/**
 * Safar.com - Mock Data
 * Stores all destination details, prices, and travel info.
 */

const DESTINATIONS = {
    kerala: {
        id: "kerala",
        name: "Kerala",
        tagline: "God's Own Country",
        type: ["Family", "Honeymoon", "Nature", "Luxury"],
        budget: "Medium",
        description: "Famous for its backwaters, tea plantations, and beaches. A perfect relaxing getaway.",
        bestTime: "October - March",
        badTime: "June - August (Heavy Rain)",
        stateImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
        languages: [
            {
                name: "Malayalam",
                phrases: [
                    { original: "Hello", translated: "Namaskaram", audio: "namaskaram.mp3" },
                    { original: "How much?", translated: "Ethra roopa?", audio: "ethra.mp3" },
                    { original: "Food", translated: "Bakshanam", audio: "food.mp3" },
                    { original: "Water", translated: "Vellam", audio: "water.mp3" }
                ]
            }
        ],
        food: [
            { dish: "Appam with Stew", price: "₹60–120", veg: true, image: "https://source.unsplash.com/400x300/?appam" },
            { dish: "Karimeen Pollichathu", price: "₹300–500", veg: false, image: "https://source.unsplash.com/400x300/?fishcurry" },
            { dish: "Puttu and Kadala", price: "₹50–100", veg: true, image: "https://source.unsplash.com/400x300/?keralafood" }
        ],
        expenses: {
            stay: 1500, // Avg per night
            food: 600,  // Avg per day
            transport: 400,
            activities: 300
        },
        vlogs: [
            { title: "Kerala Backwaters Budget Trip", embedId: "RzVvThhjAKw" },
            { title: "Kerala Food Tour", embedId: "1Zg3_K6qbHI" }
        ]
    },
    rajasthan: {
        id: "rajasthan",
        name: "Rajasthan",
        tagline: "Land of Kings",
        type: ["History", "Culture", "Luxury", "Family"],
        budget: "Medium",
        description: "Experience royal palaces, vast deserts, and vibrant culture.",
        bestTime: "October - February",
        badTime: "April - June (Extreme Heat)",
        stateImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80",
        languages: [
            {
                name: "Hindi / Rajasthani",
                phrases: [
                    { original: "Hello", translated: "Khamma Ghani", audio: "khamma.mp3" },
                    { original: "How are you?", translated: "Aap kaise ho?", audio: "kaise.mp3" }
                ]
            }
        ],
        food: [
            { dish: "Dal Baati Churma", price: "₹150–300", veg: true, image: "https://source.unsplash.com/400x300/?indianfood" },
            { dish: "Laal Maas", price: "₹350–600", veg: false, image: "https://source.unsplash.com/400x300/?curry" }
        ],
        expenses: {
            stay: 1200,
            food: 500,
            transport: 300,
            activities: 500
        },
        vlogs: [
            { title: "Jaipur Budget Guide", embedId: "Yi8izF4l7lE" }
        ]
    },
    goa: {
        id: "goa",
        name: "Goa",
        tagline: "Beaches & Parties",
        type: ["Solo", "Adventure", "Party", "Honeymoon"],
        budget: "Low",
        description: "Sun, sand, and sea. The party capital of India.",
        bestTime: "November - February",
        badTime: "June - September (Monsoon)",
        stateImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80",
        languages: [
            {
                name: "Konkani",
                phrases: [
                    { original: "Hello", translated: "Deo boro dis div", audio: "hello.mp3" }
                ]
            }
        ],
        food: [
            { dish: "Fish Curry Rice", price: "₹150–250", veg: false, image: "https://source.unsplash.com/400x300/?fishcurry" },
            { dish: "Vindaloo", price: "₹250–400", veg: false, image: "https://source.unsplash.com/400x300/?pork" }
        ],
        expenses: {
            stay: 1000,
            food: 800,
            transport: 200,
            activities: 200
        },
        vlogs: [
            { title: "North Goa vs South Goa", embedId: "M1M2M3M4" }
        ]
    },
    himachal: {
        id: "himachal",
        name: "Himachal Pradesh",
        tagline: "Mountains Calling",
        type: ["Adventure", "Nature", "Solo", "Honeymoon"],
        budget: "Low",
        description: "Snow-capped mountains, trekking trails, and peaceful vibes.",
        bestTime: "March - June, September - December",
        badTime: "July - August (Landslides)",
        stateImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
        languages: [
            {
                name: "Hindi / Pahari",
                phrases: [
                    { original: "Hello", translated: "Namaste", audio: "namaste.mp3" }
                ]
            }
        ],
        food: [
            { dish: "Siddu", price: "₹50–100", veg: true, image: "https://source.unsplash.com/400x300/?bread" },
            { dish: "Maggi", price: "₹40–60", veg: true, image: "https://source.unsplash.com/400x300/?noodles" }
        ],
        expenses: {
            stay: 800,
            food: 400,
            transport: 300,
            activities: 100
        },
        vlogs: []
    }
};

const TRAVEL_TYPES = ["Solo", "Family", "Adventure", "Honeymoon", "Luxury", "History"];

// Travel Vlogs and User Content
const TRAVEL_VLOGS = [
    {
        id: "vlog_001",
        title: "Hidden Gems of Kerala Backwaters - Local Guide",
        description: "Join Rajesh, a local fisherman, as he takes us through lesser-known backwater routes and shares authentic Kerala experiences.",
        destination: "kerala",
        type: "local-insider",
        author: {
            name: "Rajesh Kumar",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            type: "local",
            location: "Alleppey, Kerala"
        },
        thumbnail: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoUrl: "https://www.youtube.com/embed/RzVvThhjAKw",
        duration: "12:34",
        views: 15420,
        likes: 892,
        uploadDate: "2026-01-15",
        tags: ["backwaters", "local-guide", "authentic", "houseboat"],
        featured: true
    },
    {
        id: "vlog_002",
        title: "Budget Travel in Rajasthan - 7 Days Under ₹5000",
        description: "Complete itinerary for budget travelers visiting Jaipur, Jodhpur, and Udaipur. Including street food, local transport, and accommodation tips.",
        destination: "rajasthan",
        type: "budget-travel",
        author: {
            name: "Priya Sharma",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            type: "traveler",
            location: "Delhi, India"
        },
        thumbnail: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoUrl: "https://www.youtube.com/embed/Yi8izF4l7lE",
        duration: "18:45",
        views: 28340,
        likes: 1245,
        uploadDate: "2026-01-20",
        tags: ["budget", "itinerary", "street-food", "palaces"],
        featured: true
    },
    {
        id: "vlog_003",
        title: "Goa's Best Beach Shacks - Local Recommendations",
        description: "Maria, a Goan local, shares her favorite beach shacks, authentic seafood recipes, and the real Goa beyond the tourist spots.",
        destination: "goa",
        type: "food-tour",
        author: {
            name: "Maria Fernandes",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            type: "local",
            location: "Calangute, Goa"
        },
        thumbnail: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoUrl: "https://www.youtube.com/embed/M1M2M3M4",
        duration: "15:22",
        views: 9876,
        likes: 567,
        uploadDate: "2026-01-25",
        tags: ["food", "beaches", "local-cuisine", "seafood"],
        featured: true
    },
    {
        id: "vlog_004",
        title: "Trekking in Himachal - Local Trails & Safety Tips",
        description: "Aman, a local trekking guide, shows us safe trekking routes in Himachal Pradesh and shares essential safety precautions for mountain adventures.",
        destination: "himachal",
        type: "adventure",
        author: {
            name: "Aman Thakur",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            type: "local",
            location: "Manali, Himachal Pradesh"
        },
        thumbnail: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoUrl: "https://www.youtube.com/embed/N1N2N3N4",
        duration: "20:15",
        views: 15670,
        likes: 934,
        uploadDate: "2026-01-28",
        tags: ["trekking", "mountains", "safety", "adventure"],
        featured: false
    },
    {
        id: "vlog_005",
        title: "Cultural Festivals of Rajasthan - Holi Special",
        description: "Experience the vibrant colors and traditions of Holi festival in Rajasthan. A cultural journey through local celebrations and traditions.",
        destination: "rajasthan",
        type: "cultural",
        author: {
            name: "Vikram Singh",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            type: "traveler",
            location: "Jaipur, Rajasthan"
        },
        thumbnail: "https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoUrl: "https://www.youtube.com/embed/O1O2O3O4",
        duration: "14:30",
        views: 22150,
        likes: 1189,
        uploadDate: "2026-01-30",
        tags: ["festival", "culture", "holi", "traditions"],
        featured: false
    },
    {
        id: "vlog_006",
        title: "Kerala Ayurveda & Wellness Retreat",
        description: "Discover authentic Ayurvedic treatments and wellness practices in Kerala. Local experts share traditional healing methods and spa experiences.",
        destination: "kerala",
        type: "local-insider",
        author: {
            name: "Dr. Lakshmi Nair",
            avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            type: "local",
            location: "Kovalam, Kerala"
        },
        thumbnail: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoUrl: "https://www.youtube.com/embed/P1P2P3P4",
        duration: "16:45",
        views: 12340,
        likes: 756,
        uploadDate: "2026-02-01",
        tags: ["ayurveda", "wellness", "spa", "traditional-medicine"],
        featured: false
    },
    {
        id: "vlog_007",
        title: "Goa Nightlife - Local vs Tourist Perspective",
        description: "A balanced view of Goa's nightlife scene from both local and tourist perspectives. Safe partying tips and authentic experiences.",
        destination: "goa",
        type: "local-insider",
        author: {
            name: "Carlos Rodrigues",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            type: "local",
            location: "Panaji, Goa"
        },
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoUrl: "https://www.youtube.com/embed/Q1Q2Q3Q4",
        duration: "13:20",
        views: 18750,
        likes: 892,
        uploadDate: "2026-02-02",
        tags: ["nightlife", "party", "safety", "local-culture"],
        featured: false
    },
    {
        id: "vlog_008",
        title: "Himachal Pradesh Homestays - Living with Locals",
        description: "Experience authentic Himachali culture by staying in local homestays. Learn about local customs, cuisine, and mountain life.",
        destination: "himachal",
        type: "cultural",
        author: {
            name: "Sneha Patel",
            avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            type: "traveler",
            location: "Mumbai, India"
        },
        thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoUrl: "https://www.youtube.com/embed/R1R2R3R4",
        duration: "17:10",
        views: 9450,
        likes: 623,
        uploadDate: "2026-02-03",
        tags: ["homestay", "culture", "local-life", "mountains"],
        featured: false
    }
];