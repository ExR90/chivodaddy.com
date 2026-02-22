// ============================================
//  CHIVO DADDY — Main JS
// ============================================

// ---- Mobile nav toggle ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- Navbar scroll effect ----
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 50
    ? '0 4px 24px rgba(0,0,0,0.5)'
    : '0 2px 12px rgba(0,0,0,0.35)';
});

// ---- Contact form (via Formsubmit.co) ----
const form     = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.btn-submit');
  formNote.textContent = '';

  // Verify Turnstile captcha is completed
  const turnstileResponse = form.querySelector('[name="cf-turnstile-response"]');
  if (!turnstileResponse || !turnstileResponse.value) {
    formNote.textContent = '⚠️ Please complete the captcha verification first, partner.';
    formNote.style.color = '#C62828';
    return;
  }

  btn.textContent = 'Sending…';
  btn.disabled = true;

  fetch('https://formsubmit.co/ajax/victor.lopez84@live.com', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new FormData(form)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      formNote.textContent = '🤠 Much obliged, partner! The Chivo Daddy will be in touch soon.';
      formNote.style.color = '#2E7D32';
      form.reset();
      if (typeof turnstile !== 'undefined') turnstile.reset();
    } else {
      formNote.textContent = '⚠️ Something went wrong, partner. Try again or give us a call.';
      formNote.style.color = '#C62828';
    }
  })
  .catch(() => {
    formNote.textContent = '⚠️ Could not send — check your connection and try again.';
    formNote.style.color = '#C62828';
  })
  .finally(() => {
    btn.textContent = 'Send It, Pardner 🤠';
    btn.disabled = false;
  });
});

// ---- Scroll-reveal ----
const revealEls = document.querySelectorAll(
  '.goat-card, .why-item, .testimonial, .stat, .contact-card'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = entry.target.classList.contains('goat-card') && entry.target.classList.contains('featured')
        ? 'translateY(-8px)'
        : entry.target.dataset.transform || 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ---- Active nav link highlight on scroll ----
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navAnchorLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

// Inject active-link style dynamically
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--gold) !important; }`;
document.head.appendChild(style);
