// ---------- Utilities ----------
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);

function heartPoint(theta, scale, cx, cy) {
  const x = 16 * Math.pow(Math.sin(theta), 3);
  const y = 13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta);
  return { x: cx + x * scale, y: cy - y * scale };
}

function heartCurvePoints(n, scale, cx, cy) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2;
    pts.push(heartPoint(theta, scale, cx, cy));
  }
  return pts;
}

function drawArrow(ctx, x, y, dx, dy, len, color) {
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d, uy = dy / d;
  const x2 = x + ux * len, y2 = y + uy * len;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const headLen = 6;
  const angle = Math.atan2(uy, ux);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function observeVisibility(el, onChange) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => onChange(e.isIntersecting));
  }, { threshold: 0.01 });
  io.observe(el);
}

// ---------- Scroll progress + reveal ----------
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
});

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
revealEls.forEach((el) => revealObserver.observe(el));

// ---------- Flip cards ----------
document.querySelectorAll('.flip-card').forEach((card) => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

// ================= HERO CANVAS =================
(function heroAnim() {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  let visible = true;

  function resize() {
    w = canvas.width = canvas.clientWidth;
    h = canvas.height = canvas.clientHeight;
    const cx = w / 2, cy = h / 2 + h * 0.06;
    const scale = Math.min(w, h) / 34;
    const targets = heartCurvePoints(220, scale, cx, cy);
    particles = targets.map((t) => ({
      x0: rand(0, w), y0: rand(0, h),
      x1: t.x, y1: t.y,
      hue: rand(220, 320),
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  let time = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    time += 0.006;
    const t = (Math.sin(time) + 1) / 2;
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      const x = lerp(p.x0, p.x1, t);
      const y = lerp(p.y0, p.y1, t);
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 72%, 0.55)`;
      ctx.fill();
    });
  }
  requestAnimationFrame(frame);
  observeVisibility(canvas, (v) => (visible = v));
})();

// ================= DEMO 1: noise -> heart =================
(function demo1() {
  const canvas = document.getElementById('demoCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const slider = document.getElementById('tSlider');
  const tValueEl = document.getElementById('tValue');
  const playBtn = document.getElementById('playBtn');
  const resetBtn = document.getElementById('resetBtn');
  const arrowsToggle = document.getElementById('arrowsToggle');

  const N = 180;
  let pairs = [];

  function makePairs() {
    const cx = W / 2, cy = H / 2 + 30;
    const scale = 15.5;
    const targets = heartCurvePoints(N, scale, cx, cy);
    const noises = [];
    for (let i = 0; i < N; i++) {
      noises.push({ x: rand(30, W - 30), y: rand(30, H - 30) });
    }
    const used = new Array(targets.length).fill(false);
    pairs = noises.map((n) => {
      let best = -1, bestD = Infinity;
      for (let j = 0; j < targets.length; j++) {
        if (used[j]) continue;
        const dx = n.x - targets[j].x, dy = n.y - targets[j].y;
        const d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; best = j; }
      }
      used[best] = true;
      return { x0: n.x, y0: n.y, x1: targets[best].x, y1: targets[best].y };
    });
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    // faint full paths
    ctx.strokeStyle = 'rgba(124,155,255,0.08)';
    ctx.lineWidth = 1;
    pairs.forEach((p) => {
      ctx.beginPath();
      ctx.moveTo(p.x0, p.y0);
      ctx.lineTo(p.x1, p.y1);
      ctx.stroke();
    });

    pairs.forEach((p, i) => {
      const x = lerp(p.x0, p.x1, t);
      const y = lerp(p.y0, p.y1, t);
      const r = lerp(80, 130, t), g = lerp(90, 235, t), b = lerp(150, 200, t);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r|0},${g|0},${b|0},0.85)`;
      ctx.fill();

      if (arrowsToggle.checked && i % 14 === 0) {
        drawArrow(ctx, x, y, p.x1 - p.x0, p.y1 - p.y0, 20, 'rgba(255,138,184,0.9)');
      }
    });
  }

  function setT(t) {
    slider.value = t;
    tValueEl.textContent = t.toFixed(2);
    draw(t);
  }

  let playing = false;
  function play() {
    if (playing) return;
    playing = true;
    let start = parseFloat(slider.value);
    if (start >= 0.999) start = 0;
    const duration = 2400;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min(1, (now - t0) / duration);
      const t = start + (1 - start) * p;
      setT(t);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        playing = false;
      }
    }
    requestAnimationFrame(step);
  }

  slider.addEventListener('input', () => setT(parseFloat(slider.value)));
  playBtn.addEventListener('click', play);
  resetBtn.addEventListener('click', () => {
    makePairs();
    setT(0);
  });
  arrowsToggle.addEventListener('change', () => draw(parseFloat(slider.value)));

  makePairs();
  setT(0);
})();

