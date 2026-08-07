// ============================================================
// JS Module: main.js
// Home Page - Theme management via imported module
// ============================================================

import { loadTheme, saveTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme preference
    loadTheme();

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('main-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            const isOpen = nav.classList.toggle('open');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
    }

    // ===== DOM Manipulation Example =====
    // Select and modify a hero section element
    const heroContent = document.querySelector('.hero-content .motto');
    if (heroContent) {
        // Add a subtle style enhancement via JavaScript
        heroContent.style.borderBottom = '2px solid #8B4513';
        heroContent.style.paddingBottom = '0.5rem';
        heroContent.style.display = 'inline-block';
    }
});

// Optional: Load calendar events dynamically (if you create an events.json)
async function loadSchoolUpdates() {
    try {
        const response = await fetch('events.json');
        if (!response.ok) throw new Error('Failed to load events');
        const data = await response.json();
        // Populate calendar, events, news dynamically
        console.log('School updates loaded:', data);
    } catch (error) {
        console.warn('Using static content (no events.json found)');
    }
}
// Uncomment to use:
// loadSchoolUpdates();

// Auto-display last modified date
const lastMod = document.lastModified;
const dateSpan = document.getElementById('modified-date');
if (dateSpan) {
    const dateObj = new Date(lastMod);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateSpan.textContent = dateObj.toLocaleDateString('en-US', options);
}