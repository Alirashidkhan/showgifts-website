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
}

popupClose?.addEventListener('click', closePopup);
popupOverlay?.addEventListener('click', (e) => {
  if (e.target === popupOverlay) closePopup();
});
popupCta?.addEventListener('click', closePopup);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && popupOverlay?.classList.contains('show')) closePopup();
});

// Show popup 3 seconds after every page load
setTimeout(() => {
  popupOverlay?.classList.add('show');
  document.body.style.overflow = 'hidden';
}, 3000);

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

/* ── Design Preview — Logo Upload & Studio ──────────────── */
const dPrevUpload = document.getElementById('dPrevUpload');
const dPrevInput = document.getElementById('dPrevInput');
const studioModal = document.getElementById('studioModal');
const studioClose = document.getElementById('studioClose');
const studioCanvas = document.getElementById('studioCanvas');
const studioProductImg = document.getElementById('studioProductImg');
const studioLogoWrapper = document.getElementById('studioLogoWrapper');
const studioLogoImg = document.getElementById('studioLogoImg');
const logoSizeSlider = document.getElementById('logoSizeSlider');
const logoOpacitySlider = document.getElementById('logoOpacitySlider');
const studioHint = document.getElementById('studioHint');

// Upload handlers
dPrevUpload?.addEventListener('click', () => dPrevInput?.click());
document.querySelector('.dprev-browse-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  dPrevInput?.click();
});

dPrevInput?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { alert('File size must be less than 5MB'); return; }

  const reader = new FileReader();
  reader.onload = (ev) => {
    if (studioLogoImg) studioLogoImg.src = ev.target.result;
    openStudio();
  };
  reader.readAsDataURL(file);
});

// Drag and drop on upload area
dPrevUpload?.addEventListener('dragover', (e) => { e.preventDefault(); dPrevUpload.style.borderColor = 'var(--gold)'; dPrevUpload.style.background = 'rgba(201,168,76,0.08)'; });
dPrevUpload?.addEventListener('dragleave', (e) => { e.preventDefault(); dPrevUpload.style.borderColor = ''; dPrevUpload.style.background = ''; });
dPrevUpload?.addEventListener('drop', (e) => {
  e.preventDefault();
  dPrevUpload.style.borderColor = ''; dPrevUpload.style.background = '';
  if (e.dataTransfer?.files?.length) { dPrevInput.files = e.dataTransfer.files; dPrevInput.dispatchEvent(new Event('change', { bubbles: true })); }
});

// Open/close studio
function openStudio() {
  studioModal?.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeStudio() {
  studioModal?.classList.remove('show');
  document.body.style.overflow = '';
}
studioClose?.addEventListener('click', closeStudio);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && studioModal?.classList.contains('show')) closeStudio();
});

// Product switcher
document.querySelectorAll('.studio-prod-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.studio-prod-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (studioProductImg) studioProductImg.src = btn.dataset.img;
    // Reset logo position for new product
    if (studioLogoWrapper) {
      studioLogoWrapper.style.top = '30%';
      studioLogoWrapper.style.left = '50%';
      studioLogoWrapper.style.transform = 'translate(-50%, -50%)';
    }
  });
});

// Size slider
logoSizeSlider?.addEventListener('input', () => {
  if (studioLogoWrapper) studioLogoWrapper.style.width = logoSizeSlider.value + '%';
});

// Opacity slider
logoOpacitySlider?.addEventListener('input', () => {
  if (studioLogoImg) studioLogoImg.style.opacity = logoOpacitySlider.value / 100;
});

// Blend mode toggle
const blendToggle = document.getElementById('blendToggle');
blendToggle?.addEventListener('change', () => {
  if (studioCanvas) {
    studioCanvas.classList.toggle('blend-mode', blendToggle.checked);
  }
});

// DRAG FUNCTIONALITY (mouse + touch)
let isDragging = false;
let dragStartX, dragStartY, logoStartX, logoStartY;

function getPos(e) {
  if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function startDrag(e) {
  if (!studioCanvas || !studioLogoWrapper) return;
  isDragging = true;
  studioLogoWrapper.classList.add('dragging');
  const pos = getPos(e);
  const rect = studioLogoWrapper.getBoundingClientRect();
  dragStartX = pos.x - rect.left;
  dragStartY = pos.y - rect.top;
  // Remove the translate(-50%,-50%) on first drag so positioning is absolute
  studioLogoWrapper.style.transform = 'none';
  studioLogoWrapper.style.left = rect.left - studioCanvas.getBoundingClientRect().left + 'px';
  studioLogoWrapper.style.top = rect.top - studioCanvas.getBoundingClientRect().top + 'px';
  e.preventDefault();
  // Hide hint
  if (studioHint) { studioHint.classList.add('hidden'); }
}

function moveDrag(e) {
  if (!isDragging || !studioCanvas || !studioLogoWrapper) return;
  e.preventDefault();
  const pos = getPos(e);
  const canvasRect = studioCanvas.getBoundingClientRect();
  let newX = pos.x - canvasRect.left - dragStartX;
  let newY = pos.y - canvasRect.top - dragStartY;
  // Clamp within canvas
  const logoW = studioLogoWrapper.offsetWidth;
  const logoH = studioLogoWrapper.offsetHeight;
  newX = Math.max(0, Math.min(newX, canvasRect.width - logoW));
  newY = Math.max(0, Math.min(newY, canvasRect.height - logoH));
  studioLogoWrapper.style.left = newX + 'px';
  studioLogoWrapper.style.top = newY + 'px';
}

function endDrag() {
  isDragging = false;
  studioLogoWrapper?.classList.remove('dragging');
}

studioLogoWrapper?.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', moveDrag);
document.addEventListener('mouseup', endDrag);
studioLogoWrapper?.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('touchmove', moveDrag, { passive: false });
document.addEventListener('touchend', endDrag);

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
