document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const display = document.getElementById('form-data-display');

    if (!display) return;

    if (params.size === 0) {
        display.innerHTML = '<p>No data submitted.</p>';
        return;
    }

    let html = '<h3>Submitted Information</h3>';
    const labels = {
        'full-name': 'Full Name',
        'email': 'Email Address',
        'phone': 'Phone Number',
        'subject': 'Subject of Inquiry',
        'message': 'Message',
        'student-name': 'Student Name',
        'parent-name': 'Parent/Guardian Name',
        'parent-email': 'Parent/Guardian Email',
        'parent-phone': 'Parent/Guardian Phone',
        'preferred-date': 'Preferred Visit Date',
        'admission-level': 'Admission Level'
    };

    params.forEach((value, key) => {
        const label = labels[key] || key.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
        if (value.trim() !== '') {
            html += `<p><strong>${label}:</strong> ${value}</p>`;
        }
    });

    display.innerHTML = html;
});
