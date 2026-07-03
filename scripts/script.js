/* ============================================================
   SECTION 1: RESPONSIVE NAVIGATION
   ============================================================ */
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    primaryNav.classList.toggle('open');
    menuToggle.textContent = primaryNav.classList.contains('open') ? '✕' : '☰';
  });
}

/* ============================================================
   SECTION 2: DYNAMIC FOOTER DATES
   ============================================================ */

const copyrightEl = document.getElementById('copyright');
if (copyrightEl) {
  const currentYear = new Date().getFullYear();
  copyrightEl.innerHTML = `&copy; ${currentYear} - Ronald Kabanda • Kampala, Uganda`;
}

const lastModEl = document.getElementById('lastModified');
if (lastModEl) {
  lastModEl.textContent = `Last Modification: ${document.lastModified}`;
}

/* ============================================================
   SECTION 3: COURSE DATA, FILTERING, AND RENDER
   ============================================================ */


const courses = [
  { code: 'WDD 130', name: 'Web Fundamentals', credits: 2, completed: true },
  { code: 'WDD 131', name: 'Dynamic Web Fundamentals', credits: 2, completed: true },
  { code: 'WDD 231', name: 'Web Frontend Development I', credits: 3, completed: false },
  { code: 'CSE 110', name: 'Introduction to Programming', credits: 3, completed: true },
  { code: 'CSE 111', name: 'Programming with Functions', credits: 3, completed: true },
  { code: 'CSE 210', name: 'Programming with Classes', credits: 3, completed: true },
];

// 3b. DOM references
const courseContainer = document.getElementById('courseCards');
const totalCreditsEl = document.getElementById('totalCredits');

// 3c. Render function
function renderCourses(filter = 'all') {
  let filtered = courses;
  if (filter === 'WDD') {
    filtered = courses.filter(course => course.code.startsWith('WDD'));
  } else if (filter === 'CSE') {
    filtered = courses.filter(course => course.code.startsWith('CSE'));
  }

  let html = '';
  filtered.forEach(course => {
    const completedClass = course.completed ? 'completed' : '';
    html += `
      <div class="course-card ${completedClass}">
        <h3>${course.code}</h3>
        <p>${course.name} (${course.credits} credits)</p>
      </div>
    `;
  });
  courseContainer.innerHTML = html;

  const totalCredits = filtered.reduce((sum, course) => sum + course.credits, 0);
  totalCreditsEl.textContent = `Total Credits: ${totalCredits}`;
}

// 3d. Helper to set active button
function setActiveButton(activeId) {
  document.querySelectorAll('.filter-buttons button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(activeId).classList.add('active');
}

// 3e. Event listeners
document.getElementById('filterAll').addEventListener('click', () => {
  setActiveButton('filterAll');
  renderCourses('all');
});

document.getElementById('filterWDD').addEventListener('click', () => {
  setActiveButton('filterWDD');
  renderCourses('WDD');
});

document.getElementById('filterCSE').addEventListener('click', () => {
  setActiveButton('filterCSE');
  renderCourses('CSE');
});

// 3f. Initial render
renderCourses('all');