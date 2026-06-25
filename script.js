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
  // Páginas sem foto de fundo na Hero (Procedimentos, Produtos) já nascem no modo "claro"
  nav.classList.add('scrolled');
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

// ──────────────────────────────────────────────
// CARRINHO — procedimentos + produtos → WhatsApp
// Persiste em localStorage, então funciona entre
// index.html, procedimentos.html e produtos.html.
// ──────────────────────────────────────────────
const CART_KEY = 'esterCart';
const WHATSAPP_NUMBER = '5511995281516';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

function addToCart(id, name, price, type) {
  const cart = getCart();
  if (cart.some(i => i.id === id)) return false; // já está no carrinho
  cart.push({ id, name, price, type });
  saveCart(cart);
  return true;
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function formatPrice(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

function cartTotal(cart) {
  return cart.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
}

function renderCart() {
  const cart = getCart();
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!countEl || !itemsEl) return; // página sem o widget do carrinho

  countEl.textContent = cart.length;
  countEl.style.display = cart.length ? 'flex' : 'none';

  if (!cart.length) {
    itemsEl.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.<br>Adicione procedimentos ou produtos para agendar.</p>';
  } else {
    itemsEl.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div>
          <span class="cart-item-name">${i.name}</span>
          <span class="cart-item-type">${i.type === 'produto' ? 'Produto' : 'Procedimento'}</span>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-price">${i.price ? formatPrice(Number(i.price)) : ''}</span>
          <button class="cart-item-remove" data-id="${i.id}" aria-label="Remover item">&#215;</button>
        </div>
      </div>
    `).join('');
  }

  if (totalEl) totalEl.textContent = formatPrice(cartTotal(cart));

  itemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });
}

function buildWhatsAppMessage() {
  const cart = getCart();
  const procedimentos = cart.filter(i => i.type === 'procedimento');
  const produtos = cart.filter(i => i.type === 'produto');

  let msg = 'Olá! Tudo bem? Vim pelo site';

  if (procedimentos.length) {
    msg += ' e gostaria de agendar o(s) seguinte(s) procedimento(s):\n';
    procedimentos.forEach(p => { msg += `• ${p.name}\n`; });
  }

  if (produtos.length) {
    msg += procedimentos.length
      ? '\nTambém tenho interesse no(s) seguinte(s) produto(s):\n'
      : ' e gostaria de saber mais sobre o(s) seguinte(s) produto(s):\n';
    produtos.forEach(p => { msg += `• ${p.name}\n`; });
  }

  if (procedimentos.length && produtos.length) {
    msg += '\nPoderia me informar os horários disponíveis e mais detalhes sobre o(s) produto(s)?';
  } else if (procedimentos.length) {
    msg += '\nPoderia me informar os horários disponíveis?';
  } else if (produtos.length) {
    msg += '\nPoderia me informar mais detalhes sobre o(s) produto(s) e como retirar/receber?';
  }

  msg += '\n\nObrigada!';
  return msg;
}

function initCartWidget() {
  renderCart();
  const cartBtn = document.getElementById('cart-btn');
  const cartPanel = document.getElementById('cart-panel');
  const cartClose = document.getElementById('cart-close');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartFinish = document.getElementById('cart-finish');
  if (!cartBtn || !cartPanel) return;

  const openCart = () => {
    cartPanel.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeCart = () => {
    cartPanel.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  cartFinish.addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) return;
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
  });
}

function initAddToCartButtons() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, name, price, type } = btn.dataset;
      const span = btn.querySelector('span');
      const added = addToCart(id, name, parseFloat(price) || 0, type);
      if (added) {
        btn.classList.add('added');
        if (span) span.textContent = 'Adicionado ✓';
        setTimeout(() => {
          btn.classList.remove('added');
          if (span) span.textContent = 'Adicionar ao carrinho';
        }, 1800);
      } else {
        btn.classList.add('already');
        setTimeout(() => btn.classList.remove('already'), 400);
      }
    });
  });
}

initCartWidget();
initAddToCartButtons();
