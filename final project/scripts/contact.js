// ============================================================
// JS Module: contact.js
// Contact Page - Form handling, Local Storage, theme toggle
// Demonstrates: DOM manipulation, event listeners, Local Storage
// ============================================================

import { loadTheme, saveTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    loadTheme();

    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('main-nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            const isOpen = nav.classList.toggle('open');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
    }

    // ===== THEME SELECT (Local Storage) =====
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        // Save theme on change
        themeSelect.addEventListener('change', function() {
            saveTheme(this.value);
        });
    }

    // ===== FORM VALIDATION (Event Listeners) =====
    const inquiryForm = document.getElementById('inquiry-form');
    const admissionForm = document.getElementById('admission-form');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(event) {
            const name = document.getElementById('full-name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');

            // Basic validation
            if (!name.value.trim()) {
                event.preventDefault();
                alert('Please enter your full name.');
                name.focus();
                return;
            }
            if (!email.value.trim() || !email.value.includes('@')) {
                event.preventDefault();
                alert('Please enter a valid email address.');
                email.focus();
                return;
            }
            if (!subject.value) {
                event.preventDefault();
                alert('Please select a subject of inquiry.');
                subject.focus();
                return;
            }
            if (!message.value.trim()) {
                event.preventDefault();
                alert('Please enter your message.');
                message.focus();
                return;
            }
            // Form will submit to form-action.html via GET
        });
    }

    if (admissionForm) {
        admissionForm.addEventListener('submit', function(event) {
            const studentName = document.getElementById('student-name');
            const parentName = document.getElementById('parent-name');
            const parentEmail = document.getElementById('parent-email');
            const parentPhone = document.getElementById('parent-phone');
            const admissionLevel = document.getElementById('admission-level');

            if (!studentName.value.trim()) {
                event.preventDefault();
                alert('Please enter the student\'s full name.');
                studentName.focus();
                return;
            }
            if (!parentName.value.trim()) {
                event.preventDefault();
                alert('Please enter the parent/guardian name.');
                parentName.focus();
                return;
            }
            if (!parentEmail.value.trim() || !parentEmail.value.includes('@')) {
                event.preventDefault();
                alert('Please enter a valid email address.');
                parentEmail.focus();
                return;
            }
            if (!parentPhone.value.trim()) {
                event.preventDefault();
                alert('Please enter a phone number.');
                parentPhone.focus();
                return;
            }
            if (!admissionLevel.value) {
                event.preventDefault();
                alert('Please select the admission level.');
                admissionLevel.focus();
                return;
            }
        });
    }

    // ===== DOM Manipulation Example =====
    // Add dynamic placeholder to date input
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // ===== ARRAY METHOD (forEach) Example =====
    // Apply consistent styling to all form labels
    const labels = document.querySelectorAll('.form-group label');
    labels.forEach(label => {
        // Ensure required fields are marked consistently
        if (label.textContent.includes('*')) {
            label.style.color = '#8B4513';
        }
    });

    // Auto-display last modified date
    const lastMod = document.lastModified;
    const dateSpan = document.getElementById('modified-date');
    if (dateSpan) {
        const dateObj = new Date(lastMod);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateSpan.textContent = dateObj.toLocaleDateString('en-US', options);
    }

    console.log('Contact page initialized successfully.');
});