/* ====================== LOADER ====================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
  }, 1600);
});

/* ====================== CURSOR ====================== */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .cat-card, .product-card, .filter-tab').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px'; cursor.style.height = '20px';
    cursorRing.style.width = '50px'; cursorRing.style.height = '50px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px'; cursor.style.height = '12px';
    cursorRing.style.width = '36px'; cursorRing.style.height = '36px';
  });
});

/* ====================== CANVAS BG ====================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - .5) * .3,
      vy: (Math.random() - .5) * .3,
      alpha: Math.random() * .5 + .1
    });
  }
}

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(0,229,255,${p.alpha})`;
    ctx.fill();
  });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,229,255,${(1 - dist/120) * .08})`;
        ctx.lineWidth = .5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawCanvas);
}

resize(); createParticles(); drawCanvas();
window.addEventListener('resize', () => { resize(); createParticles(); });

/* ====================== SCROLL REVEAL ====================== */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

/* ====================== COUNTER ANIMATION ====================== */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounter(document.getElementById('count1'), 500);
    animateCounter(document.getElementById('count2'), 350);
    animateCounter(document.getElementById('count3'), 10);
    heroObserver.disconnect();
  }
}, { threshold: .3 });
heroObserver.observe(document.querySelector('.hero-stats'));

/* ====================== NAVBAR SCROLL ====================== */
const navbar = document.querySelector('.navbar-epsilon');
window.addEventListener('scroll', () => {
  navbar.style.padding = window.scrollY > 60 ? '0 2rem' : '0 2rem';
  navbar.style.background = window.scrollY > 60
    ? 'rgba(7,11,20,.98)'
    : 'rgba(7,11,20,.85)';
});

/* ====================== PRODUCT FILTER ====================== */
function filterProducts(btn, cat) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.product-item').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.display = '';
      setTimeout(() => card.classList.add('visible'), 50);
    } else {
      card.style.display = 'none';
    }
  });
}

/* ====================== CART BUTTON ====================== */
document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', function() {
    const icon = this.querySelector('i');
    icon.className = 'fas fa-check';
    this.style.background = 'var(--primary)';
    this.style.color = 'var(--dark)';
    setTimeout(() => {
      icon.className = 'fas fa-cart-plus';
      this.style.background = '';
      this.style.color = '';
    }, 1500);
  });
});

/* ====================== FORM HANDLER ====================== */
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Envoi en cours...';
  btn.disabled = true;
  setTimeout(() => {
    e.target.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 1800);
}

/* ====================== SMOOTH ANCHOR ====================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});