// ================= TRAINING LOOP DIAGRAM =================
(function loopDiagram() {
  const container = document.getElementById('loopDiagram');
  if (!container) return;
  const steps = container.querySelectorAll('.loop-step');
  let i = 0;
  let visible = true;
  setInterval(() => {
    if (!visible) return;
    steps.forEach((s) => s.classList.remove('active'));
    steps[i].classList.add('active');
    i = (i + 1) % steps.length;
  }, 550);
  observeVisibility(container, (v) => (visible = v));
})();

// ================= GENERATION FLOW DIAGRAM =================
(function genDiagram() {
  const container = document.getElementById('genDiagram');
  if (!container) return;
  const steps = container.querySelectorAll('.gen-step');
  let i = 0;
  let visible = true;
  function tick() {
    if (i >= steps.length) return;
    steps.forEach((s) => s.classList.remove('active'));
    steps[i].classList.add('active');
    i++;
    if (i === steps.length) {
      setTimeout(() => {
        steps.forEach((s) => s.classList.remove('active'));
        i = 0;
      }, 1000);
    }
  }
  setInterval(() => visible && tick(), 550);
  observeVisibility(container, (v) => (visible = v));
})();

// ================= FIELD CANVAS (ambient flow) =================
(function fieldAnim() {
  const canvas = document.getElementById('fieldCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2 + 20;
  const scale = 13.5;
  const boundary = heartCurvePoints(140, scale, cx, cy);
  let visible = true;

  function pointInHeart(x, y) {
    let inside = false;
    for (let i = 0, j = boundary.length - 1; i < boundary.length; j = i++) {
      const xi = boundary[i].x, yi = boundary[i].y;
      const xj = boundary[j].x, yj = boundary[j].y;
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // fill the heart's interior with attractor points so the field
  // converges inward instead of splitting at the outline
  const attractors = [];
  const minX = Math.min(...boundary.map((p) => p.x));
  const maxX = Math.max(...boundary.map((p) => p.x));
  const minY = Math.min(...boundary.map((p) => p.y));
  const maxY = Math.max(...boundary.map((p) => p.y));
  const stepX = (maxX - minX) / 26;
  const stepY = (maxY - minY) / 26;
  for (let x = minX; x <= maxX; x += stepX) {
    for (let y = minY; y <= maxY; y += stepY) {
      if (pointInHeart(x, y)) attractors.push({ x, y });
    }
  }

  function nearest(x, y) {
    let best = attractors[0], bestD = Infinity;
    for (const b of attractors) {
      const dx = b.x - x, dy = b.y - y;
      const d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = b; }
    }
    return best;
  }

  // static grid arrows, precomputed once
  const gridArrows = [];
  const spacing = 34;
  for (let gx = spacing / 2; gx < W; gx += spacing) {
    for (let gy = spacing / 2; gy < H; gy += spacing) {
      const target = nearest(gx, gy);
      const dx = target.x - gx, dy = target.y - gy;
      const dist = Math.hypot(dx, dy);
      if (dist < 6) continue;
      gridArrows.push({ x: gx, y: gy, dx, dy });
    }
  }

  const particles = [];
  for (let i = 0; i < 70; i++) {
    particles.push({
      x: rand(0, W), y: rand(0, H),
      speed: rand(1.2, 2.6),
      hue: rand(190, 330),
    });
  }

  function respawn(p) {
    p.x = rand(0, W);
    p.y = rand(0, H);
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;

    ctx.fillStyle = 'rgba(10,12,24,0.14)';
    ctx.fillRect(0, 0, W, H);

    ctx.beginPath();
    boundary.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,138,184,0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.globalAlpha = 1;
    gridArrows.forEach((a) => {
      drawArrow(ctx, a.x, a.y, a.dx, a.dy, 10, 'rgba(124,155,255,0.16)');
    });

    particles.forEach((p) => {
      const target = nearest(p.x, p.y);
      const dx = target.x - p.x, dy = target.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 4) {
        respawn(p);
        return;
      }
      p.x += (dx / dist) * p.speed;
      p.y += (dy / dist) * p.speed;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, 0.9)`;
      ctx.fill();
    });
  }
  requestAnimationFrame(frame);
  observeVisibility(canvas, (v) => (visible = v));
})();

// ================= MINI COMPARISON CANVASES =================
(function flowVsDiffusion() {
  const flowCanvas = document.getElementById('flowMiniCanvas');
  const diffCanvas = document.getElementById('diffMiniCanvas');
  const fctx = flowCanvas.getContext('2d');
  const dctx = diffCanvas.getContext('2d');
  const W = flowCanvas.width, H = flowCanvas.height;
  const startPt = { x: 40, y: H / 2 };
  const endPt = { x: W - 40, y: H / 2 };
  let visible = true;

  function makeNoisyPath(steps) {
    const path = [{ x: startPt.x, y: startPt.y }];
    for (let i = 1; i < steps; i++) {
      const p = i / steps;
      let x = lerp(startPt.x, endPt.x, p);
      let y = lerp(startPt.y, endPt.y, p);
      const noiseScale = 46 * (1 - p) + 6;
      x += rand(-1, 1) * noiseScale * 0.5;
      y += rand(-1, 1) * noiseScale;
      path.push({ x, y });
    }
    path.push({ x: endPt.x, y: endPt.y });
    return path;
  }
  let noisyPath = makeNoisyPath(42);

  function drawBase(ctx, ticks) {
    ctx.clearRect(0, 0, W, H);
    ticks.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168,173,201,0.35)';
      ctx.fill();
    });
    [startPt, endPt].forEach((pt, i) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#7c9bff' : '#6ee7c8';
      ctx.fill();
    });
  }

  const flowTicks = [0, 0.33, 0.66, 1].map((p) => ({ x: lerp(startPt.x, endPt.x, p), y: lerp(startPt.y, endPt.y, p) }));

  let clock = 0;
  const cycleMs = 2600;
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const p = (now % cycleMs) / cycleMs;

    // Flow (straight)
    drawBase(fctx, flowTicks);
    const fx = lerp(startPt.x, endPt.x, p);
    const fy = lerp(startPt.y, endPt.y, p);
    fctx.beginPath();
    fctx.arc(fx, fy, 6, 0, Math.PI * 2);
    fctx.fillStyle = '#ff8ab8';
    fctx.fill();

    // Diffusion (noisy path)
    if (p < 0.01) noisyPath = makeNoisyPath(42);
    drawBase(dctx, noisyPath);
    const idx = Math.min(noisyPath.length - 1, Math.floor(p * noisyPath.length));
    const dp = noisyPath[idx];
    dctx.beginPath();
    dctx.arc(dp.x, dp.y, 6, 0, Math.PI * 2);
    dctx.fillStyle = '#ff8ab8';
    dctx.fill();
  }
  requestAnimationFrame(frame);
  observeVisibility(flowCanvas, (v) => (visible = v));
})();
