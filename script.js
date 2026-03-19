/* ============================================================
   SHOW GIFTS — Premium JavaScript (Navy/Gold Edition)
   ============================================================ */

/* ── Header scroll state ─────────────────────────────────── */
const header = document.getElementById('header');
const stt    = document.getElementById('stt');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 50);
  stt?.classList.toggle('show', y > 500);
  updateActiveNav();
}, { passive: true });

stt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Active nav link ──────────────────────────────────────── */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.na');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  links.forEach(l => {
    const href = l.getAttribute('href')?.replace('#', '');
    l.classList.toggle('active', href === current);
  });
}

/* ── Mobile Menu ──────────────────────────────────────────── */
const burger     = document.getElementById('burger');
const mobMenu    = document.getElementById('mobMenu');
const mobClose   = document.getElementById('mobClose');
const mobOverlay = document.getElementById('mobOverlay');

function openMenu() {
  burger?.classList.add('open');
  mobMenu?.classList.add('open');
  mobOverlay?.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  burger?.classList.remove('open');
  mobMenu?.classList.remove('open');
  mobOverlay?.classList.remove('show');
  document.body.style.overflow = '';
}

burger?.addEventListener('click', () =>
  mobMenu?.classList.contains('open') ? closeMenu() : openMenu()
);
mobClose?.addEventListener('click', closeMenu);
mobOverlay?.addEventListener('click', closeMenu);
document.querySelectorAll('.mna').forEach(a => a.addEventListener('click', closeMenu));

/* ── Scroll Reveal ────────────────────────────────────────── */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.rv').forEach(el => revObs.observe(el));

/* ── Animated Counters ────────────────────────────────────── */
function animateCount(el) {
  const target = parseInt(el.dataset.target);
  if (isNaN(target)) return;
  const dur   = 1800;
  const start = performance.now();
  const tick  = (now) => {
    const p     = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(target * eased).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(tick);
}

const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => countObs.observe(el));

/* ── Smooth anchor scroll ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const hh = header ? header.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - hh;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Promo Popup ──────────────────────────────────────────── */
const popupOverlay = document.getElementById('popupOverlay');
const popupClose   = document.getElementById('popupClose');
const popupCta     = document.getElementById('popupCta');

function closePopup() {
  popupOverlay?.classList.remove('show');
  document.body.style.overflow = '';
  localStorage.setItem('promoPopupDismissed', Date.now().toString());
}

popupClose?.addEventListener('click', closePopup);
popupOverlay?.addEventListener('click', (e) => {
  if (e.target === popupOverlay) closePopup();
});
popupCta?.addEventListener('click', closePopup);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});

// Show popup after 3 seconds — but only once per 24 hours
const lastDismissed = localStorage.getItem('promoPopupDismissed');
const oneDayMs = 24 * 60 * 60 * 1000;
if (!lastDismissed || (Date.now() - parseInt(lastDismissed)) > oneDayMs) {
  setTimeout(() => {
    popupOverlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }, 3000);
}

/* ── Contact Form ─────────────────────────────────────────── */
const cform   = document.getElementById('cform');
const formOk  = document.getElementById('formOk');
const fSubmit = document.getElementById('fSubmit');

