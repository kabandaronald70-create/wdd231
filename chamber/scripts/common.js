// ====== COMMON.JS (for discover.html and join.html) ======
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
});
