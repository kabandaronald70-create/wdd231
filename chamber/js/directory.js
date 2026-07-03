// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // ----- Navigation Toggle -----
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');
    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isExpanded));
            primaryNav.classList.toggle('open');
        });
    }

    // ----- Footer: Year and Last Modified -----
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

    // ----- View Toggle and Member Rendering -----
    const container = document.getElementById('members-container');
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');

    function setView(view) {
        if (!container) return;
        container.className = view === 'grid' ? 'grid-view' : 'list-view';
        gridBtn?.classList.toggle('active', view === 'grid');
        listBtn?.classList.toggle('active', view === 'list');
    }

    function renderMembers(members) {
        if (!container) return;

        container.setAttribute('aria-busy', 'false');
        container.innerHTML = members.map((member) => {
            const membershipLevel = member.membership === 3 ? 'Gold' : member.membership === 2 ? 'Silver' : 'Member';
            const membershipClass = `membership-${member.membership}`;
            const imagePath = member.image ? `images/${member.image}` : 'images/green-valley.webp';

            return `
                <article class="member-card">
                    <img src="${imagePath}" alt="${member.name} logo" width="80" height="80" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='images/green-valley.webp';">
                    <div class="member-card-content">
                        <h3>${member.name}</h3>
                        <p class="tagline">${member.tagline}</p>
                        <div class="details">
                            <p><strong>Email:</strong> <a href="mailto:${member.email}">${member.email}</a></p>
                            <p><strong>Phone:</strong> <a href="tel:${member.phone}">${member.phone}</a></p>
                            <p><strong>Address:</strong> ${member.address}</p>
                            <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website.replace('https://', '')}</a></p>
                        </div>
                        <span class="membership ${membershipClass}">${membershipLevel}</span>
                    </div>
                </article>`;
        }).join('');

        setView('grid');
    }

    async function loadMembers() {
        if (!container) return;

        container.setAttribute('aria-busy', 'true');
        try {
            const membersData = document.getElementById('members-data');
            let members = [];

            if (membersData) {
                members = JSON.parse(membersData.textContent);
            } else {
                const response = await fetch('data/members.json');
                if (!response.ok) throw new Error('Could not load member data');
                members = await response.json();
            }

            renderMembers(members);
        } catch (error) {
            console.error(error);
            container.setAttribute('aria-busy', 'false');
            container.innerHTML = '<p class="error-message">Unable to load the member directory right now.</p>';
        }
    }

    gridBtn?.addEventListener('click', () => setView('grid'));
    listBtn?.addEventListener('click', () => setView('list'));
    loadMembers();
});