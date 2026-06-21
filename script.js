// ── NAV SCROLL ──
// Fica branco/transparente enquanto a foto da Hero estiver visível,
// e assume o fundo claro + texto escuro assim que o usuário passar dela.
const nav = document.getElementById('nav');
const heroSection = document.getElementById('hero');

if (heroSection) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      nav.classList.toggle('scrolled', !entry.isIntersecting);
    });
  }, { threshold: 0, rootMargin: '-72px 0px 0px 0px' });
  navObserver.observe(heroSection);
} else {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

// ── MOBILE MENU ──
const hamburger = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuClose = document.getElementById('menu-close');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});
menuClose.addEventListener('click', closeMobileMenu);

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ── HERO LABEL LINE ──
setTimeout(() => {
  const heroLine = document.getElementById('hero-line');
  if (heroLine) heroLine.style.width = '40px';
}, 1000);

// ── WHATSAPP FLOAT ──
setTimeout(() => {
  document.getElementById('whatsapp-float').classList.add('visible');
}, 3000);

// ── INTERSECTION OBSERVER — REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const labelLines = document.querySelectorAll('.label-line');
const timelineLine = document.getElementById('timeline-line');

// Stagger children within each section
document.querySelectorAll('section').forEach(section => {
  section.querySelectorAll('.reveal').forEach((child, i) => {
    if (!child.dataset.delay) child.dataset.delay = i * 110;
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('revealed')) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('revealed'), delay);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Label lines
const lineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      lineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
labelLines.forEach(l => lineObserver.observe(l));

// Timeline line
if (timelineLine) {
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        tlObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  tlObserver.observe(timelineLine);
}

// Authority stage lines
const authSection = document.getElementById('authority');
if (authSection) {
  const authObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ll = document.getElementById('auth-line-left');
        const rl = document.getElementById('auth-line-right');
        if (ll) ll.style.width = '110px';
        if (rl) rl.style.width = '110px';
        authObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  authObserver.observe(authSection);
}

// ── CLICK FEEDBACK ──
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('click', function () {
    const prev = this.style.transform;
    this.style.transform = (prev || '') + ' scale(0.97)';
    setTimeout(() => { this.style.transform = prev || ''; }, 80);
  });
});
