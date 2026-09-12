/* ============================================================
   SHOW GIFTS — JavaScript
   ============================================================ */

/* ── Header scroll state ──────────────────────────────────── */
const header = document.getElementById('header');
const stt    = document.getElementById('stt');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 30);
  stt?.classList.toggle('show', y > 400);
});

stt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ── Mobile menu ──────────────────────────────────────────── */
const burger     = document.getElementById('burger');
const mobMenu    = document.getElementById('mobMenu');
const mobOverlay = document.getElementById('mobOverlay');
const mobClose   = document.getElementById('mobClose');

function openMenu() {
  mobMenu?.classList.add('open');
  mobOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobMenu?.classList.remove('open');
  mobOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

burger?.addEventListener('click', openMenu);
mobClose?.addEventListener('click', closeMenu);
mobOverlay?.addEventListener('click', closeMenu);

document.querySelectorAll('.mob-nav a').forEach(a => {
  a.addEventListener('click', closeMenu);
});


/* ── Active nav link on scroll ────────────────────────────── */
const sections  = document.querySelectorAll('section[id], div[id]');
const navLinks  = document.querySelectorAll('.hd-nav a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));


/* ── Scroll reveal ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.rv').forEach(el => revealObserver.observe(el));


/* ── Counters ─────────────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


/* ── FAQ accordion ────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item     = btn.closest('.faq-item');
    const isOpen   = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
    });
    // open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});


/* ── Contact form ─────────────────────────────────────────── */
const cform  = document.getElementById('cform');
const formOk = document.getElementById('formOk');
const fSubmit = document.getElementById('fSubmit');

const WHATSAPP_NUMBER = '918867193377'; // Show Gifts business WhatsApp

cform?.addEventListener('submit', e => {
  e.preventDefault();

  const name  = document.getElementById('f-name')?.value.trim();
  const email = document.getElementById('f-email')?.value.trim();

  if (!name || !email) {
    const missing = !name
      ? document.getElementById('f-name')
      : document.getElementById('f-email');
    missing?.focus();
    missing?.style.setProperty('border-color', '#e74c3c');
    setTimeout(() => missing?.style.removeProperty('border-color'), 2000);
    return;
  }

  const company = document.getElementById('f-company')?.value.trim() || '';
  const phone   = document.getElementById('f-phone')?.value.trim() || '';
  const service = document.getElementById('f-service')?.value || '';
  const message = document.getElementById('f-msg')?.value.trim() || '';

  // Build a readable WhatsApp message from the form fields.
  const lines = ['New enquiry from the Show Gifts website:', '', `*Name:* ${name}`];
  if (company) lines.push(`*Company:* ${company}`);
  lines.push(`*Email:* ${email}`);
  if (phone)   lines.push(`*Phone:* ${phone}`);
  if (service) lines.push(`*Requirement:* ${service}`);
  if (message) lines.push(`*Message:* ${message}`);

  const waText = encodeURIComponent(lines.join('\n'));
  const waUrl  = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  // window.open must run synchronously inside the click handler (no
  // await before it) or browsers block it as an unrequested popup.
  const waWindow = window.open(waUrl, '_blank', 'noopener');

  // Point the "didn't open?" fallback link at the same pre-filled message,
  // in case the popup was blocked.
  const waFallback = document.getElementById('waFallback');
  if (waFallback) waFallback.href = waUrl;

  if (fSubmit) {
    fSubmit.disabled = true;
    fSubmit.innerHTML = '<i class="fab fa-whatsapp"></i>&nbsp; Opening WhatsApp…';
  }

  // Best-effort background copy to Google Sheets too, if configured —
  // see google-apps-script.js for setup steps. WhatsApp above is the
  // primary, guaranteed-working delivery path; this is a bonus record.
  const scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
  if (!scriptUrl.includes('YOUR_SCRIPT_ID')) {
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company, email, phone, service, message }),
    }).catch(() => {});
  }

  cform.style.display = 'none';
  if (formOk) formOk.style.display = 'block';

  if (!waWindow || waWindow.closed) {
    console.warn('[ShowGifts] WhatsApp popup may have been blocked — the fallback link in the success message still works.');
  }
});

// Clear field error on input
document.querySelectorAll('#cform input, #cform textarea, #cform select').forEach(el => {
  el.addEventListener('input', () => el.style.removeProperty('border-color'));
});


/* ── Smooth scroll for all anchor links ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // header height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
