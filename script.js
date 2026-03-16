/* =============================================
   PORTFOLIO — Bal Krishna | script.js v4
   ============================================= */

/* ── LOADER ──────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1100);
});

/* ── CUSTOM CURSOR ───────────────────────────── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, fX = 0, fY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
  fX += (mouseX - fX) * 0.12;
  fY += (mouseY - fY) * 0.12;
  follower.style.left = fX + 'px';
  follower.style.top  = fY + 'px';
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll(
  'a, button, input, textarea, .achievement-card, .interest-card, ' +
  '.project-card, .skill-chip, .edu-card, .portrait-card'
).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    follower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    follower.classList.remove('hover');
  });
});

/* ── NAVBAR SCROLL ───────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── HAMBURGER MENU ──────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── ACTIVE NAV LINK ON SCROLL ───────────────── */
document.querySelectorAll('section[id]').forEach(section => {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 }).observe(section);
});

/* ── SMOOTH SCROLL ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
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

/* ── SCROLL REVEAL ───────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  if (!el.closest('.hero')) revealObserver.observe(el);
});

/* ── EDUCATION PROGRESS BARS & COUNTERS ─────── */
(function initEduBars() {
  const bars = document.querySelectorAll('.edu-bar-fill[data-pct]');
  if (!bars.length) return;

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.final);
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : (target % 1 !== 0 ? 1 : 0);
    const duration = 1600;
    let startTime  = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 4);
      el.textContent = (eased * target).toFixed(decimals) + '%';
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Animate the bar width
      entry.target.style.width = entry.target.dataset.pct + '%';
      // Animate percentage counter in same card (Class 12 & Class 10 only)
      const card    = entry.target.closest('.edu-card');
      const counter = card ? card.querySelector('.edu-counter[data-final]') : null;
      if (counter) animateCounter(counter);
      barObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => barObserver.observe(bar));
})();

/* ── SKILL BARS ──────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.sb-fill[data-pct]');
  if (!fills.length) return;

  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.pct + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  fills.forEach(fill => skillObserver.observe(fill));
})();

/* ── ABOUT STAT COUNTERS ─────────────────────── */
(function initStatCounters() {
  const statsBlock = document.querySelector('.about-stats');
  if (!statsBlock) return;
  let fired = false;

  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      statsBlock.querySelectorAll('.stat-number[data-target]').forEach(el => {
        const target   = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || 0);
        const suffix   = el.dataset.suffix || '';
        const duration = 1800;
        let startTime  = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 4);
          el.textContent = (eased * target).toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }, { threshold: 0.5 }).observe(statsBlock);
})();

/* ── CONTACT FORM — NETLIFY ──────────────────── */
const form     = document.getElementById('contact-form');
const formSucc = document.getElementById('form-success');
const formBtn  = document.getElementById('form-submit');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btnText = formBtn.querySelector('.btn-text');
    btnText.textContent = 'Sending\u2026';
    formBtn.disabled = true;

    // Encode data as application/x-www-form-urlencoded (required by Netlify)
    const encode = data =>
      Object.keys(data)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
        .join('&');

    const payload = encode({
      'form-name': 'portfolio-contact',
      name:    document.getElementById('f-name').value.trim(),
      email:   document.getElementById('f-email').value.trim(),
      subject: document.getElementById('f-subject').value.trim() || '(no subject)',
      message: document.getElementById('f-message').value.trim(),
    });

    try {
      const response = await fetch('/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    payload,
      });

      if (response.ok) {
        form.reset();
        formSucc.style.color = '';
        formSucc.innerHTML   =
          '<i class="fa fa-check-circle"></i> Message sent! I\'ll get back to you soon.';
        formSucc.classList.add('show');
        setTimeout(() => formSucc.classList.remove('show'), 6000);
      } else {
        throw new Error('Server responded with status ' + response.status);
      }
    } catch (err) {
      formSucc.style.color = '#dc2626';
      formSucc.innerHTML   =
        '<i class="fa fa-exclamation-circle"></i> Something went wrong &mdash; ' +
        'please email me at 25ce3015@rgipt.ac.in';
      formSucc.classList.add('show');
    } finally {
      btnText.textContent  = 'Send Message';
      formBtn.disabled     = false;
    }
  });
}

/* ── DOWNLOAD RESUME (placeholder) ──────────── */
['download-resume', 'about-resume'].forEach(id => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', ()=> {
   console.log("resume link clicked");
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

/* ── ACHIEVEMENT CARD 3-D TILT ───────────────── */
document.querySelectorAll('.achievement-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    card.style.transform =
      `translateY(-10px) scale(1.01) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
