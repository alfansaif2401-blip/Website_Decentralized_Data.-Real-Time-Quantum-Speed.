/**
 * ============================================================
 *  QUANTUMSPHERE PORTAL — script.js
 *  Author  : Moh Alfan Syaifullah
 *  Course  : Belajar Dasar Pemrograman Web — Dicoding
 *  Stack   : Pure Vanilla JavaScript (DOM Manipulation)
 * ============================================================
 */

'use strict';

/* ────────────────────────────────────────────────────────────
   1. DOM ELEMENT REFERENCES
   ──────────────────────────────────────────────────────────── */
const header        = document.getElementById('mainHeader');
const hamburger     = document.getElementById('hamburger');
const mainNav       = document.getElementById('mainNav');
const navLinks      = document.querySelectorAll('.nav-link');
const toast         = document.getElementById('toast');
const modalOverlay  = document.getElementById('modalOverlay');
const modalClose    = document.getElementById('modalClose');
const modalConfirm  = document.getElementById('modalConfirm');
const modalTitle    = document.getElementById('modalTitle');
const modalMsg      = document.getElementById('modalMsg');
const btnExplore    = document.getElementById('btnExplore');
const btnContact    = document.getElementById('btnContact');
const btnPingNode   = document.getElementById('btnPingNode');
const nodeCounter   = document.getElementById('nodeCounter');
const counterLog    = document.getElementById('counterLog');
const liveClock     = document.getElementById('liveClock');
const cpuBar        = document.getElementById('cpuBar');
const cpuVal        = document.getElementById('cpuVal');
const memBar        = document.getElementById('memBar');
const memVal        = document.getElementById('memVal');
const upBar         = document.getElementById('upBar');
const upVal         = document.getElementById('upVal');
const terminalInput = document.getElementById('terminalInput');
const terminalBody  = document.getElementById('terminalBody');
const particleCanvas= document.getElementById('particleCanvas');
const statNumbers   = document.querySelectorAll('.stat-number');
const skillBars     = document.querySelectorAll('.skill-bar');
const valueCards    = document.querySelectorAll('.value-card');
const projectCards  = document.querySelectorAll('.project-card');

/* ────────────────────────────────────────────────────────────
   2. STATE
   ──────────────────────────────────────────────────────────── */
let interactionCount = 0;
let statsAnimated    = false;
let skillsAnimated   = false;
let toastTimeout     = null;
const startTime      = Date.now();

/* ────────────────────────────────────────────────────────────
   3. PARTICLE CANVAS BACKGROUND
   ──────────────────────────────────────────────────────────── */
(function initParticles() {
  const ctx    = particleCanvas.getContext('2d');
  let W, H, particles = [], animId;

  const COLORS = ['rgba(0,242,254,', 'rgba(155,81,224,', 'rgba(247,37,133,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.vx = (Math.random() - 0.5) * 0.15;
      this.a  = Math.random() * 0.5 + 0.1;
      this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.c + this.a + ')';
      ctx.fill();
    }
  }

  function resize() {
    W = particleCanvas.width  = window.innerWidth;
    H = particleCanvas.height = window.innerHeight;
  }

  function spawnParticles() {
    const count = Math.min(Math.floor((W * H) / 8000), 120);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Draw subtle grid
    ctx.strokeStyle = 'rgba(0,242,254,0.03)';
    ctx.lineWidth = 1;
    const gSize = 80;
    for (let x = 0; x < W; x += gSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    spawnParticles();
    loop();
  });

  resize();
  spawnParticles();
  loop();
})();

/* ────────────────────────────────────────────────────────────
   4. HEADER — scroll shadow
   ──────────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
}, { passive: true });

/* ────────────────────────────────────────────────────────────
   5. HAMBURGER MENU
   ──────────────────────────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mainNav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

/* Close nav when a link is clicked on mobile */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mainNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ────────────────────────────────────────────────────────────
   6. ACTIVE NAV LINK (scroll spy)
   ──────────────────────────────────────────────────────────── */
