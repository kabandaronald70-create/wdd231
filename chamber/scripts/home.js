// ====== HOME.JS ======
document.addEventListener('DOMContentLoaded', () => {
    // ----- Navigation Toggle -----
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = primaryNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            menuToggle.innerHTML = isOpen ? '✕' : '☰';
        });
    }

    // ----- Footer: Year & Last Modified -----
    const yearSpan = document.getElementById('year');
    const lastModSpan = document.getElementById('last-modified');

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (lastModSpan) {
        const lastMod = new Date(document.lastModified);
        lastModSpan.textContent = lastMod.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // ----- Load Home Data -----
    async function loadHomeData() {
        try {
            const response = await fetch('data/home.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            renderEvents(data.events);
            renderSpotlights(data.spotlights);
            updateMemberCount();
        } catch (error) {
            console.error('Failed to load home data:', error);
            document.getElementById('events-container').innerHTML =
                '<p class="error-message">Unable to load events. Please try again later.</p>';
            document.getElementById('spotlight-container').innerHTML =
                '<p class="error-message">Unable to load spotlights. Please try again later.</p>';
        }
    }

    // ----- Render Events -----
    function renderEvents(events) {
        const container = document.getElementById('events-container');
        if (!container) return;

        container.innerHTML = events.map(event => `
            <article class="event-card">
                <h3>${event.title}</h3>
                <p class="event-date">📅 ${event.date}</p>
                <p class="event-description">${event.description}</p>
            </article>
        `).join('');
    }

    // ----- Render Spotlights -----
    function renderSpotlights(spotlights) {
        const container = document.getElementById('spotlight-container');
        if (!container) return;

        const levelMap = {
            3: 'Gold',
            2: 'Silver',
            1: 'Member'
        };

        container.innerHTML = spotlights.map(spotlight => `
            <article class="spotlight-card">
                <h3>${spotlight.name}</h3>
                <p class="tagline">${spotlight.tagline}</p>
                <span class="membership-badge membership-${spotlight.membership}">${levelMap[spotlight.membership]}</span>
            </article>
        `).join('');
    }

    // ----- Update Member Count (from directory data) -----
    async function updateMemberCount() {
        try {
            const response = await fetch('data/members.json');
            if (!response.ok) return;
            const members = await response.json();
            const countEl = document.getElementById('member-count');
            if (countEl && Array.isArray(members)) {
                countEl.textContent = members.length;
            }
        } catch {
            // Silently fail - count stays at 0
        }
    }

       // ----- Weather (OpenWeatherMap API) -----
    async function renderWeather() {
        const container = document.getElementById('weather-card');
        if (!container) return;

        // Show loading state
        container.innerHTML = '<div class="weather-loading">Loading weather data...</div>';

        try {
            // Mubende, Uganda coordinates
            const lat = 0.5573;
            const lon = 31.3929;
            const apiKey = '1acfff2269a4fc3865da1a8e67478ef2';
            
            // API URL with metric units (Celsius)
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Extract weather data from response
            const temp = Math.round(data.main.temp);
            const feelsLike = Math.round(data.main.feels_like);
            const condition = data.weather[0].description;
            const conditionCapitalized = condition.charAt(0).toUpperCase() + condition.slice(1);
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            // Render the weather display
            container.innerHTML = `
                <div class="weather-display">
                    <div class="weather-icon">
                        <img src="${iconUrl}" alt="${conditionCapitalized}" width="60" height="60" loading="lazy" />
                    </div>
                    <div class="weather-temp">
                        <div class="temp">${temp}°C</div>
                        <div class="condition">${conditionCapitalized}</div>
                        <div class="feels-like">Feels like ${feelsLike}°C</div>
                    </div>
                    <div class="weather-details">
                        <p>💧 Humidity: ${humidity}%</p>
                        <p>🌬️ Wind: ${windSpeed} km/h</p>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Weather API error:', error);
            container.innerHTML = `
                <div class="weather-error">
                    <p>⚠️ Unable to load weather data.</p>
                    <p class="weather-fallback">Please check your API key or try again later.</p>
                </div>
            `;
        }
    }
    // ----- Start -----
    loadHomeData();
    renderWeather();
});