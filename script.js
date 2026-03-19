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

/* ── Contact Form ─────────────────────────────────────────── */
const cform   = document.getElementById('cform');
const formOk  = document.getElementById('formOk');
const fSubmit = document.getElementById('fSubmit');

cform?.addEventListener('submit', e => {
  e.preventDefault();
  const name  = document.getElementById('f-name');
  const email = document.getElementById('f-email');
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