function updateActiveNav() {
  const sections = ['home','about','projects','skills','contact'];
  let current = 'home';

  sections.forEach(id => {
    const el = document.getElementById(id === 'home' ? 'heroSection' : id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= 120) current = id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

/* ────────────────────────────────────────────────────────────
   7. TOAST NOTIFICATION
   ──────────────────────────────────────────────────────────── */
function showToast(message, duration = 3000) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ────────────────────────────────────────────────────────────
   8. MODAL
   ──────────────────────────────────────────────────────────── */
function showModal(title, message, onConfirm) {
  modalTitle.textContent  = title;
  modalMsg.textContent    = message;
  modalOverlay.classList.add('show');
  modalOverlay._onConfirm = onConfirm || null;
}

function closeModal() {
  modalOverlay.classList.remove('show');
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
modalConfirm.addEventListener('click', () => {
  if (modalOverlay._onConfirm) modalOverlay._onConfirm();
  closeModal();
});

/* ────────────────────────────────────────────────────────────
   9. HERO BUTTONS
   ──────────────────────────────────────────────────────────── */
btnExplore.addEventListener('click', () => {
  incrementCounter('Explore Portal activated');
  showModal(
    '⟡ System Access Granted',
    'Selamat datang di QuantumSphere Portal! Anda telah berhasil mengakses node utama sistem. Scroll ke bawah untuk menjelajahi semua fitur.',
    () => {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    }
  );
});

btnContact.addEventListener('click', () => {
  incrementCounter('Contact node pinged');
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  showToast('⟡ Navigating to Communication Hub...');
});

/* ────────────────────────────────────────────────────────────
   10. VALUE CARDS — interactive highlight
   ──────────────────────────────────────────────────────────── */
valueCards.forEach(card => {
  card.addEventListener('click', () => {
    valueCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const value = card.dataset.value;
    const messages = {
      integrity:     '⬡ INTEGRITY — Saya berkomitmen untuk selalu jujur dan bertindak dengan standar etika tertinggi dalam setiap pekerjaan.',
      accountability:'⬡ ACCOUNTABILITY — Saya bertanggung jawab penuh atas setiap keputusan dan hasil pekerjaan saya.',
      transparency:  '⬡ TRANSPARENCY — Komunikasi terbuka dan jelas adalah fondasi dari kerja sama yang produktif.'
    };
    incrementCounter(`Value card: ${value}`);
    showToast(messages[value] || value);
  });
});

/* ────────────────────────────────────────────────────────────
   11. PROJECT CARDS — click interaction
   ──────────────────────────────────────────────────────────── */
const projectData = {
  proj1: { name: 'QuantumSphere Portal', desc: 'Portal web futuristik dengan dark glassmorphism design system, partikel canvas background, dan interaktivitas DOM tingkat lanjut. Dibuat menggunakan pure HTML5, CSS3, dan Vanilla JavaScript.' },
  proj2: { name: 'NeuralNote App',       desc: 'Aplikasi catatan pintar dengan antarmuka minimalis, sistem tag berwarna, dan penyimpanan data menggunakan LocalStorage API.' },
  proj3: { name: 'EcoTrack Dashboard',   desc: 'Dashboard monitoring lingkungan dengan visualisasi data real-time menggunakan Canvas API dan sistem notifikasi otomatis.' },
  proj4: { name: 'Horizon Landing',      desc: 'Landing page responsif dengan animasi scroll reveal, desain premium, dan skor Lighthouse sempurna untuk klien startup teknologi.' }
};

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const data = projectData[card.id];
    if (!data) return;
    incrementCounter(`Project viewed: ${data.name}`);
    showModal(`◈ ${data.name}`, data.desc);
  });
});

