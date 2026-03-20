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

/* ── Design Preview — Logo Upload & Studio (v2) ─────────── */
const dPrevUpload = document.getElementById('dPrevUpload');
const dPrevInput = document.getElementById('dPrevInput');
const dPrevUploadContent = document.getElementById('dPrevUploadContent');
const dPrevPreview = document.getElementById('dPrevPreview');
const dPrevThumb = document.getElementById('dPrevThumb');
const dPrevFilename = document.getElementById('dPrevFilename');
const dPrevFilesize = document.getElementById('dPrevFilesize');
const dPrevRemove = document.getElementById('dPrevRemove');
const studioModal = document.getElementById('studioModal');
const studioClose = document.getElementById('studioClose');
const studioCanvas = document.getElementById('studioCanvas');
const studioProductBg = document.getElementById('studioProductBg');
const studioPrintZone = document.getElementById('studioPrintZone');
const studioLogoWrapper = document.getElementById('studioLogoWrapper');
const studioLogoImg = document.getElementById('studioLogoImg');
const logoSizeSlider = document.getElementById('logoSizeSlider');
const logoRotateSlider = document.getElementById('logoRotateSlider');
const logoOpacitySlider = document.getElementById('logoOpacitySlider');
const rotateVal = document.getElementById('rotateVal');
const studioHint = document.getElementById('studioHint');
const studioCenter = document.getElementById('studioCenter');
const studioResetRotation = document.getElementById('studioResetRotation');
const blendToggle = document.getElementById('blendToggle');

const PRODUCTS = {
  tshirt: {
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    bg: '#f5f5f5',
    zone: { top: 22, left: 28, width: 44, height: 36 },
  },
  mug: {
    img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80',
    bg: '#f0ece4',
    zone: { top: 25, left: 30, width: 40, height: 32 },
  },
  bag: {
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    bg: '#f3f1ec',
    zone: { top: 18, left: 22, width: 56, height: 48 },
  },
  cap: {
    img: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=800&q=80',
    bg: '#eeeeee',
    zone: { top: 20, left: 30, width: 40, height: 28 },
  },
};

let currentProduct = 'tshirt';
let currentRotation = 0;

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function handleLogoFile(file) {
  if (!file) return;
  const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
  if (!validTypes.includes(file.type)) { alert('Please upload a PNG, JPG, SVG, or WebP image.'); return; }
  if (file.size > 5 * 1024 * 1024) { alert('File size must be less than 5 MB.'); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;
    if (dPrevThumb) dPrevThumb.src = dataUrl;
    if (dPrevFilename) dPrevFilename.textContent = file.name;
    if (dPrevFilesize) dPrevFilesize.textContent = formatFileSize(file.size);
    if (dPrevUploadContent) dPrevUploadContent.style.display = 'none';
    if (dPrevPreview) dPrevPreview.style.display = 'flex';
    if (dPrevUpload) dPrevUpload.classList.add('has-file');
    if (studioLogoImg) studioLogoImg.src = dataUrl;
    openStudio();
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  if (dPrevInput) dPrevInput.value = '';
  if (dPrevUploadContent) dPrevUploadContent.style.display = '';
  if (dPrevPreview) dPrevPreview.style.display = 'none';
  if (dPrevUpload) dPrevUpload.classList.remove('has-file');
  if (dPrevThumb) dPrevThumb.src = '';
}

dPrevInput?.addEventListener('change', (e) => handleLogoFile(e.target.files?.[0]));
dPrevRemove?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); resetUpload(); });
dPrevUpload?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dPrevInput?.click(); }
});

let dragCounter = 0;
dPrevUpload?.addEventListener('dragenter', (e) => { e.preventDefault(); e.stopPropagation(); dragCounter++; dPrevUpload.classList.add('drag-over'); });
dPrevUpload?.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); });
dPrevUpload?.addEventListener('dragleave', (e) => {
  e.preventDefault(); e.stopPropagation(); dragCounter--;
  if (dragCounter <= 0) { dragCounter = 0; dPrevUpload.classList.remove('drag-over'); }
});
dPrevUpload?.addEventListener('drop', (e) => {
  e.preventDefault(); e.stopPropagation(); dragCounter = 0;
  dPrevUpload.classList.remove('drag-over');
  if (e.dataTransfer?.files?.length) handleLogoFile(e.dataTransfer.files[0]);
});

function openStudio() {
  studioModal?.classList.add('show');
  document.body.style.overflow = 'hidden';
  applyProduct(currentProduct);
  centerLogoInZone();
}
function closeStudio() {
  studioModal?.classList.remove('show');
  document.body.style.overflow = '';
}
studioClose?.addEventListener('click', closeStudio);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && studioModal?.classList.contains('show')) closeStudio();
});

