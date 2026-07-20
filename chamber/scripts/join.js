// ====== JOIN.JS ======
document.addEventListener('DOMContentLoaded', () => {

    // ----- Navigation Toggle (if not already handled by common.js, but we'll keep it) -----
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');
    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = primaryNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            menuToggle.innerHTML = isOpen ? '✕' : '☰';
        });
    }

    // ----- Footer Year & Last Modified (if not using common.js) -----
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

    // ----- Set Timestamp in hidden field -----
    const timestampInput = document.getElementById('timestamp');
    if (timestampInput) {
        const now = new Date();
        const iso = now.toISOString(); // e.g., 2025-07-16T12:34:56.789Z
        timestampInput.value = iso;
    }

    // ----- Modals: open/close using <dialog> -----
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalCloses = document.querySelectorAll('.modal-close');

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.modal;
            const dialog = document.getElementById(modalId);
            if (dialog && dialog.showModal) {
                dialog.showModal();
            }
        });
    });

    modalCloses.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.modal;
            const dialog = document.getElementById(modalId);
            if (dialog && dialog.close) {
                dialog.close();
            }
        });
    });

    // Close modal when clicking backdrop (click outside)
    document.querySelectorAll('.membership-modal').forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) dialog.close();
        });
    });

    // ----- Form Validation (optional, but HTML5 handles required/pattern) -----
    // We just ensure the form submits with GET

});