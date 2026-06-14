/* ============================================================
   APOLOGY WEBSITE — script.js
   Handles: floating hearts, sparkles, mad-button evasion,
            forgive effects, confetti, heart bursts
   ============================================================ */

/* ── 1. Floating Hearts ─────────────────────────────────── */
(function spawnHearts() {
  const container = document.querySelector('.hearts-container');
  if (!container) return;

  const HEARTS = ['💗','💖','💕','💓','❤️','🌸','💝','💞'];

  function createHeart() {
    const el = document.createElement('span');
    el.classList.add('heart');
    el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];

    const size   = 0.9 + Math.random() * 1.4;          // rem
    const left   = Math.random() * 100;                 // %
    const dur    = 7 + Math.random() * 10;              // s
    const delay  = Math.random() * 8;                   // s

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(el);

    // Remove after animation to avoid DOM bloat
    el.addEventListener('animationend', () => el.remove());
  }

  // Spawn an initial batch, then maintain a steady stream
  for (let i = 0; i < 12; i++) createHeart();
  setInterval(createHeart, 700);
})();


/* ── 2. Sparkles ────────────────────────────────────────── */
(function spawnSparkles() {
  const container = document.querySelector('.sparkles-container');
  if (!container) return;

  function createSparkle() {
    const el = document.createElement('span');
    el.classList.add('sparkle');

    const size  = 4 + Math.random() * 8;      // px
    const top   = Math.random() * 100;
    const left  = Math.random() * 100;
    const dur   = 1.5 + Math.random() * 2.5;
    const delay = Math.random() * 4;

    el.style.cssText = `
      width: ${size}px; height: ${size}px;
      top: ${top}%; left: ${left}%;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  for (let i = 0; i < 20; i++) createSparkle();
  setInterval(createSparkle, 400);
})();


/* ── 3. "I'll Stay Mad" evasion logic ───────────────────── */
(function initMadButton() {
  const btn = document.getElementById('mad-btn');
  if (!btn) return;

  // Grab the safe viewport dimensions accounting for scroll
  function safePos(btnW, btnH) {
    const margin = 12;
    const maxX = window.innerWidth  - btnW  - margin;
    const maxY = window.innerHeight - btnH  - margin;
    const x = margin + Math.random() * maxX;
    const y = margin + Math.random() * maxY;
    return { x, y };
  }

  function moveBtn() {
    const rect = btn.getBoundingClientRect();
    const { x, y } = safePos(rect.width || 180, rect.height || 52);
    btn.style.left = x + 'px';
    btn.style.top  = y + 'px';
    // Clear any transform that might have been set previously
    btn.style.transform = 'none';
  }

  // Initialise position (slightly below center-right)
  const initRect = btn.getBoundingClientRect();
  btn.style.left = (window.innerWidth  * 0.62 - (initRect.width  || 170) / 2) + 'px';
  btn.style.top  = (window.innerHeight * 0.55 - (initRect.height || 52)  / 2) + 'px';

  // Desktop: escape on hover
  btn.addEventListener('mouseenter', moveBtn);

  // Mobile: escape on touch start
  btn.addEventListener('touchstart', function(e) {
    e.preventDefault();   // stop ghost-click and scroll
    moveBtn();
  }, { passive: false });

  // Keep button inside viewport if window is resized
  window.addEventListener('resize', () => {
    const rect = btn.getBoundingClientRect();
    let x = parseFloat(btn.style.left) || 0;
    let y = parseFloat(btn.style.top)  || 0;
    const maxX = window.innerWidth  - rect.width  - 12;
    const maxY = window.innerHeight - rect.height - 12;
    btn.style.left = Math.max(12, Math.min(x, maxX)) + 'px';
    btn.style.top  = Math.max(12, Math.min(y, maxY)) + 'px';
  });
})();


/* ── 4. Forgive Button Effects ──────────────────────────── */
(function initForgiveButton() {
  const btn     = document.getElementById('forgive-btn');
  const overlay = document.getElementById('success-overlay');
  if (!btn || !overlay) return;

  btn.addEventListener('click', function() {
    triggerHeartExplosion();
    launchConfetti();
    setTimeout(() => {
      overlay.classList.add('active');
    }, 350);
  });
})();


/* ── 5. Heart Burst Effect ──────────────────────────────── */
function triggerHeartExplosion() {
  const HEARTS = ['💗','💖','💕','💓','💝','🌸','✨','💞'];
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < 22; i++) {
    const el  = document.createElement('span');
    const angle  = (i / 22) * 360;
    const dist   = 80 + Math.random() * 160;
    const rad    = (angle * Math.PI) / 180;
    const tx     = Math.cos(rad) * dist;
    const ty     = Math.sin(rad) * dist - 40;
    const size   = 1.2 + Math.random() * 1.2;

    el.classList.add('heart-burst');
    el.textContent = HEARTS[i % HEARTS.length];
    el.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      font-size: ${size}rem;
      --tx: ${tx}px; --ty: ${ty}px;
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}


/* ── 6. Confetti ─────────────────────────────────────────── */
function launchConfetti() {
  const COLORS = [
    '#FFD6E7','#FFB26B','#FF85B3','#FF9A42',
    '#FFC4D6','#FFE0B2','#FFAECF','#FFD180'
  ];

  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const el    = document.createElement('div');
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const left  = 10 + Math.random() * 80;   // % of viewport width
      const size  = 6 + Math.random() * 10;
      const dur   = 1.8 + Math.random() * 2.2;
      const delay = Math.random() * 1.2;
      const rot   = Math.random() * 360;

      el.classList.add('confetti-piece');
      el.style.cssText = `
        left: ${left}vw;
        top: -20px;
        width: ${size}px; height: ${size}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
        transform: rotate(${rot}deg);
      `;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 18);
  }
}