function applyProduct(id) {
  const p = PRODUCTS[id];
  if (!p) return;
  currentProduct = id;
  if (studioProductBg) {
    studioProductBg.style.backgroundImage = `url('${p.img}')`;
    studioProductBg.style.backgroundColor = p.bg;
  }
  if (studioPrintZone) {
    studioPrintZone.style.top = p.zone.top + '%';
    studioPrintZone.style.left = p.zone.left + '%';
    studioPrintZone.style.width = p.zone.width + '%';
    studioPrintZone.style.height = p.zone.height + '%';
  }
}

document.querySelectorAll('.studio-prod-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.studio-prod-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyProduct(btn.dataset.product);
    centerLogoInZone();
  });
});

function centerLogoInZone() {
  const p = PRODUCTS[currentProduct];
  if (!p || !studioLogoWrapper || !studioCanvas) return;
  const canvasW = studioCanvas.offsetWidth;
  const canvasH = studioCanvas.offsetHeight;
  const zoneX = (p.zone.left / 100) * canvasW;
  const zoneY = (p.zone.top / 100) * canvasH;
  const zoneW = (p.zone.width / 100) * canvasW;
  const zoneH = (p.zone.height / 100) * canvasH;
  const logoW = studioLogoWrapper.offsetWidth;
  const logoH = studioLogoWrapper.offsetHeight;
  studioLogoWrapper.style.left = (zoneX + (zoneW - logoW) / 2) + 'px';
  studioLogoWrapper.style.top = (zoneY + (zoneH - logoH) / 2) + 'px';
  studioLogoWrapper.style.transform = `rotate(${currentRotation}deg)`;
}

studioCenter?.addEventListener('click', centerLogoInZone);

logoSizeSlider?.addEventListener('input', () => {
  const p = PRODUCTS[currentProduct];
  if (!p || !studioLogoWrapper || !studioCanvas) return;
  const canvasW = studioCanvas.offsetWidth;
  const zoneW = (p.zone.width / 100) * canvasW;
  studioLogoWrapper.style.width = (logoSizeSlider.value / 100) * zoneW + 'px';
});

logoRotateSlider?.addEventListener('input', () => {
  currentRotation = parseInt(logoRotateSlider.value);
  if (rotateVal) rotateVal.textContent = currentRotation + '\u00B0';
  if (studioLogoWrapper) studioLogoWrapper.style.transform = `rotate(${currentRotation}deg)`;
});

studioResetRotation?.addEventListener('click', () => {
  currentRotation = 0;
  if (logoRotateSlider) logoRotateSlider.value = 0;
  if (rotateVal) rotateVal.textContent = '0\u00B0';
  if (studioLogoWrapper) studioLogoWrapper.style.transform = 'rotate(0deg)';
});

logoOpacitySlider?.addEventListener('input', () => {
  if (studioLogoImg) studioLogoImg.style.opacity = logoOpacitySlider.value / 100;
});

blendToggle?.addEventListener('change', () => {
  studioCanvas?.classList.toggle('blend-mode', blendToggle.checked);
});

/* Drag — constrained to print zone */
let isDragging = false;
let dragOffsetX = 0, dragOffsetY = 0;

function getPointerPos(e) {
  if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}
function startDrag(e) {
  if (!studioCanvas || !studioLogoWrapper) return;
  isDragging = true;
  studioLogoWrapper.classList.add('dragging');
  const pos = getPointerPos(e);
  const rect = studioLogoWrapper.getBoundingClientRect();
  dragOffsetX = pos.x - rect.left;
  dragOffsetY = pos.y - rect.top;
  e.preventDefault();
  if (studioHint) studioHint.classList.add('hidden');
}
function moveDrag(e) {
  if (!isDragging || !studioCanvas || !studioLogoWrapper) return;
  e.preventDefault();
  const p = PRODUCTS[currentProduct];
  if (!p) return;
  const pos = getPointerPos(e);
  const canvasRect = studioCanvas.getBoundingClientRect();
  const zL = (p.zone.left / 100) * canvasRect.width;
  const zT = (p.zone.top / 100) * canvasRect.height;
  const zW = (p.zone.width / 100) * canvasRect.width;
  const zH = (p.zone.height / 100) * canvasRect.height;
  const logoW = studioLogoWrapper.offsetWidth;
  const logoH = studioLogoWrapper.offsetHeight;
  let newX = pos.x - canvasRect.left - dragOffsetX;
  let newY = pos.y - canvasRect.top - dragOffsetY;
  const pad = -10;
  newX = Math.max(zL + pad, Math.min(newX, zL + zW - logoW - pad));
  newY = Math.max(zT + pad, Math.min(newY, zT + zH - logoH - pad));
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

applyProduct('tshirt');

/* ── FAQ Accordion ────────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all other items
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) openItem.classList.remove('open');
    });

    // Toggle current
    item.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', !isOpen);
  });
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