/* ────────────────────────────────────────────────────────────
   12. NODE COUNTER (SIDEBAR)
   ──────────────────────────────────────────────────────────── */
const logMessages = [
  'Node synchronization complete.',
  'Data stream established.',
  'Quantum channel opened.',
  'Signal amplitude: optimal.',
  'Neural pathway activated.',
  'Bandwidth allocation: 100%.',
  'Protocol handshake successful.',
  'Security scan: all clear.',
  'Grid connection verified.',
  'System integrity: nominal.',
  '⚠ Anomaly detected — analyzing...',
  '⚠ High traffic volume detected.',
  '🔴 Alert: Unauthorized ping attempt logged.',
  'Memory defrag: complete.',
  'Cache purged successfully.'
];

function incrementCounter(context) {
  interactionCount++;
  nodeCounter.textContent = interactionCount;

  // Bounce animation
  nodeCounter.style.animation = 'none';
  void nodeCounter.offsetWidth; // reflow
  nodeCounter.style.animation = 'counterBounce .4s ease';

  // Add log entry
  const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
  const ts  = new Date().toLocaleTimeString('id-ID', { hour12: false });
  const cls = msg.startsWith('🔴') ? 'danger'
            : msg.startsWith('⚠')  ? 'warn'
            : 'new';

  const entry = document.createElement('p');
  entry.className = `log-entry ${cls}`;
  entry.textContent = `[${ts}] ${msg}`;
  counterLog.insertBefore(entry, counterLog.firstChild);

  // Keep log to last 8 entries
  while (counterLog.children.length > 8) {
    counterLog.removeChild(counterLog.lastChild);
  }

  // Milestone alerts
  const milestones = { 5: 'Node threshold 5 reached!', 10: '🎉 10 Interactions — Sistem dalam kondisi prima!', 25: '🔥 25 Interactions — Quantum overload approaching!' };
  if (milestones[interactionCount]) {
    showToast(`◈ ${milestones[interactionCount]}`);
  }
}

btnPingNode.addEventListener('click', () => {
  incrementCounter('Manual ping');

  // Visual ripple on button
  btnPingNode.style.boxShadow = '0 0 40px rgba(0,242,254,.6)';
  setTimeout(() => { btnPingNode.style.boxShadow = ''; }, 400);
});

/* ────────────────────────────────────────────────────────────
   13. LIVE CLOCK & SYSTEM MONITOR
   ──────────────────────────────────────────────────────────── */
function updateClock() {
  const now = new Date();
  const h   = String(now.getHours()).padStart(2, '0');
  const m   = String(now.getMinutes()).padStart(2, '0');
  const s   = String(now.getSeconds()).padStart(2, '0');
  liveClock.textContent = `${h}:${m}:${s}`;
}

function updateSystemMonitor() {
  // Simulated dynamic values
  const cpu = Math.floor(Math.random() * 30 + 25);
  const mem = Math.floor(Math.random() * 20 + 50);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const upPct   = Math.min(Math.floor((elapsed / 300) * 100), 99);

  cpuBar.style.width = cpu + '%';
  cpuVal.textContent = cpu + '%';
  memBar.style.width = mem + '%';
  memVal.textContent = mem + '%';
  upBar.style.width  = upPct + '%';

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  upVal.textContent = `${mins}m${secs}s`;
}

// Start intervals
setInterval(updateClock, 1000);
setInterval(updateSystemMonitor, 2500);
updateClock();
updateSystemMonitor();

/* ────────────────────────────────────────────────────────────
   14. ANIMATED COUNTER (HERO STATS)
   ──────────────────────────────────────────────────────────── */
function animateCounter(el, target, duration = 1400) {
  let start     = null;
  const startVal = 0;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(startVal + (target - startVal) * ease);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* ────────────────────────────────────────────────────────────
   15. SKILL BARS ANIMATION
   ──────────────────────────────────────────────────────────── */
function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;
  skillBars.forEach((bar, i) => {
    const width = bar.dataset.width + '%';
    setTimeout(() => { bar.style.width = width; }, i * 180);
  });
}

