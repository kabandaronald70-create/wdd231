// ============================================================
// JS Module: theme.js
// Theme management for dark/light mode using Local Storage
// ============================================================

/**
 * Loads the saved theme preference from Local Storage
 * and applies it to the body.
 */
export function loadTheme() {
    const savedTheme = localStorage.getItem('hss-theme');
    const themeSelect = document.getElementById('theme-select');

    if (savedTheme) {
        document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        if (themeSelect) {
            themeSelect.value = savedTheme;
        }
    }

    // If theme select exists, listen for changes
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            const theme = this.value;
            saveTheme(theme);
        });
    }
}

/**
 * Saves the selected theme to Local Storage and applies it.
 * @param {string} theme - 'light' or 'dark'
 */
export function saveTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('hss-theme', theme);
}