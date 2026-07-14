// ====== DIRECTORY.JS ======
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

    // ----- View Toggle -----
    const container = document.getElementById('members-container');
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');

    function setView(view) {
        if (!container) return;
        container.className = view === 'grid' ? 'grid-view' : 'list-view';
        if (gridBtn) gridBtn.classList.toggle('active', view === 'grid');
        if (listBtn) listBtn.classList.toggle('active', view === 'list');
    }

    // ----- Render Members -----
function renderMembers(members) {
    if (!container) return;

    container.innerHTML = members.map((member) => {
        const level = member.membership === 3 ? 'Gold' :
                      member.membership === 2 ? 'Silver' : 'Member';
        const levelClass = `membership-${member.membership}`;
        const imagePath = member.image ? `images/${member.image}` : 'images/placeholder.webp';

        return `
            <article class="member-card">
                <img src="${imagePath}" alt="${member.name} logo" width="80" height="80" loading="lazy" decoding="async" data-fallback="images/placeholder.webp">
                <div class="member-card-content">
                    <h2>${member.name}</h2>
                    <p class="tagline">${member.tagline || ''}</p>
                    <div class="details">
                        <p><strong>Email:</strong> <a href="mailto:${member.email}">${member.email}</a></p>
                        <p><strong>Phone:</strong> <a href="tel:${member.phone}">${member.phone}</a></p>
                        <p><strong>Address:</strong> ${member.address}</p>
                        <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website.replace(/^https?:\/\//, '')}</a></p>
                    </div>
                    <span class="membership ${levelClass}">${level}</span>
                </div>
            </article>
        `;
    }).join('');

    // ----- Handle image loading errors (no inline JS!) -----
    document.querySelectorAll('.member-card img').forEach((img) => {
        img.addEventListener('error', function() {
            const fallback = this.dataset.fallback || 'images/placeholder.webp';
            if (this.src !== fallback) {
                this.src = fallback;
            }
        });
    });

    // Default to grid view
    setView('grid');
}
    // ----- Load Members via fetch() + async/await -----
    async function loadMembers() {
        if (!container) return;

        container.innerHTML = '<p style="text-align:center; padding:2rem;">Loading members…</p>';

        try {
            const response = await fetch('data/members.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            const members = await response.json();

            // Validate we have at least 7 members
            if (!Array.isArray(members) || members.length < 7) {
                throw new Error(`Expected at least 7 members, got ${members.length}`);
            }

            renderMembers(members);
        } catch (error) {
            console.error('Failed to load members:', error);
            container.innerHTML = `
                <p class="error-message">⚠️ Unable to load the member directory. Please try again later.</p>
            `;
        }
    }

    // ----- Event Listeners for Toggle -----
    if (gridBtn) gridBtn.addEventListener('click', () => setView('grid'));
    if (listBtn) listBtn.addEventListener('click', () => setView('list'));

    // ----- Start -----
    loadMembers();
});