/* =============================================
   PORTFOLIO — Bal Krishna | script.js v3
   Clean rebuild — no duplicate logic
   ============================================= */

/* ── LOADER ──────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1100);
});

/* ── CUSTOM CURSOR ───────────────────────────── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, fX = 0, fY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});
(function tick() {
  fX += (mouseX - fX) * 0.12;
  fY += (mouseY - fY) * 0.12;
  follower.style.left = fX + 'px';
  follower.style.top  = fY + 'px';
  requestAnimationFrame(tick);
})();
document.querySelectorAll(
  'a, button, input, textarea, .achievement-card, .interest-card, .project-card, .skill-chip, .edu-card, .portrait-card'
).forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
});

/* ── NAVBAR SCROLL ───────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── HAMBURGER ───────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(l =>
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  })
);

/* ── ACTIVE NAV LINK ─────────────────────────── */
document.querySelectorAll('section[id]').forEach(sec =>
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(i => i.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.3 }).observe(sec)
);

/* ── SCROLL REVEAL ───────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  if (!el.closest('.hero')) revealObs.observe(el);
});

/* ── SMOOTH SCROLL ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight,
        behavior: 'smooth'
      });
    }
  });
});

/* ── EDUCATION PROGRESS BARS ─────────────────── */
// Animates all .edu-bar-fill[data-pct] bars on scroll-into-view.
// Also animates .edu-counter[data-final] percentage counters.
(function initEduBars() {
  const bars = document.querySelectorAll('.edu-bar-fill[data-pct]');
  if (!bars.length) return;

  function countUp(el) {
    const target   = parseFloat(el.dataset.final);
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : (target % 1 !== 0 ? 1 : 0);
    let start = null;
    const dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      const prog  = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - prog, 4);
      el.textContent = (eased * target).toFixed(decimals) + '%';
      if (prog < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      // Animate bar fill
      e.target.style.width = e.target.dataset.pct + '%';
      // Animate counter in the same card (if any)
      const card = e.target.closest('.edu-card');
      if (card) {
        const counter = card.querySelector('.edu-counter[data-final]');
        if (counter) countUp(counter);
      }
      obs.unobserve(e.target);
    });
  }, { threshold: 0.4 });

  bars.forEach(b => obs.observe(b));
})();

/* ── SKILL BARS ──────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.sb-fill[data-pct]');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.pct + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach(f => obs.observe(f));
})();

/* ── ABOUT STAT COUNTERS ─────────────────────── */
(function initStatCounters() {
  const block = document.querySelector('.about-stats');
  if (!block) return;
  let fired = false;
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      block.querySelectorAll('.stat-number[data-target]').forEach(el => {
        const target   = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || 0);
        const suffix   = el.dataset.suffix || '';
        let start = null;
        const dur = 1800;
        function step(ts) {
          if (!start) start = ts;
          const prog  = Math.min((ts - start) / dur, 1);
          const eased = 1 - Math.pow(1 - prog, 4);
          el.textContent = (eased * target).toFixed(decimals) + suffix;
          if (prog < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }, { threshold: 0.5 }).observe(block);
})();

/* ── CONTACT FORM ────────────────────────────── */
const form     = document.getElementById('contact-form');
const formSucc = document.getElementById('form-success');
const formBtn  = document.getElementById('form-submit');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const txt = formBtn.querySelector('.btn-text');
    txt.textContent = 'Sending…'; formBtn.disabled = true;
    setTimeout(() => {
      form.reset();
      txt.textContent = 'Send Message'; formBtn.disabled = false;
      formSucc.classList.add('show');
      setTimeout(() => formSucc.classList.remove('show'), 5000);
    }, 1600);
  });
}

/* ── DOWNLOAD RESUME (placeholder) ──────────── */
['download-resume', 'about-resume'].forEach(id => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-info-circle"></i> Resume not uploaded yet';
    btn.style.opacity = '0.7';
    setTimeout(() => { btn.innerHTML = orig; btn.style.opacity = ''; }, 2800);
  });
});

/* ── HERO ORBS PARALLAX ──────────────────────── */
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (orb1) orb1.style.transform = `translateY(${y * 0.14}px)`;
  if (orb2) orb2.style.transform = `translateY(${y * -0.11}px)`;
}, { passive: true });

/* ── ACHIEVEMENT CARD TILT ───────────────────── */
document.querySelectorAll('.achievement-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    card.style.transform = `translateY(-10px) scale(1.01) rotateX(${-dy*4}deg) rotateY(${dx*4}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});