document.addEventListener('DOMContentLoaded', function () {
    const dateSpan = document.getElementById('modified-date');
    if (!dateSpan) return;

    const lastMod = document.lastModified;
    const dateObj = new Date(lastMod);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateSpan.textContent = dateObj.toLocaleDateString('en-US', options);
});
