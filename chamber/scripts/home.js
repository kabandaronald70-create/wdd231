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

            requestAnimationFrame(() => {
                renderEvents(data.events || []);
                updateMemberCount([]);
            });
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

      // ====== Render Spotlights (from members.json) ======
    function renderSpotlights(spotlights) {
        const container = document.getElementById('spotlight-container');
        if (!container) return;

        if (!spotlights || spotlights.length === 0) {
            container.innerHTML = '<p class="error-message">No spotlights available.</p>';
            return;
        }

        const levelMap = {
            3: 'Gold',
            2: 'Silver',
            1: 'Member'
        };

        const html = spotlights.map(member => {
            const imagePath = member.image ? `images/${member.image}` : 'images/placeholder.webp';
            return `
                <article class="spotlight-card">
                    <img src="${imagePath}" alt="${member.name} logo" width="80" height="80" loading="lazy" decoding="async" />
                    <h3>${member.name}</h3>
                    <p class="tagline">${member.tagline || ''}</p>
                    <div class="spotlight-details">
                        <p><strong>📞</strong> ${member.phone}</p>
                        <p><strong>📍</strong> ${member.address}</p>
                        <p><strong>🌐</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">VISIT WEBSITE</a></p>
                    </div>
                    <span class="membership-badge membership-${member.membership}">${levelMap[member.membership]}</span>
                </article>
            `;
        }).join('');

        requestAnimationFrame(() => {
            container.innerHTML = html;
        });
    }

    // ====== Fetch and select random Gold/Silver members ======
    async function fetchSpotlights() {
        try {
            const response = await fetch('data/members.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const members = await response.json();

            const eligible = members.filter(m => m.membership === 3 || m.membership === 2);
            if (eligible.length === 0) {
                renderSpotlights([]);
                return;
            }

            const count = Math.min(eligible.length, Math.floor(Math.random() * 2) + 2);
            const shuffled = [...eligible].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, count);

            renderSpotlights(selected);
        } catch (error) {
            console.error('Failed to load spotlights:', error);
            document.getElementById('spotlight-container').innerHTML =
                '<p class="error-message">Unable to load spotlights. Please try again later.</p>';
        }
    }

    // ----- Update Member Count (from directory data) -----
    function updateMemberCount(members = []) {
        const countEl = document.getElementById('member-count');
        if (countEl) {
            countEl.textContent = Array.isArray(members) ? members.length : 0;
        }
    }

    // ----- Weather (OpenWeatherMap API - Current + 3‑Day Forecast) -----
    async function renderWeather() {
        const container = document.getElementById('weather-card');
        if (!container) return;

        container.innerHTML = '<div class="weather-loading">Loading weather data...</div>';

        try {
            const lat = 0.5573;
            const lon = 31.3929;
            const apiKey = '1acfff2269a4fc3865da1a8e67478ef2';
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const list = data.list || [];
            if (!list.length) throw new Error('No forecast data returned');

            const current = list[0];
            const temp = Math.round(current.main.temp);
            const feelsLike = Math.round(current.main.feels_like);
            const condition = current.weather[0].description;
            const conditionCapitalized = condition.charAt(0).toUpperCase() + condition.slice(1);
            const humidity = current.main.humidity;
            const windSpeed = current.wind.speed;
            const iconCode = current.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            const today = new Date(current.dt * 1000).toDateString();
            const dailyForecasts = [];
            const seenDates = new Set();

            for (const item of list) {
                const date = new Date(item.dt * 1000);
                const dateString = date.toDateString();
                if (dateString !== today && !seenDates.has(dateString)) {
                    seenDates.add(dateString);
                    dailyForecasts.push({
                        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                        temp: Math.round(item.main.temp),
                        icon: item.weather[0].icon,
                        description: item.weather[0].description
                    });
                    if (dailyForecasts.length === 3) break;
                }
            }

            const forecastHTML = dailyForecasts.length === 3 ? `
                <div class="forecast-container">
                    ${dailyForecasts.map(day => `
                        <div class="forecast-day">
                            <span class="forecast-label">${day.day}</span>
                            <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}" width="40" height="40" loading="lazy" />
                            <span class="forecast-temp">${day.temp}°C</span>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="weather-fallback">3‑day forecast unavailable.</p>';

            requestAnimationFrame(() => {
                container.innerHTML = `
                    <div class="weather-display">
                        <div class="weather-current">
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
                        <div class="weather-forecast">
                            <h3 class="forecast-heading">3‑Day Forecast</h3>
                            ${forecastHTML}
                        </div>
                    </div>
                `;
            });
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
    fetchSpotlights();
    renderWeather();
});