/* ────────────────────────────────────────────────────────────
   16. SCROLL REVEAL & INTERSECTION OBSERVER
   ──────────────────────────────────────────────────────────── */
function setupScrollReveal() {
  // Add 'reveal' class to cards and sections
  const targets = document.querySelectorAll(
    '.project-card, .value-card, .skill-row, .contact-item, .tech-badge'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));

  // Stats observer
  const statsSection = document.querySelector('.hero-stats');
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
        statsObs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  if (statsSection) statsObs.observe(statsSection);

  // Skills observer
  const skillsSection = document.getElementById('articleSkills');
  const skillsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
        skillsObs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  if (skillsSection) skillsObs.observe(skillsSection);
}

/* ────────────────────────────────────────────────────────────
   17. TERMINAL EMULATOR
   ──────────────────────────────────────────────────────────── */
const terminalCommands = {
  help: () => [
    { t: 'response', m: 'Perintah tersedia:' },
    { t: 'info',     m: '  help        — Tampilkan daftar perintah' },
    { t: 'info',     m: '  whoami      — Info developer' },
    { t: 'info',     m: '  skills      — Daftar keahlian teknis' },
    { t: 'info',     m: '  values      — Core values saya' },
    { t: 'info',     m: '  ping        — Ping sistem' },
    { t: 'info',     m: '  date        — Tampilkan tanggal & waktu' },
    { t: 'info',     m: '  projects    — Daftar proyek' },
    { t: 'info',     m: '  clear       — Bersihkan terminal' },
    { t: 'info',     m: '  about       — Tentang portal ini' },
  ],
  whoami: () => [
    { t: 'response', m: '→ Name    : Moh Alfan Syaifullah' },
    { t: 'response', m: '→ Role    : Front-End Developer' },
    { t: 'response', m: '→ Course  : Belajar Dasar Pemrograman Web' },
    { t: 'response', m: '→ Platform: Dicoding Indonesia' },
  ],
  skills: () => [
    { t: 'response', m: '→ HTML5 Semantic    [95%] ████████████████████' },
    { t: 'response', m: '→ CSS3 & Animations [90%] ██████████████████░░' },
    { t: 'response', m: '→ JavaScript DOM    [85%] █████████████████░░░' },
    { t: 'response', m: '→ Responsive Design [92%] ██████████████████░░' },
    { t: 'response', m: '→ UI/UX Design      [80%] ████████████████░░░░' },
  ],
  values: () => [
    { t: 'response', m: '→ [1] INTEGRITY      — Jujur dalam setiap proses' },
    { t: 'response', m: '→ [2] ACCOUNTABILITY — Bertanggung jawab atas hasil' },
    { t: 'response', m: '→ [3] TRANSPARENCY   — Terbuka dan komunikatif' },
  ],
  ping: () => {
    incrementCounter('Terminal ping');
    return [{ t: 'response', m: `→ PONG! Latency: ${Math.floor(Math.random()*5+1)}ms — Node is alive.` }];
  },
  date: () => {
    const d = new Date();
    return [{ t: 'response', m: `→ ${d.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })} — ${d.toLocaleTimeString('id-ID')}` }];
  },
  projects: () => [
    { t: 'response', m: '→ [LIVE ] QuantumSphere Portal' },
    { t: 'response', m: '→ [BUILD] NeuralNote App' },
    { t: 'response', m: '→ [PLAN ] EcoTrack Dashboard' },
    { t: 'response', m: '→ [LIVE ] Horizon Landing' },
  ],
  about: () => [
    { t: 'response', m: '→ QuantumSphere Portal v2.4.0' },
    { t: 'response', m: '→ Stack: Pure HTML5 + CSS3 + Vanilla JS' },
    { t: 'response', m: '→ No frameworks. No libraries. Just raw skill.' },
    { t: 'info',     m: '→ Dibuat untuk tugas akhir Dicoding 2025.' },
  ],
  clear: () => 'CLEAR',
};

