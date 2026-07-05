import "dashboard";

// Intercept ticket form submission for AJAX handling (prevents "Confirm Form Resubmission")
document.addEventListener('submit', async function(e) {
    const form = e.target;
    if (form && form.name === 'ticket') {
        e.preventDefault();

        const formData = new FormData(form);
        try {
            const response = await fetch(form.action || window.location.href, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.redirected) {
                // Successful submission redirects page, avoiding resubmission prompts on refresh
                window.location.href = response.url;
                return;
            }

            // If invalid, update form HTML with validation errors dynamically
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const newForm = doc.querySelector('form[name="ticket"]');
            if (newForm) {
                form.innerHTML = newForm.innerHTML;
            }
        } catch (err) {
            console.error('Error submitting form via AJAX:', err);
        }
    }
});
