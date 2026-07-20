// ====== DISCOVER.JS – Module for Discover Page ======
import { places } from '../data/discover.mjs';

// ----- Navigation Toggle -----
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');
    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = primaryNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            menuToggle.innerHTML = isOpen ? '✕' : '☰';
        });
    }

    // ----- Footer Year & Last Modified -----
    const yearSpan = document.getElementById('year');
    const lastModSpan = document.getElementById('last-modified');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (lastModSpan) {
        const lastMod = new Date(document.lastModified);
        lastModSpan.textContent = lastMod.toLocaleString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }

    // ----- Render Discover Cards -----
    renderCards(places);

    // ----- Visit Message using localStorage -----
    displayVisitMessage();

});

// ----- Render Cards -----
function renderCards(places) {
    const grid = document.getElementById('discover-grid');
    if (!grid) return;

    grid.innerHTML = places.map(place => `
        <article class="discover-card" style="grid-area: card${place.id};">
            <h2>${place.title}</h2>
            <figure>
                <img src="images/${place.image}" alt="${place.alt}" loading="lazy" decoding="async" />
                <figcaption class="visually-hidden">${place.title}</figcaption>
            </figure>
            <address>${place.address}</address>
            <p>${place.description}</p>
            <button class="learn-more" data-id="${place.id}">Learn More</button>
        </article>
    `).join('');

    // ----- "Learn More" button functionality -----
    document.querySelectorAll('.learn-more').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const place = places.find(p => p.id == id);
            if (place) {
                alert(`📍 ${place.title}\n\n${place.address}\n\n${place.description}`);
            }
        });
    });
}

// ----- Visit Message using localStorage -----
function displayVisitMessage() {
    const container = document.getElementById('visit-message');
    if (!container) return;

    const now = Date.now();
    const lastVisit = localStorage.getItem('discover-last-visit');

    let message = '';

    if (!lastVisit) {
        // First visit
        message = '👋 Welcome! Let us know if you have any questions.';
    } else {
        const daysDiff = Math.floor((now - parseInt(lastVisit, 10)) / (1000 * 60 * 60 * 24));

        if (daysDiff < 1) {
            message = '🔥 Back so soon! Awesome!';
        } else {
            const dayText = daysDiff === 1 ? 'day' : 'days';
            message = `📅 You last visited ${daysDiff} ${dayText} ago.`;
        }
    }

    container.innerHTML = `<p>${message}</p>`;

    // Store current visit timestamp
    localStorage.setItem('discover-last-visit', now.toString());
}