function printTerminalLines(lines) {
  lines.forEach(({ t, m }, i) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.className = `t-line ${t}`;
      p.textContent = m;
      terminalBody.appendChild(p);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }, i * 60);
  });
}

function handleTerminalCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return;

  // Echo user input
  const echo = document.createElement('p');
  echo.className = 't-line';
  echo.innerHTML = `<span class="t-prompt">$</span><span class="t-cmd"> ${escapeHtml(raw)}</span>`;
  terminalBody.appendChild(echo);

  incrementCounter(`Terminal: ${cmd}`);

  if (cmd === 'clear') {
    setTimeout(() => {
      terminalBody.innerHTML = '<p class="t-line response">→ Terminal cleared.</p>';
    }, 100);
    return;
  }

  const handler = terminalCommands[cmd];
  if (handler) {
    const result = handler();
    if (result !== 'CLEAR') printTerminalLines(result);
  } else {
    const err = document.createElement('p');
    err.className = 't-line error';
    err.textContent = `→ Command not found: '${cmd}'. Type 'help' for available commands.`;
    terminalBody.appendChild(err);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = terminalInput.value;
    terminalInput.value = '';
    handleTerminalCommand(val);
  }
});

// Focus terminal on click
document.getElementById('terminalBox').addEventListener('click', () => {
  terminalInput.focus();
});

/* ────────────────────────────────────────────────────────────
   18. AUTO ALERT — triggers after 8 seconds of inactivity
   ──────────────────────────────────────────────────────────── */
let inactivityTimer;

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    if (interactionCount === 0) {
      showToast('⟡ System idle detected. Click "Ping System Node" to activate!');
    }
  }, 8000);
}

document.addEventListener('mousemove', resetInactivityTimer, { passive: true });
document.addEventListener('keydown',   resetInactivityTimer, { passive: true });
document.addEventListener('scroll',    resetInactivityTimer, { passive: true });
document.addEventListener('touchstart',resetInactivityTimer, { passive: true });
resetInactivityTimer();

/* ────────────────────────────────────────────────────────────
   19. KEYBOARD SHORTCUT — press '/' to focus terminal
   ──────────────────────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== terminalInput) {
    e.preventDefault();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => terminalInput.focus(), 600);
    showToast('⟡ Terminal focused. Press / anytime to jump here.');
  }
  if (e.key === 'Escape') closeModal();
});

/* ────────────────────────────────────────────────────────────
   20. INIT
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setupScrollReveal();

  // Trigger stats animation immediately (hero is visible on load)
  setTimeout(() => {
    if (!statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach(el => animateCounter(el, parseInt(el.dataset.target)));
    }
  }, 800);

  // Welcome toast
  setTimeout(() => showToast('⟡ QuantumSphere Portal aktif. Selamat datang!'), 1500);

  // Tip toast
  setTimeout(() => showToast('💡 Tip: Tekan / untuk fokus ke terminal'), 6000);

  // Initial monitor animation
  setTimeout(() => {
    updateSystemMonitor();
  }, 200);

  console.log('%c QuantumSphere Portal ', 'background:#030014;color:#00F2FE;font-family:monospace;font-size:14px;padding:8px 16px;border:1px solid #00F2FE;');
  console.log('%c Author: Moh Alfan Syaifullah', 'color:#9B51E0;font-family:monospace;font-size:11px;');
  console.log('%c Course: Belajar Dasar Pemrograman Web — Dicoding', 'color:#9B51E0;font-family:monospace;font-size:11px;');
  console.log('%c Stack : Pure HTML5 · CSS3 · Vanilla JS', 'color:#9B51E0;font-family:monospace;font-size:11px;');
});