cform?.addEventListener('submit', e => {
  e.preventDefault();
  const name  = document.getElementById('f-name');
  const email = document.getElementById('f-email');
  const company = document.getElementById('f-company');
  const phone = document.getElementById('f-phone');
  const service = document.getElementById('f-service');
  const msg = document.getElementById('f-msg');

  let valid = true;

  [name, email].forEach(inp => {
    if (!inp?.value.trim()) {
      inp.style.borderColor = '#e53e3e';
      inp.style.boxShadow   = '0 0 0 3px rgba(229,62,62,0.15)';
      valid = false;
    }
  });
  if (!valid) return;

  if (fSubmit) {
    fSubmit.disabled = true;
    fSubmit.innerHTML = 'Sending&hellip; <i class="fas fa-spinner fa-spin"></i>';
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('name', name?.value || '');
  formData.append('email', email?.value || '');
  formData.append('company', company?.value || '');
  formData.append('phone', phone?.value || '');
  formData.append('service', service?.value || '');
  formData.append('message', msg?.value || '');

  // Submit to FormSubmit.co (primary, for immediate email)
  fetch('https://formsubmit.co/ajax/showgifts5@gmail.com', {
    method: 'POST',
    body: formData,
  }).catch(err => console.log('FormSubmit error (expected):', err));

  // Submit to Google Apps Script (secondary, for data logging)
  // Replace GOOGLE_SCRIPT_ID with your actual Google Apps Script deployment ID
  const googleScriptUrl = 'https://script.google.com/macros/s/GOOGLE_SCRIPT_ID/exec';
  fetch(googleScriptUrl, {
    method: 'POST',
    body: formData,
  }).catch(err => console.log('Google Script error:', err));

  setTimeout(() => {
    if (cform) cform.style.display = 'none';
    formOk?.classList.add('show');
  }, 1500);
});

cform?.querySelectorAll('input, textarea, select').forEach(inp => {
  inp.addEventListener('input', () => {
    inp.style.borderColor = '';
    inp.style.boxShadow   = '';
  });
});

/* ── Design Preview — Logo Upload ───────────────────────────── */
const dPrevUpload = document.getElementById('dPrevUpload');
const dPrevInput = document.getElementById('dPrevInput');
const dPrevBrowseLink = document.querySelector('.dprev-browse-link');

// Handle click on upload area
dPrevUpload?.addEventListener('click', () => dPrevInput?.click());

// Handle browse link click
dPrevBrowseLink?.addEventListener('click', (e) => {
  e.preventDefault();
  dPrevInput?.click();
});

// Handle file selection
dPrevInput?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('File size must be less than 5MB');
    return;
  }

  // Read and display the logo
  const reader = new FileReader();
  reader.onload = (event) => {
    const imgSrc = event.target?.result;
    // Display on all product mockups
    [1, 2, 3, 4].forEach(i => {
      const prevImg = document.getElementById(`logoPrev${i}`);
      const placeholder = document.querySelector(`#logoArea${i} .mock-ph`) || document.querySelector(`#logoArea${i} .dprev-ph`) || document.querySelector(`#logoArea${i} .dprev-placeholder`);
      if (prevImg) {
        prevImg.src = imgSrc;
        prevImg.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
      }
    });
  };
  reader.readAsDataURL(file);
});

// Handle drag and drop
dPrevUpload?.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dPrevUpload.style.borderColor = 'var(--gold)';
  dPrevUpload.style.background = 'rgba(201, 168, 76, 0.08)';
});

dPrevUpload?.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dPrevUpload.style.borderColor = '';
  dPrevUpload.style.background = '';
});

dPrevUpload?.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dPrevUpload.style.borderColor = '';
  dPrevUpload.style.background = '';

  const files = e.dataTransfer?.files;
  if (files?.length) {
    dPrevInput.files = files;
    // Trigger change event
    const event = new Event('change', { bubbles: true });
    dPrevInput.dispatchEvent(event);
  }
});

/* ── Hero parallax ────────────────────────────────────────── */
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) return;
    heroImg.style.transform = `scale(1.04) translateY(${window.scrollY * 0.05}px)`;
  }, { passive: true });
}

/* ── Brand tile hover glow ────────────────────────────────── */
document.querySelectorAll('.brand-tile').forEach(tile => {
  tile.addEventListener('mouseenter', () => {
    tile.style.transform = 'translateY(-4px) scale(1.03)';
  });
  tile.addEventListener('mouseleave', () => {
    tile.style.transform = '';
  });
});

/* ── Init active nav on load ──────────────────────────────── */
updateActiveNav();
