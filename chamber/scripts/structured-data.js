(function () {
    const scriptTag = document.currentScript || document.querySelector('script[data-schema-page]');
    const page = scriptTag?.dataset.schemaPage || 'home';

    const schemaData = {
        home: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Mubende Chamber of Commerce',
            url: 'https://kabandaronald70-create.github.io/wdd231/chamber/index.html',
            logo: 'https://kabandaronald70-create.github.io/wdd231/chamber/images/mubende-logo.png',
            sameAs: [
                'https://facebook.com/kabandaronaldofficial',
                'https://twitter.com/KABANDARONALD13',
                'https://instagram.com/kabanda.ronald.10'
            ],
            contactPoint: [{
                '@type': 'ContactPoint',
                contactType: 'customer support',
                telephone: '+256743769483',
                email: 'info@mubendechamber.org',
                areaServed: 'UG'
            }]
        },
        directory: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Mubende Chamber of Commerce',
            url: 'https://kabandaronald70-create.github.io/wdd231/chamber/directory.html',
            logo: 'https://kabandaronald70-create.github.io/wdd231/chamber/images/mubende-logo.png',
            sameAs: [
                'https://facebook.com/kabandaronaldofficial',
                'https://twitter.com/KABANDARONALD13',
                'https://instagram.com/kabanda.ronald.10'
            ],
            contactPoint: [{
                '@type': 'ContactPoint',
                contactType: 'customer support',
                telephone: '+256743769483',
                email: 'info@mubendechamber.org',
                areaServed: 'UG'
            }]
        }
    };

    if (!schemaData[page]) return;

    const jsonScript = document.createElement('script');
    jsonScript.type = 'application/ld+json';
    jsonScript.textContent = JSON.stringify(schemaData[page]);
    document.head.appendChild(jsonScript);
})();
