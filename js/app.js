/**
 * Safar.com - Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Populate Datalist in Search Bar
    const distList = document.getElementById('destinationsList');
    if (distList && typeof DESTINATIONS !== 'undefined') {
        Object.values(DESTINATIONS).forEach(dest => {
            const option = document.createElement('option');
            option.value = dest.name;
            distList.appendChild(option);
        });
    }

    // 2. Populate Popular Destinations (Home Page)
    const featuredGrid = document.getElementById('popularDestinations');
    if (featuredGrid && typeof DESTINATIONS !== 'undefined') {
        const featured = Object.values(DESTINATIONS).slice(0, 3);
        
        featured.forEach(dest => {
            const card = document.createElement('div');
            card.className = 'card destination-card';
            const bgImage = dest.stateImage || `https://source.unsplash.com/600x400/?${dest.name},travel`;

            card.innerHTML = `
                <div class="card-image" style="height: 200px; overflow: hidden;">
                    <img src="${bgImage}" alt="${dest.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="card-content" style="padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h3>${dest.name}</h3>
                        <span style="background: #e3f2fd; color: var(--primary); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem;">${dest.budget}</span>
                    </div>
                    <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">${dest.tagline}</p>
                    <a href="destination.html?id=${dest.id}" class="btn btn-secondary" style="width: 100%; text-align: center;">Explore</a>
                </div>
            `;
            featuredGrid.appendChild(card);
        });
    }

    // 3. Search Page Logic
    const searchResultsGrid = document.getElementById('searchResults');
    if (searchResultsGrid && typeof DESTINATIONS !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const queryDest = params.get('destination')?.toLowerCase().trim() || '';
        const queryBudget = params.get('budget');
        const queryType = params.get('type');

        const heading = document.getElementById('searchHeading');
        if (heading) {
            heading.innerText = queryDest ? `Results for "${params.get('destination')}"` : 'All Destinations';
        }

        // Filter destinations
        const results = Object.values(DESTINATIONS).filter(dest => {
            const matchesDest = !queryDest || dest.name.toLowerCase().includes(queryDest) || dest.tagline.toLowerCase().includes(queryDest);
            const matchesBudget = !queryBudget || dest.budget === queryBudget;
            const matchesType = !queryType || dest.type.includes(queryType);
            return matchesDest && matchesBudget && matchesType;
        });

        if (results.length > 0) {
            searchResultsGrid.innerHTML = ''; // Clear loading/placeholder
            results.forEach(dest => {
                const card = document.createElement('div');
                card.className = 'card destination-card';
                const bgImage = dest.stateImage || `https://source.unsplash.com/600x400/?${dest.name},travel`;

                card.innerHTML = `
                    <div class="card-image" style="height: 200px; overflow: hidden;">
                        <img src="${bgImage}" alt="${dest.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="card-content" style="padding: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h3>${dest.name}</h3>
                            <span style="background: #e3f2fd; color: var(--primary); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem;">${dest.budget}</span>
                        </div>
                        <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">${dest.tagline}</p>
                        
                        <div style="font-size: 0.85rem; color: #555; margin-bottom: 15px;">
                            <p><strong><i class="ri-hotel-bed-line"></i> Stay:</strong> ₹${dest.expenses.stay}</p>
                            <p><strong><i class="ri-restaurant-line"></i> Food:</strong> ₹${dest.expenses.food}/day</p>
                        </div>

                        <a href="destination.html?id=${dest.id}" class="btn btn-secondary" style="width: 100%; text-align: center;">View Details</a>
                    </div>
                `;
                searchResultsGrid.appendChild(card);
            });
        } else {
            const noResults = document.getElementById('noResults');
            if (noResults) noResults.style.display = 'block';
        }
    }

    // 4. Destination Details Page Logic
    const destContainer = document.getElementById('destContainer');
    if (destContainer && typeof DESTINATIONS !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const destId = params.get('id');
        const dest = DESTINATIONS[destId];

        if (dest) {
            const bgImage = dest.stateImage || `https://source.unsplash.com/1600x900/?${dest.name},landscape`;
            
            // Build Food HTML
            let foodHtml = '';
            dest.food.forEach(item => {
                foodHtml += `
                    <div class="food-card">
                        <img src="${item.image}" alt="${item.dish}" style="width:100%; height:120px; object-fit:cover;">
                        <div style="padding:10px;">
                            <h4 style="font-size:1rem; display:flex; justify-content:space-between;">
                                ${item.dish} 
                                <span style="font-size:0.8rem; color:${item.veg ? 'green' : 'red'}; border:1px solid currentColor; padding:0 4px; border-radius:4px;">${item.veg ? 'Veg' : 'Non-Veg'}</span>
                            </h4>
                            <p style="color:#666; font-size:0.9rem;">${item.price}</p>
                        </div>
                    </div>
                `;
            });

            // Build Language HTML
            let langHtml = '';
            dest.languages.forEach(lang => {
                langHtml += `<h4>Speaking ${lang.name}</h4>`;
                lang.phrases.forEach(p => {
                    langHtml += `
                        <div class="phrase-box">
                            <div>
                                <strong style="display:block; font-size:1.1rem;">${p.translated}</strong>
                                <span style="color:#666;">${p.original}</span>
                            </div>
                            <button class="btn btn-secondary" onclick="alert('Playing audio: ${p.translated}')" style="border-radius:50%; width:40px; height:40px; padding:0; display:flex; align-items:center; justify-content:center;">
                                <i class="ri-volume-up-line"></i>
                            </button>
                        </div>
                    `;
                });
            });

            // Build Vlogs HTML
            let videosHtml = '';
            if (dest.vlogs && dest.vlogs.length > 0) {
                dest.vlogs.forEach(v => {
                    videosHtml += `
                        <div style="margin-bottom:20px;">
                            <iframe width="100%" height="200" src="https://www.youtube.com/embed/${v.embedId}" title="${v.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:10px;"></iframe>
                            <p style="margin-top:5px; font-weight:500;">${v.title}</p>
                        </div>
                    `;
                });
            } else {
                videosHtml = '<p>No vlogs available for this destination.</p>';
            }

            destContainer.innerHTML = `
                <div class="dest-hero" style="background-image: url('${bgImage}');">
                    <div class="container dest-content">
                        <h1 style="font-size:3.5rem; margin-bottom:10px;">${dest.name}</h1>
                        <div style="margin-bottom:20px;">
                            <span class="pill">${dest.budget} Budget</span>
                            ${dest.type.map(t => `<span class="pill">${t}</span>`).join('')}
                        </div>
                        <p style="font-size:1.2rem; max-width:800px;">${dest.description}</p>
                    </div>
                </div>

                <div class="container info-grid" style="margin-bottom:60px;">
                    <!-- Left Column -->
                    <div>
                        <div class="section-title" style="text-align:left; margin-bottom:20px;">
                            <h2><i class="ri-calendar-event-line" style="color:var(--primary);"></i> Best Time to Visit</h2>
                        </div>
                        <div style="background:#fff; padding:20px; border-radius:10px; box-shadow:var(--shadow); margin-bottom:40px;">
                            <p style="color:var(--success); font-weight:600; margin-bottom:10px;">✅ Best: ${dest.bestTime}</p>
                            <p style="color:var(--danger); font-weight:600;">⚠️ Avoid: ${dest.badTime}</p>
                        </div>

                        <div class="section-title" style="text-align:left; margin-bottom:20px;">
                            <h2><i class="ri-restaurant-2-line" style="color:var(--primary);"></i> Local Food</h2>
                        </div>
                        <div class="food-grid" style="margin-bottom:40px;">
                            ${foodHtml}
                        </div>

                        <div class="section-title" style="text-align:left; margin-bottom:20px;">
                            <h2><i class="ri-translate-2-line" style="color:var(--primary);"></i> Language Helper</h2>
                        </div>
                        <div>
                            ${langHtml}
                        </div>
                    </div>

                    <!-- Right Column (Sidebar) -->
                    <div>
                        <div class="expense-box" style="position:sticky; top:20px;">
                            <h3 style="margin-bottom:20px;">Estimated Daily Budget</h3>
                            <div class="expense-row">
                                <span><i class="ri-hotel-bed-line"></i> Stay</span>
                                <strong>₹${dest.expenses.stay}</strong>
                            </div>
                            <div class="expense-row">
                                <span><i class="ri-restaurant-line"></i> Food</span>
                                <strong>₹${dest.expenses.food}</strong>
                            </div>
                            <div class="expense-row">
                                <span><i class="ri-bus-line"></i> Transport</span>
                                <strong>₹${dest.expenses.transport}</strong>
                            </div>
                            <div class="expense-row">
                                <span><i class="ri-camera-lens-line"></i> Activities</span>
                                <strong>₹${dest.expenses.activities}</strong>
                            </div>
                            <div class="expense-row" style="border:none; font-size:1.2rem; color:var(--primary);">
                                <span>Total / Day</span>
                                <strong>₹${dest.expenses.stay + dest.expenses.food + dest.expenses.transport + dest.expenses.activities}</strong>
                            </div>
                            <button onclick="window.location.href='planner.html?dest=${dest.name}'" class="btn btn-primary" style="width:100%; margin-top:20px;">Plan This Trip</button>
                        </div>

                        <div style="margin-top:40px;">
                            <h3 style="margin-bottom:20px;">Travel Vlogs</h3>
                            ${videosHtml}
                        </div>
                    </div>
                </div>
            `;
        } else {
            destContainer.innerHTML = '<div class="container" style="padding:50px; text-align:center;"><h2>Destination not found</h2><a href="index.html" class="btn btn-primary">Go Home</a></div>';
        }
    }
});