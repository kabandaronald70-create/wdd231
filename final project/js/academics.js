// ============================================================
// JS Module: academics.js
// Academics Page - Fetches JSON data, displays subjects, modal
// Demonstrates: Fetch API, try...catch, array methods,
//               template literals, DOM manipulation, modal dialog
// ============================================================

import { loadTheme } from './theme.js';

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

    // ===== FETCH DATA with TRY...CATCH =====
    async function fetchSubjects() {
        const container = document.getElementById('subject-grid');
        const countDisplay = document.getElementById('subject-count');

        try {
            // Fetch local JSON file
            const response = await fetch('subjects.json');

            // Check if response is OK
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const subjects = await response.json();

            // Validate data
            if (!Array.isArray(subjects) || subjects.length === 0) {
                throw new Error('No subject data found.');
            }

            // Display subject count
            if (countDisplay) {
                countDisplay.textContent = `Total Subjects: ${subjects.length}`;
            }

            // ===== ARRAY METHOD (map) + TEMPLATE LITERALS =====
            const subjectCards = subjects.map(subject => `
                <div class="subject-card" data-id="${subject.id}" data-name="${subject.name}" data-category="${subject.category}" data-level="${subject.level}" data-description="${subject.description}">
                    <h3>${subject.name}</h3>
                    <p><span class="category">${subject.category}</span> <span class="level">${subject.level}</span></p>
                    <p>${subject.description.substring(0, 80)}${subject.description.length > 80 ? '...' : ''}</p>
                    <p style="font-size:0.8rem;color:#8B4513;margin-top:0.5rem;"><em>Click for details</em></p>
                </div>
            `).join('');

            // ===== DOM MANIPULATION =====
            container.innerHTML = subjectCards;

            // ===== EVENT LISTENER (click) for Modal =====
            const cards = container.querySelectorAll('.subject-card');
            cards.forEach(card => {
                card.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const name = this.dataset.name;
                    const category = this.dataset.category;
                    const level = this.dataset.level;
                    const description = this.dataset.description;
                    openModal(id, name, category, level, description);
                });
            });

        } catch (error) {
            // ===== TRY...CATCH error handling =====
            console.error('Error fetching subjects:', error);
            container.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:2rem;background:#ffe6e6;border-radius:8px;border:1px solid #cc0000;">
                    <h3>⚠️ Error Loading Subjects</h3>
                    <p>Unable to load subject data. Please try again later.</p>
                    <p style="font-size:0.8rem;color:#666;">${error.message}</p>
                </div>
            `;
            if (countDisplay) {
                countDisplay.textContent = '⚠️ Error loading subjects';
            }
        }
    }

    // ===== MODAL DIALOG =====
    const modal = document.getElementById('subject-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    function openModal(id, name, category, level, description) {
        if (!modal) return;

        // ===== TEMPLATE LITERAL =====
        modalTitle.textContent = name;
        modalBody.innerHTML = `
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Level:</strong> ${level}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Subject ID:</strong> ${id}</p>
        `;

        modal.showModal();
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.close();
            document.body.style.overflow = '';
        });
    }

    // Close modal on backdrop click
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                modal.close();
                document.body.style.overflow = '';
            }
        });
    }

    // Close modal with Escape key (browser handles this)

    // ===== INITIALIZE =====
    fetchSubjects();

    // ===== DOM Manipulation Example =====
    // Add a class to the page header after load
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
        pageHeader.style.opacity = '1';
        pageHeader.style.transition = 'opacity 0.5s';
    }
});

// ============================================================
// DEPARTMENT MODAL FUNCTIONALITY
// ============================================================

// Department Modal elements
const deptModal = document.getElementById('dept-modal');
const deptModalTitle = document.getElementById('dept-modal-title');
const deptModalBody = document.getElementById('dept-modal-body');
const deptModalClose = document.getElementById('dept-modal-close');

// Array to store department data (loaded from JSON)
let departmentsData = [];

/**
 * Fetches department data from departments.json
 */
async function fetchDepartments() {
    try {
        const response = await fetch('departments.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        departmentsData = await response.json();
        console.log('Departments loaded:', departmentsData);
        return departmentsData;

    } catch (error) {
        console.error('Error fetching departments:', error);
        // Use fallback data if JSON fails to load
        departmentsData = getFallbackDepartments();
        return departmentsData;
    }
}

/**
 * Fallback department data (hardcoded) - used if JSON fails to load
 */
function getFallbackDepartments() {
    return [
        { id: 1, name: "Science", icon: "🔬", headName: "Mr. Gerald Babi", headTitle: "Head of Science Department", phone: "+256 782 345 678", email: "science@hsskiganda.sc.ug", description: "The Science Department offers Biology, Chemistry, and Physics at both O-Level and A-Level.", staffCount: 12 },
        { id: 2, name: "Humanities", icon: "📖", headName: "Ms. Sarah Nantongo", headTitle: "Head of Humanities Department", phone: "+256 702 456 789", email: "humanities@hsskiganda.sc.ug", description: "The Humanities Department covers History, Geography, and Christian Religious Education.", staffCount: 8 },
        { id: 3, name: "Creative Arts", icon: "🎨", headName: "Mr. Denis Kabiito", headTitle: "Head of Creative Arts Department", phone: "+256 772 567 890", email: "arts@hsskiganda.sc.ug", description: "The Creative Arts Department offers Art and Design, Music, and Physical Education.", staffCount: 5 },
        { id: 4, name: "Languages", icon: "🌍", headName: "Ms. Irene Nambuusi", headTitle: "Head of Languages Department", phone: "+256 752 678 901", email: "languages@hsskiganda.sc.ug", description: "The Languages Department offers English, Literature, French, and Luganda.", staffCount: 9 },
        { id: 5, name: "Business Studies", icon: "📊", headName: "Mr. Peter Walugembe", headTitle: "Head of Business Studies Department", phone: "+256 782 789 012", email: "business@hsskiganda.sc.ug", description: "The Business Studies Department offers Commerce, Economics, and Entrepreneurship.", staffCount: 6 },
        { id: 6, name: "ICT", icon: "💻", headName: "Ms. Hezekiah Muwanguzi", headTitle: "Head of ICT Department", phone: "+256 792 890 123", email: "ict@hsskiganda.sc.ug", description: "The ICT Department offers Computer Studies and practical digital skills.", staffCount: 4 },
        { id: 7, name: "Mathematics", icon: "📐", headName: "Mr. Samuel Muwonge", headTitle: "Head of Mathematics Department", phone: "+256 702 901 234", email: "maths@hsskiganda.sc.ug", description: "The Mathematics Department develops logical reasoning and analytical skills.", staffCount: 7 }
    ];
}

/**
 * Opens the department modal with the selected department's data
 */
function openDepartmentModal(deptId) {
    // Find the department by ID
    const dept = departmentsData.find(d => d.id === Number(deptId));

    if (!dept) {
        console.error('Department not found:', deptId);
        return;
    }

    // Populate modal using template literal
    deptModalTitle.textContent = `${dept.icon} ${dept.name} Department`;
    deptModalBody.innerHTML = `
        <div class="dept-detail-card">
            <div class="dept-head-info">
                <div class="dept-avatar">
                    <span class="dept-initials">${dept.headName.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div class="dept-head-details">
                    <h3>${dept.headName}</h3>
                    <p class="dept-head-title">${dept.headTitle}</p>
                </div>
            </div>
            <div class="dept-contact">
                <p><strong>📞 Phone:</strong> ${dept.phone}</p>
                <p><strong>📧 Email:</strong> <a href="mailto:${dept.email}">${dept.email}</a></p>
            </div>
            <div class="dept-description">
                <p><strong>About the Department:</strong></p>
                <p>${dept.description}</p>
                <p><strong>Staff Count:</strong> ${dept.staffCount} teachers</p>
            </div>
        </div>
    `;

    // Show modal
    deptModal.showModal();
    document.body.style.overflow = 'hidden';
}

/**
 * Sets up department click listeners
 */
function setupDepartmentListeners() {
    const departmentItems = document.querySelectorAll('#department-list li');

    // Use forEach array method to attach event listeners
    departmentItems.forEach(item => {
        item.addEventListener('click', function() {
            const deptId = this.dataset.dept;
            openDepartmentModal(deptId);
        });
    });
}

/**
 * Initialize department functionality
 */
async function initDepartments() {
    // Load department data
    await fetchDepartments();
    // Set up click listeners
    setupDepartmentListeners();
}

// ===== DEPARTMENT MODAL CLOSE EVENTS =====

if (deptModalClose) {
    deptModalClose.addEventListener('click', function() {
        deptModal.close();
        document.body.style.overflow = '';
    });
}

if (deptModal) {
    deptModal.addEventListener('click', function(event) {
        if (event.target === this) {
            deptModal.close();
            document.body.style.overflow = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
   
    initDepartments();
});