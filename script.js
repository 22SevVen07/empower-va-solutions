/* Basic interactive behaviors:
   - Mobile nav toggle
   - Testimonials rotation
   - FAQ toggle
   - Contact form submission (placeholder: replace FORM_ACTION with real endpoint)
   - Start in 7 days quick-fill
*/

document.addEventListener('DOMContentLoaded', function () {
  // year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  navToggle && navToggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    navList.style.display = expanded ? 'none' : 'flex';
  });

  // testimonials rotate
  const slides = Array.from(document.querySelectorAll('.testimonial'));
  let sIndex = 0;
  if (slides.length > 0) {
    setInterval(() => {
      slides[sIndex].classList.remove('active');
      sIndex = (sIndex + 1) % slides.length;
      slides[sIndex].classList.add('active');
    }, 5000);
  }

  // FAQ toggles
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const a = btn.nextElementSibling;
      const open = a.style.display === 'block';
      a.style.display = open ? 'none' : 'block';
    });
  });

  // Contact form submission
  const form = document.getElementById('lead-form');
  const formMsg = document.getElementById('form-msg');

  // Replace this constant with your real endpoint:
  // - For Formspree: https://formspree.io/f/{your-id}
  // - For Netlify Forms: remove JS and add data-netlify="true" to the form
  // - For HubSpot: use their forms embed script or submit to API
  const FORM_ACTION = ''; // <-- PUT YOUR FORM ENDPOINT HERE (string)

  if (form) {
    if (FORM_ACTION) form.setAttribute('action', FORM_ACTION);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      formMsg.textContent = 'Sending…';

      const data = new FormData(form);
      // If user provided FORM_ACTION, try fetch POST; otherwise fallback to mailto-like UX
      if (FORM_ACTION) {
        fetch(FORM_ACTION, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        }).then(resp => {
          if (resp.ok) {
            formMsg.textContent = 'Thanks! We’ll reply within one business day.';
            form.reset();
            // Optional redirect to Thank You page:
            // window.location.href = '/thank-you.html';
          } else {
            resp.json().then(j => {
              formMsg.textContent = j.error || 'There was an error. Please email xyz123@gmail.com';
            }).catch(() => {
              formMsg.textContent = 'Submission failed. Please email xyz123@gmail.com';
            });
          }
        }).catch(()=> {
          formMsg.textContent = 'Network error. Please email xyz123@gmail.com';
        });
      } else {
        // Fallback: open mail client (not ideal). Show instructions.
        formMsg.innerHTML = 'Form endpoint not configured. Please configure FORM_ACTION in script.js to post to Formspree, Netlify, or your CRM. Alternatively, email <a href="mailto:xyz123@gmail.com">xyz123@gmail.com</a>.';
      }
    });
  }

  // Start in 7 Days quick-fill
  const startBtn = document.getElementById('start-7-days');
  startBtn && startBtn.addEventListener('click', () => {
    // open contact section and prefill start_date to 7 days from now
    const dateInput = document.getElementById('start_date');
    const d = new Date();
    d.setDate(d.getDate() + 7);
    if (dateInput) dateInput.value = d.toISOString().slice(0,10);
    document.getElementById('name') && document.getElementById('name').focus();
    window.location.hash = '#contact';
  });

});
