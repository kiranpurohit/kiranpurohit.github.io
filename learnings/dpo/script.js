// ---------- Utilities ----------
const $ = (id) => document.getElementById(id);
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sigmoid = (z) => 1 / (1 + Math.exp(-z));
const softplus = (z) => (z > 30 ? z : Math.log1p(Math.exp(z)));
const LN2 = Math.log(2);
const fmtSigned = (v, d = 2) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(d);
const fmtNum = (v) => (v >= 100 ? v.toFixed(0) : String(Number(v.toPrecision(v >= 1 ? 3 : 2))));

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rng) {
  let u = 0;
  while (u === 0) u = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

function observeVisibility(el, onChange) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => onChange(e.isIntersecting));
  }, { threshold: 0.01 });
  io.observe(el);
}

// ---------- Math rendering ----------
if (window.renderMathInElement) {
  renderMathInElement(document.body, {
    delimiters: [
      { left: '\\[', right: '\\]', display: true },
      { left: '\\(', right: '\\)', display: false },
    ],
    throwOnError: false,
  });
}

// ---------- Scroll progress + reveal ----------
const progressBar = $('progressBar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  progressBar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

document.querySelectorAll('.flip-card').forEach((card) => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

observeVisibility($('castGrid'), (v) => v && $('castGrid').classList.add('in'));

// ---------- Procedural "photo" vs "AI-look" scene ----------
function drawScene(canvas, style) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const W = canvas.width, H = canvas.height;
  const nat = style === 'natural';

  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.62);
  if (nat) {
    sky.addColorStop(0, '#7f9cb8');
    sky.addColorStop(1, '#dcd8cc');
  } else {
    sky.addColorStop(0, '#ff2bd6');
    sky.addColorStop(0.55, '#8a4dff');
    sky.addColorStop(1, '#25e0ff');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  const sx = W * 0.72, sy = H * 0.27, sr = H * 0.09;
  const gr = sr * (nat ? 2.4 : 4.6);
  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, gr);
  if (nat) {
    glow.addColorStop(0, 'rgba(255,246,222,0.95)');
    glow.addColorStop(0.3, 'rgba(255,240,215,0.45)');
    glow.addColorStop(1, 'rgba(255,240,215,0)');
  } else {
    glow.addColorStop(0, 'rgba(255,255,170,1)');
    glow.addColorStop(0.25, 'rgba(255,214,60,0.95)');
    glow.addColorStop(1, 'rgba(255,120,200,0)');
  }
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sx, sy, gr, 0, Math.PI * 2);
  ctx.fill();

  function vGrad(y0, y1, c0, c1) {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, c0);
    g.addColorStop(1, c1);
    return g;
  }

  function ridge(baseY, amp, f, phase, fill) {
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 1) {
      const s = x / W;
      const y = baseY - amp * (0.55 * Math.sin(s * f + phase) + 0.3 * Math.sin(s * f * 2.3 + phase * 1.7) + 0.15 * Math.sin(s * f * 5.1 + phase * 0.6));
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  ridge(H * 0.5, H * 0.13, 7.7, 1.2, nat ? vGrad(H * 0.3, H * 0.65, '#8a97a3', '#6f7d87') : vGrad(H * 0.3, H * 0.65, '#00ffc8', '#0077ff'));
  ridge(H * 0.66, H * 0.08, 5.3, 4.0, nat ? vGrad(H * 0.55, H * 0.8, '#5c6a44', '#3f4a30') : vGrad(H * 0.55, H * 0.8, '#7dff2b', '#00c853'));

  ctx.fillStyle = nat ? vGrad(H * 0.74, H, '#6f8290', '#46555e') : vGrad(H * 0.74, H, '#00f0ff', '#007bff');
  ctx.fillRect(0, H * 0.74, W, H * 0.26);

  ctx.fillStyle = nat ? 'rgba(255,240,215,0.28)' : 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 6; i++) {
    const y = H * (0.77 + i * 0.035);
    const half = W * (nat ? 0.05 : 0.07) * (1 - i * 0.12);
    ctx.fillRect(sx - half, y, half * 2, nat ? 1.2 : 2);
  }

  function pine(x, baseY, h) {
    ctx.fillStyle = nat ? '#26321f' : '#00ff6a';
    for (let k = 0; k < 3; k++) {
      const top = baseY - h + k * h * 0.25;
      const wdt = h * (0.22 + k * 0.1);
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x - wdt, top + h * 0.45);
      ctx.lineTo(x + wdt, top + h * 0.45);
      ctx.closePath();
      ctx.fill();
    }
    if (!nat) {
      ctx.strokeStyle = 'rgba(230,255,120,0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, baseY - h);
      ctx.lineTo(x + h * 0.22, baseY - h * 0.55);
      ctx.stroke();
    }
  }
  [[0.1, 0.36], [0.16, 0.28], [0.22, 0.32], [0.86, 0.3], [0.92, 0.36]].forEach(([fx, fh]) => pine(W * fx, H * 0.76, H * fh));

  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  const rng = mulberry32(nat ? 11 : 12);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (nat) {
        const grain = gaussian(rng) * 7;
        const vx = x / W - 0.5, vy = y / H - 0.5;
        const vig = 1 - 0.35 * (vx * vx + vy * vy);
        for (let c = 0; c < 3; c++) d[i + c] = clamp((d[i + c] + grain) * vig, 0, 255);
      } else {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const m = (r + g + b) / 3;
        d[i] = clamp(m + (r - m) * 1.35 + 8, 0, 255);
        d[i + 1] = clamp(m + (g - m) * 1.35 + 8, 0, 255);
        d[i + 2] = clamp(m + (b - m) * 1.35 + 8, 0, 255);
      }
    }
  }
  ctx.putImageData(img, 0, 0);

  if (!nat) {
    const srng = mulberry32(5);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    for (let k = 0; k < 9; k++) {
      const x = srng() * W, y = srng() * H * 0.45, s = 2 + srng() * 3;
      ctx.beginPath();
      ctx.moveTo(x, y - s * 2); ctx.lineTo(x + s * 0.5, y); ctx.lineTo(x, y + s * 2); ctx.lineTo(x - s * 0.5, y);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - s * 2, y); ctx.lineTo(x, y + s * 0.5); ctx.lineTo(x + s * 2, y); ctx.lineTo(x, y - s * 0.5);
      ctx.closePath(); ctx.fill();
    }
  }
}

// Read a canvas into a Float32Array of RGB values scaled to [-1, 1].
function canvasToSigned(canvas) {
  const W = canvas.width, H = canvas.height, N = W * H;
  const d = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, W, H).data;
  const out = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) for (let c = 0; c < 3; c++) out[i * 3 + c] = d[i * 4 + c] / 127.5 - 1;
  return out;
}

// Paint a per-pixel RGB function onto a canvas.
function paint(canvas, fn) {
  const W = canvas.width, H = canvas.height, N = W * H;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(W, H);
  const rgb = [0, 0, 0];
  for (let i = 0; i < N; i++) {
    fn(i, rgb);
    img.data[i * 4] = clamp(rgb[0], 0, 255);
    img.data[i * 4 + 1] = clamp(rgb[1], 0, 255);
    img.data[i * 4 + 2] = clamp(rgb[2], 0, 255);
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}

// ================= HERO =================
(function heroAnim() {
  const canvas = $('heroCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, parts = [], good, bad;
  let visible = true;

  function resize() {
    w = canvas.width = canvas.clientWidth;
    h = canvas.height = canvas.clientHeight;
    good = { x: w * 0.76, y: h * 0.56 };
    bad = { x: w * 0.24, y: h * 0.56 };
    const r0 = Math.min(w, h) * 0.2;
    parts = Array.from({ length: 260 }, () => {
      const side = Math.random() < 0.5 ? bad : good;
      const a = rand(0, Math.PI * 2), rr = r0 * Math.sqrt(Math.random());
      const a2 = rand(0, Math.PI * 2), rr2 = r0 * 0.7 * Math.sqrt(Math.random());
      return {
        x0: side.x + Math.cos(a) * rr * 1.2, y0: side.y + Math.sin(a) * rr,
        x1: good.x + Math.cos(a2) * rr2 * 1.1, y1: good.y + Math.sin(a2) * rr2,
        delay: rand(0, 0.3),
      };
    });
  }
  window.addEventListener('resize', resize);
  resize();

  function zone(p, color, label) {
    const R = Math.min(w, h) * 0.3;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
    g.addColorStop(0, color.replace('A', '0.16'));
    g.addColorStop(1, color.replace('A', '0'));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `${Math.round(Math.min(w, h) * 0.05)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.7;
    ctx.fillText(label, p.x, p.y + R);
    ctx.globalAlpha = 1;
  }

  let time = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    time += 0.006;
    const t = (Math.sin(time - Math.PI / 2) + 1) / 2;
    ctx.clearRect(0, 0, w, h);
    zone(bad, 'rgba(255,138,184,A)', '👎');
    zone(good, 'rgba(110,231,200,A)', '👍');
    parts.forEach((p) => {
      const tt = clamp((t - p.delay) / 0.7, 0, 1);
      const e = tt * tt * (3 - 2 * tt);
      const x = lerp(p.x0, p.x1, e), y = lerp(p.y0, p.y1, e);
      const f = clamp((x - bad.x) / (good.x - bad.x), 0, 1);
      ctx.beginPath();
      ctx.arc(x, y, 1.9, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${lerp(335, 165, f)}, 85%, 72%, 0.6)`;
      ctx.fill();
    });
  }
  requestAnimationFrame(frame);
  observeVisibility(canvas, (v) => (visible = v));
})();

// ================= PREFERENCE PAIR =================
(function pairDemo() {
  const respA = $('respA'), respB = $('respB');
  const badgeA = $('respABadge'), badgeB = $('respBBadge');
  const judge = $('judge'), judgeText = $('judgeText');
  const caption = $('pairCaption');
  let timers = [];

  $('pairPrompt').textContent = 'A calm lake at sunset with pine trees and mountains, natural photo.';
  [['respABody', 'plastic'], ['respBBody', 'natural']].forEach(([id, style]) => {
    const c = document.createElement('canvas');
    c.width = 300; c.height = 200;
    $(id).appendChild(c);
    drawScene(c, style);
  });

  function run() {
    timers.forEach(clearTimeout);
    timers = [];
    [respA, respB].forEach((r) => r.classList.remove('chosen', 'rejected'));
    badgeA.textContent = 'Image A';
    badgeB.textContent = 'Image B';
    judge.classList.remove('thinking');
    judgeText.textContent = 'which is better?';
    caption.innerHTML = '&nbsp;';
    timers.push(setTimeout(() => {
      judge.classList.add('thinking');
      judgeText.textContent = 'hmm…';
    }, 900));
    timers.push(setTimeout(() => {
      judge.classList.remove('thinking');
      respB.classList.add('chosen');
      respA.classList.add('rejected');
      badgeB.innerHTML = '👍 winner · x<sup>w</sup>';
      badgeA.innerHTML = '👎 loser · x<sup>l</sup>';
      judgeText.textContent = 'B ≻ A';
      caption.innerHTML = 'Same caption, two images. The natural photo B becomes the <b>winner</b> x<sup>w</sup>, and the plastic, over-saturated A becomes the <b>loser</b> x<sup>l</sup>. A training set is thousands of such pairs.';
    }, 2600));
  }
  $('pairReplay').addEventListener('click', run);
  let started = false;
  observeVisibility($('pairDemo'), (v) => {
    if (v && !started) { started = true; run(); }
  });
})();

// ================= 1. PER-IMAGE DIFFUSION LOSS =================
(function flowLossDemo() {
  const x0Canvas = $('flX0');
  const W = x0Canvas.width, H = x0Canvas.height, N = W * H;
  drawScene(x0Canvas, 'natural');
  const x0 = canvasToSigned(x0Canvas);
  const eps = new Float32Array(N * 3);
  const eta = new Float32Array(N * 3);
  let seed = 7;

  function makeNoise() {
    const rng = mulberry32(seed++);
    for (let i = 0; i < eps.length; i++) eps[i] = gaussian(rng);
    // Smooth, blotchy "model mistakes": low-res noise, bilinearly upsampled, unit variance.
    const gw = Math.ceil(W / 10) + 1, gh = Math.ceil(H / 10) + 1;
    const grid = new Float32Array(gw * gh * 3);
    for (let i = 0; i < grid.length; i++) grid[i] = gaussian(rng);
    let sq = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const gx = x / 10, gy = y / 10;
        const ix = Math.floor(gx), iy = Math.floor(gy), fx = gx - ix, fy = gy - iy;
        for (let c = 0; c < 3; c++) {
          const g = (xx, yy) => grid[(yy * gw + xx) * 3 + c];
          const v = lerp(lerp(g(ix, iy), g(ix + 1, iy), fx), lerp(g(ix, iy + 1), g(ix + 1, iy + 1), fx), fy);
          eta[(y * W + x) * 3 + c] = v;
          sq += v * v;
        }
      }
    }
    const norm = Math.sqrt(sq / eta.length);
    for (let i = 0; i < eta.length; i++) eta[i] /= norm;
  }

  function render() {
    const t = parseFloat($('flT').value);
    const q = parseFloat($('flQ').value);
    $('flTVal').textContent = t.toFixed(2);
    $('flQVal').textContent = q.toFixed(2);
    const show = (v) => 127.5 + v * 45;
    paint($('flEps'), (i, o) => { for (let c = 0; c < 3; c++) o[c] = 127.5 + eps[i * 3 + c] * 50; });
    paint($('flXt'), (i, o) => { for (let c = 0; c < 3; c++) o[c] = ((1 - t) * x0[i * 3 + c] + t * eps[i * 3 + c] + 1) * 127.5; });
    paint($('flV'), (i, o) => { for (let c = 0; c < 3; c++) o[c] = show(x0[i * 3 + c] - eps[i * 3 + c]); });
    paint($('flPred'), (i, o) => { for (let c = 0; c < 3; c++) o[c] = show(x0[i * 3 + c] - eps[i * 3 + c] + q * eta[i * 3 + c]); });
    let total = 0;
    paint($('flErr'), (i, o) => {
      let e = 0;
      for (let c = 0; c < 3; c++) {
        const d = q * eta[i * 3 + c];
        e += d * d;
      }
      total += e;
      const m = Math.min(1, e / 3 / 0.6);
      o[0] = 255 * m; o[1] = 138 * m; o[2] = 184 * m;
    });
    $('flLoss').textContent = (total / (N * 3)).toFixed(3);
  }

  $('flT').addEventListener('input', render);
  $('flQ').addEventListener('input', render);
  $('flNoise').addEventListener('click', () => { makeNoise(); render(); });
  makeNoise();
  render();
})();

// ================= 1b. LOGIT-NORMAL t SAMPLING =================
(function tSamplingDemo() {
  const canvas = $('tCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const L = 44, R = 16, T = 16, B = 34;
  const BINS = 40, MAX_SAMPLES = 4000;
  const slider = $('shiftSlider');
  const X = (t) => L + t * (W - L - R);
  let counts, total, dots, yMax, shift, visible = false;

  const baseDensity = (t) => {
    if (t <= 0 || t >= 1) return 0;
    const lg = Math.log(t / (1 - t));
    return Math.exp(-0.5 * lg * lg) / (Math.sqrt(2 * Math.PI) * t * (1 - t));
  };
  // Density of t' = s·t / (1 + (s − 1)·t) by change of variables.
  const density = (tp) => {
    const den = shift - (shift - 1) * tp;
    return baseDensity(tp / den) * (shift / (den * den));
  };
  const sample = () => {
    const t = sigmoid(gaussian(Math.random));
    return (shift * t) / (1 + (shift - 1) * t);
  };

  function reset() {
    shift = parseFloat(slider.value);
    $('shiftVal').textContent = shift.toFixed(1);
    counts = new Array(BINS).fill(0);
    total = 0;
    dots = [];
    let m = 0;
    for (let i = 1; i < 400; i++) m = Math.max(m, density(i / 400));
    yMax = m * 1.25;
  }

  const Y = (d) => T + (1 - d / yMax) * (H - T - B);
  const binDensity = (k) => (total ? counts[k] / (total / BINS) : 0);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#a8adc9';
    ctx.textAlign = 'center';
    [0, 0.25, 0.5, 0.75, 1].forEach((t) => ctx.fillText(t, X(t), H - B + 18));
    ctx.fillText('t  (0 = clean image, 1 = pure noise)', (L + W - R) / 2, H - 4);

    const bw = (W - L - R) / BINS;
    for (let k = 0; k < BINS; k++) {
      const d = binDensity(k);
      if (!d) continue;
      const g = ctx.createLinearGradient(0, Y(d), 0, Y(0));
      g.addColorStop(0, 'rgba(255,138,184,0.85)');
      g.addColorStop(1, 'rgba(124,155,255,0.55)');
      ctx.fillStyle = g;
      ctx.fillRect(L + k * bw + 1, Y(d), bw - 2, Y(0) - Y(d));
    }

    ctx.strokeStyle = '#6ee7c8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 1; i < 300; i++) {
      const t = i / 300;
      const y = Y(density(t));
      i === 1 ? ctx.moveTo(X(t), y) : ctx.lineTo(X(t), y);
    }
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    dots.forEach((d) => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a8adc9';
    ctx.fillText(`samples: ${total}`, L + 6, T + 12);
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    if (total + dots.length < MAX_SAMPLES) {
      for (let s = 0; s < 6; s++) {
        const t = sample();
        const k = Math.min(BINS - 1, Math.floor(t * BINS));
        dots.push({ x: X(t), y: T, vy: rand(0, 2), k });
      }
    }
    dots = dots.filter((d) => {
      d.vy += 0.6;
      d.y += d.vy;
      if (d.y >= Y(binDensity(d.k))) {
        counts[d.k]++;
        total++;
        return false;
      }
      return true;
    });
    draw();
  }

  slider.addEventListener('input', reset);
  $('tReset').addEventListener('click', reset);
  observeVisibility(canvas, (v) => (visible = v));
  reset();
  draw();
  requestAnimationFrame(frame);
})();

// ================= 2. SHARED NOISE STEP-THROUGH =================
(function sharedNoiseDemo() {
  const root = $('diffDemo');
  const winClean = $('winClean'), loseClean = $('loseClean');
  const W = winClean.width, H = winClean.height, N = W * H;
  const tSlider = $('tSlider');

  drawScene(winClean, 'natural');
  drawScene(loseClean, 'plastic');
  const x0w = canvasToSigned(winClean), x0l = canvasToSigned(loseClean);

  const rng = mulberry32(42);
  const eps = new Float32Array(N * 3);
  for (let i = 0; i < eps.length; i++) eps[i] = gaussian(rng);
  [$('noiseW'), $('noiseL')].forEach((cv) => paint(cv, (i, o) => {
    for (let c = 0; c < 3; c++) o[c] = 127.5 + eps[i * 3 + c] * 50;
  }));

  function renderNoisy() {
    const t = parseFloat(tSlider.value);
    [[x0w, $('winNoisy')], [x0l, $('loseNoisy')]].forEach(([x0, cv]) => paint(cv, (i, o) => {
      for (let c = 0; c < 3; c++) o[c] = ((1 - t) * x0[i * 3 + c] + t * eps[i * 3 + c] + 1) * 127.5;
    }));
    $('tVal').textContent = t.toFixed(2);
  }

  const texts = [
    '① Take one pair: the same caption <i>c</i>, a 👍 winner <i>x<sup>w</sup></i> and a 👎 loser <i>x<sup>l</sup></i>.',
    '② Draw <b>one</b> noise pattern ε and <b>one</b> time <i>t</i> for this pair, and use them for <b>both</b> images.',
    '③ Noise both: <i>x<sub>t</sub></i> = (1 − <i>t</i>)·<i>x</i><sub>0</sub> + <i>t</i>·ε. They are corrupted in exactly the same way. Try the slider!',
    '④ The student tries to predict the velocity for both noisy images. Its per-image losses are <i>L</i><sup>θ</sup><sub>w</sub> = 0.30 and <i>L</i><sup>θ</sup><sub>l</sub> = 0.50 (example numbers, partway through training).',
    '⑤ The frozen reference does the same job on the <b>same</b> inputs, with the same <i>t</i> and ε and no gradients: 0.40 and 0.40.',
    '⑥ That\'s it: <b>four numbers per pair</b>. Everything DPO does next is arithmetic on these four.',
  ];
  const last = texts.length - 1;
  const dots = $('stageDots');
  texts.forEach(() => dots.appendChild(document.createElement('span')));
  const staged = root.querySelectorAll('[data-stage]');
  let stage = 0;

  function setStage(s) {
    stage = clamp(s, 0, last);
    staged.forEach((el) => el.classList.toggle('hidden-stage', stage < Number(el.dataset.stage)));
    dots.querySelectorAll('span').forEach((d, i) => d.classList.toggle('on', i <= stage));
    $('stageText').innerHTML = texts[stage];
  }

  let auto = null;
  function stopAuto() {
    if (auto) clearInterval(auto);
    auto = null;
    $('diffAuto').textContent = '▶ Auto-play';
  }
  $('diffNext').addEventListener('click', () => { stopAuto(); setStage(stage + 1); });
  $('diffPrev').addEventListener('click', () => { stopAuto(); setStage(stage - 1); });
  $('diffAuto').addEventListener('click', () => {
    if (auto) return stopAuto();
    $('diffAuto').textContent = '⏸ Pause';
    if (stage === last) setStage(0);
    auto = setInterval(() => (stage === last ? stopAuto() : setStage(stage + 1)), 2800);
  });
  tSlider.addEventListener('input', renderNoisy);
  renderNoisy();
  setStage(0);
})();

// ================= 3. REWARD AND MARGIN =================
(function rewardDemo() {
  const canvas = $('rewardCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const ids = ['lws', 'lwr', 'lls', 'llr'];
  const get = (id) => parseFloat($(id).value);
  const set = (id, v) => { $(id).value = v; };
  const BX = 150, BW = 380;
  const BXv = (v) => BX + v * BW;

  function row(y, label, color, student, ref, r, goodWhenNegative) {
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = color;
    ctx.fillText(label, 12, y + 30);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#a8adc9';
    ctx.textAlign = 'right';
    ctx.fillText('reference', BX - 8, y + 15);
    ctx.fillText('student', BX - 8, y + 47);

    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = 'rgba(232,233,245,0.8)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(BX, y + 2, BXv(ref) - BX, 18);
    ctx.setLineDash([]);

    const g = ctx.createLinearGradient(BX, 0, BXv(student), 0);
    g.addColorStop(0, '#7c9bff');
    g.addColorStop(1, color);
    ctx.fillStyle = g;
    ctx.fillRect(BX, y + 34, BXv(student) - BX, 18);

    const good = goodWhenNegative ? r < 0 : r > 0;
    const tone = Math.abs(r) < 0.005 ? '#a8adc9' : good ? '#6ee7c8' : '#ff8ab8';
    const xa = BXv(ref), xb = BXv(student);
    ctx.fillStyle = tone === '#6ee7c8' ? 'rgba(110,231,200,0.2)' : tone === '#ff8ab8' ? 'rgba(255,138,184,0.2)' : 'rgba(168,173,201,0.15)';
    ctx.fillRect(Math.min(xa, xb), y, Math.abs(xb - xa), 56);
    ctx.strokeStyle = tone;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(xa, y - 2); ctx.lineTo(xa, y + 58); ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = tone;
    ctx.font = 'bold 14px sans-serif';
    const name = goodWhenNegative ? 'r_w' : 'r_l';
    ctx.fillText(`${name} = ${fmtSigned(r)}`, BX + BW + 24, y + 26);
    ctx.font = '12px sans-serif';
    const msg = Math.abs(r) < 0.005 ? 'same as reference'
      : goodWhenNegative ? (r < 0 ? 'better than ref ✓' : 'worse than ref ✗')
      : (r > 0 ? 'worse than ref ✓' : 'better than ref ✗');
    ctx.fillText(msg, BX + BW + 24, y + 46);
  }

  function draw() {
    const [lws, lwr, lls, llr] = ids.map(get);
    ids.forEach((id) => { $(id + 'Val').textContent = get(id).toFixed(2); });
    const rw = lws - lwr, rl = lls - llr, d = rw - rl;
    ctx.clearRect(0, 0, W, H);
    row(18, '👍 winner', '#6ee7c8', lws, lwr, rw, true);
    row(104, '👎 loser', '#ff8ab8', lls, llr, rl, false);

    const y = 236, x0 = 150, x1 = W - 30;
    const Xd = (v) => x0 + ((clamp(v, -1, 1) + 1) / 2) * (x1 - x0);
    ctx.fillStyle = 'rgba(110,231,200,0.12)';
    ctx.fillRect(x0, y - 18, Xd(0) - x0, 36);
    ctx.fillStyle = 'rgba(255,138,184,0.12)';
    ctx.fillRect(Xd(0), y - 18, x1 - Xd(0), 36);
    ctx.strokeStyle = 'rgba(232,233,245,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#a8adc9';
    ctx.textAlign = 'center';
    [-1, -0.5, 0, 0.5, 1].forEach((v) => {
      ctx.beginPath(); ctx.moveTo(Xd(v), y - 5); ctx.lineTo(Xd(v), y + 5); ctx.stroke();
      ctx.fillText(v, Xd(v), y + 32);
    });
    ctx.fillStyle = '#6ee7c8';
    ctx.textAlign = 'left';
    ctx.fillText('← good: Δ < 0', x0 + 6, y - 24);
    ctx.fillStyle = '#ff8ab8';
    ctx.textAlign = 'right';
    ctx.fillText('bad: Δ > 0 →', x1 - 6, y - 24);
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e8e9f5';
    ctx.fillText('margin Δ', 12, y + 5);

    const col = Math.abs(d) < 0.01 ? '#a8adc9' : d < 0 ? '#6ee7c8' : '#ff8ab8';
    ctx.beginPath();
    ctx.arc(Xd(d), y, 9, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.strokeStyle = '#0b0d17';
    ctx.lineWidth = 2;
    ctx.stroke();

    $('rwVal').textContent = fmtSigned(rw);
    $('rlVal').textContent = fmtSigned(rl);
    $('dVal').textContent = fmtSigned(d);
    $('rwCaption').textContent = Math.abs(d) < 0.01
      ? '➖ Δ ≈ 0: nothing learned yet. This is step 0, when the student is still identical to the reference.'
      : d < 0
        ? '✅ Δ is negative: relative to the reference, the student got better on 👍 and/or worse on 👎. That is exactly the goal.'
        : '❌ Δ is positive: relative to the reference, the student now favors 👎. The loss in section 4 will push hard to fix this.';
  }

  function toStart() {
    set('lws', get('lwr'));
    set('lls', get('llr'));
  }

  let anim = null;
  $('rwPlay').addEventListener('click', () => {
    if (anim) cancelAnimationFrame(anim);
    toStart();
    const w0 = get('lwr'), l0 = get('llr');
    const t0 = performance.now();
    function step(now) {
      const p = clamp((now - t0) / 3000, 0, 1);
      const e = 1 - Math.pow(1 - p, 3);
      set('lws', clamp(w0 - 0.12 * e, 0.05, 1));
      set('lls', clamp(l0 + 0.3 * e, 0.05, 1));
      draw();
      anim = p < 1 ? requestAnimationFrame(step) : null;
    }
    anim = requestAnimationFrame(step);
  });
  $('rwStart').addEventListener('click', () => {
    if (anim) cancelAnimationFrame(anim);
    anim = null;
    toStart();
    draw();
  });
  ids.forEach((id) => $(id).addEventListener('input', () => {
    if (anim) { cancelAnimationFrame(anim); anim = null; }
    draw();
  }));
  draw();
})();

// ================= 4. THE LOSS =================
(function lossDemo() {
  const canvas = $('lossCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const L = 50, R = 20, T = 20, B = 44;
  const xMin = -1.5, xMax = 1.5, yMax = 3.5;
  const dSlider = $('lossD'), bSlider = $('lossB');
  const X = (d) => L + ((d - xMin) / (xMax - xMin)) * (W - L - R);
  const Y = (v) => T + (1 - v / yMax) * (H - T - B);
  const beta = () => {
    const s = parseFloat(bSlider.value);
    return s === 0 ? 0 : Math.pow(10, -2 + (3 * s) / 100);
  };

  function draw() {
    const b = beta(), d = parseFloat(dSlider.value);
    const loss = softplus(b * d), slope = b * sigmoid(b * d);
    $('lossBVal').textContent = b === 0 ? '0' : b < 1 ? b.toFixed(2) : b.toFixed(1);
    $('lossDVal').textContent = fmtSigned(d);
    $('lossVal').textContent = loss.toFixed(3);
    $('slopeVal').textContent = slope.toFixed(3);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(110,231,200,0.06)';
    ctx.fillRect(L, T, X(0) - L, H - T - B);
    ctx.fillStyle = 'rgba(255,138,184,0.06)';
    ctx.fillRect(X(0), T, W - R - X(0), H - T - B);

    ctx.font = '12px sans-serif';
    ctx.strokeStyle = 'rgba(168,173,201,0.2)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#a8adc9';
    ctx.textAlign = 'right';
    for (let v = 0; v <= 3; v++) {
      ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - R, Y(v)); ctx.stroke();
      ctx.fillText(v, L - 8, Y(v) + 4);
    }
    ctx.textAlign = 'center';
    [-1.5, -1, -0.5, 0, 0.5, 1, 1.5].forEach((v) => ctx.fillText(v, X(v), H - B + 18));
    ctx.fillText('margin Δ', (L + W - R) / 2, H - 6);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#6ee7c8';
    ctx.fillText('← good (Δ < 0)', L + 8, T + 16);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ff8ab8';
    ctx.fillText('bad (Δ > 0) →', W - R - 8, T + 16);

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(124,155,255,0.7)';
    ctx.beginPath(); ctx.moveTo(L, Y(LN2)); ctx.lineTo(W - R, Y(LN2)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#7c9bff';
    ctx.textAlign = 'left';
    ctx.fillText('ln 2 ≈ 0.693 (step 0)', X(-1.45), Y(LN2) - 6);

    ctx.save();
    ctx.beginPath();
    ctx.rect(L, T, W - L - R, H - T - B);
    ctx.clip();
    ctx.strokeStyle = '#ff8ab8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = L; px <= W - R; px++) {
      const dd = xMin + ((px - L) / (W - L - R)) * (xMax - xMin);
      const y = Y(Math.min(softplus(b * dd), yMax * 2));
      px === L ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
    }
    ctx.stroke();

    // Tangent: its slope is the push strength w.
    const span = 0.35;
    ctx.strokeStyle = '#6ee7c8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(X(d - span), Y(loss - slope * span));
    ctx.lineTo(X(d + span), Y(loss + slope * span));
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(X(d), Y(Math.min(loss, yMax)), 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ff8ab8';
    ctx.fill();
    ctx.strokeStyle = '#0b0d17';
    ctx.lineWidth = 2;
    ctx.stroke();

    const bd = b * d;
    $('lossCaption').textContent = b === 0
      ? '🧊 β = 0: the curve is a flat line at ln 2. Its slope is 0, so there is no gradient and nothing is learned.'
      : bd > 1
        ? '❌ Δ > 0: relative to the reference, the student prefers 👎. The loss is high and the slope (teal tangent) is steep, so training pushes hard.'
        : bd >= -1
          ? '➖ Near Δ = 0, where every run starts: the loss is about ln 2 = 0.693 and the slope is about β/2.'
          : '✅ Δ is well below 0: the preference is learned. The curve flattens toward 0, the slope fades, and so does the push.';
  }

  let anim = null;
  $('lossPlay').addEventListener('click', () => {
    if (anim) cancelAnimationFrame(anim);
    let d = 1.0;
    let last = performance.now();
    const t0 = last;
    function step(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const b = beta();
      d -= (b > 0 ? 0.9 * sigmoid(b * d) : 0) * dt;
      dSlider.value = Math.max(d, xMin);
      draw();
      anim = now - t0 < 6000 && d > xMin ? requestAnimationFrame(step) : null;
    }
    anim = requestAnimationFrame(step);
  });
  dSlider.addEventListener('input', () => {
    if (anim) { cancelAnimationFrame(anim); anim = null; }
    draw();
  });
  bSlider.addEventListener('input', draw);
  draw();
})();

// ================= 5. DERIVATION STEPPER =================
(function deriveStepper() {
  const lines = document.querySelectorAll('#deriveSteps .derive-line');
  const last = lines.length - 1;
  let k = 0, auto = null;

  function show(n) {
    k = clamp(n, 0, last);
    lines.forEach((el, i) => {
      el.classList.toggle('shown', i <= k);
      el.classList.toggle('current', i === k);
    });
  }
  function stopAuto() {
    if (auto) clearInterval(auto);
    auto = null;
    $('drvAuto').textContent = '▶ Auto-play';
  }
  $('drvNext').addEventListener('click', () => { stopAuto(); show(k + 1); });
  $('drvPrev').addEventListener('click', () => { stopAuto(); show(k - 1); });
  $('drvAuto').addEventListener('click', () => {
    if (auto) return stopAuto();
    $('drvAuto').textContent = '⏸ Pause';
    if (k === last) show(0);
    auto = setInterval(() => (k === last ? stopAuto() : show(k + 1)), 2600);
  });
  show(0);
})();

// ================= 6. GRADIENT AND β =================
(function gradientDemo() {
  const canvas = $('gradCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const L = 62, R = 20, T = 20, B = 46;
  const lxMin = -3, lxMax = 4, lyMin = -6, lyMax = 1;
  const bSlider = $('gB'), dSlider = $('gD');
  const X = (lx) => L + ((lx - lxMin) / (lxMax - lxMin)) * (W - L - R);
  const Y = (ly) => T + (1 - (clamp(ly, lyMin - 0.5, lyMax) - lyMin) / (lyMax - lyMin)) * (H - T - B);
  // log10 of w = β·σ(−β|Δ|), computed stably.
  const logW = (b, lx) => Math.log10(b) - softplus(b * Math.pow(10, lx)) / Math.LN10;
  const tick = (p) => (p >= 3 ? Math.pow(10, p - 3) + 'k' : p >= 0 ? String(Math.pow(10, p)) : p >= -3 ? Math.pow(10, p).toFixed(-p) : '1e' + p);

  function curve(b, color, width) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(L, T, W - L - R, H - T - B);
    ctx.clip();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    let started = false;
    for (let px = L; px <= W - R; px++) {
      const lx = lxMin + ((px - L) / (W - L - R)) * (lxMax - lxMin);
      const ly = logW(b, lx);
      if (ly < lyMin - 0.5) break;
      started ? ctx.lineTo(px, Y(ly)) : ctx.moveTo(px, Y(ly));
      started = true;
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    const b = Math.pow(10, parseFloat(bSlider.value));
    const lx = parseFloat(dSlider.value);
    const absD = Math.pow(10, lx);
    const w = b * sigmoid(-b * absD);
    const pct = 2 * sigmoid(-b * absD);

    $('gBVal').textContent = fmtNum(b);
    $('gDVal').textContent = fmtNum(absD);
    $('gInit').textContent = fmtNum(b / 2);
    $('gOff').textContent = fmtNum(5 / b);
    $('gW').textContent = fmtNum(w);
    $('gPct').textContent = (pct * 100).toFixed(pct > 0.1 ? 0 : 1) + '%';
    $('gUp').style.width = pct * 100 + '%';
    $('gDown').style.width = pct * 100 + '%';

    ctx.clearRect(0, 0, W, H);
    ctx.font = '12px sans-serif';
    ctx.lineWidth = 1;
    for (let p = lyMin; p <= lyMax; p++) {
      ctx.strokeStyle = 'rgba(168,173,201,0.13)';
      ctx.beginPath(); ctx.moveTo(L, Y(p)); ctx.lineTo(W - R, Y(p)); ctx.stroke();
      ctx.fillStyle = '#a8adc9';
      ctx.textAlign = 'right';
      ctx.fillText(tick(p), L - 8, Y(p) + 4);
    }
    for (let p = lxMin; p <= lxMax; p++) {
      ctx.strokeStyle = 'rgba(168,173,201,0.13)';
      ctx.beginPath(); ctx.moveTo(X(p), T); ctx.lineTo(X(p), H - B); ctx.stroke();
      ctx.fillStyle = '#a8adc9';
      ctx.textAlign = 'center';
      ctx.fillText(tick(p), X(p), H - B + 18);
    }
    ctx.fillText('|Δ|: how far the margin has moved (log scale)', (L + W - R) / 2, H - 6);
    ctx.save();
    ctx.translate(14, (T + H - B) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('push strength w (log scale)', 0, 0);
    ctx.restore();

    [0.001, 0.01, 0.1, 1, 10].forEach((bb) => {
      curve(bb, 'rgba(124,155,255,0.28)', 1.5);
      ctx.fillStyle = 'rgba(124,155,255,0.75)';
      ctx.textAlign = 'left';
      ctx.fillText('β=' + bb, X(lxMin) + 6, Y(Math.log10(bb / 2)) - 5);
    });

    const offLx = Math.log10(5 / b);
    if (offLx > lxMin && offLx < lxMax) {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(110,231,200,0.8)';
      ctx.beginPath(); ctx.moveTo(X(offLx), T); ctx.lineTo(X(offLx), H - B); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#6ee7c8';
      ctx.textAlign = offLx > 2.5 ? 'right' : 'left';
      ctx.fillText('push off: |Δ| ≈ 5/β', X(offLx) + (offLx > 2.5 ? -6 : 6), T + 14);
    }

    curve(b, '#ff8ab8', 3.5);
    const ly = logW(b, lx);
    ctx.beginPath();
    ctx.arc(X(lx), Y(Math.max(ly, lyMin)), 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ff8ab8';
    ctx.fill();
    ctx.strokeStyle = '#0b0d17';
    ctx.lineWidth = 2;
    ctx.stroke();

    const where = pct > 0.5
      ? `Push near full strength (w ≈ β/2 = ${fmtNum(b / 2)}). It stays on until |Δ| ≈ 5/β = ${fmtNum(5 / b)}.`
      : pct > 0.01
        ? `Switching off: |Δ| has passed about 1/β = ${fmtNum(1 / b)}, and the push is fading fast.`
        : 'Push is off (under 1% of where it started), so this pair no longer moves the model.';
    const kind = b >= 1
      ? ' Large β: a strong push that stops after only a small change, so the model stays near the reference.'
      : b <= 0.05
        ? ' Small β: a gentle push that keeps going until |Δ| is huge, so the model can drift far from the reference.'
        : ' Medium β: in between.';
    $('gradCaption').textContent = where + kind;
  }

  let anim = null;
  $('gradPlay').addEventListener('click', () => {
    if (anim) cancelAnimationFrame(anim);
    const b = Math.pow(10, parseFloat(bSlider.value));
    const end = Math.min(lxMax, Math.log10(10 / b));
    const t0 = performance.now();
    function step(now) {
      const p = clamp((now - t0) / 4500, 0, 1);
      dSlider.value = lerp(lxMin, end, p);
      draw();
      anim = p < 1 ? requestAnimationFrame(step) : null;
    }
    anim = requestAnimationFrame(step);
  });
  dSlider.addEventListener('input', () => {
    if (anim) { cancelAnimationFrame(anim); anim = null; }
    draw();
  });
  bSlider.addEventListener('input', draw);
  draw();
})();

// ================= 7. ONE TRAINING STEP (loop ↔ code) =================
(function stepLoop() {
  const container = $('stepLoop');
  const steps = container.querySelectorAll('.loop-step');
  const codeLines = document.querySelectorAll('#stepCode .code-line');
  const interval = Number(container.dataset.interval) || 1000;
  let i = 0, visible = false;
  observeVisibility(container, (v) => (visible = v));
  setInterval(() => {
    if (!visible) return;
    steps.forEach((s, k) => s.classList.toggle('active', k === i));
    codeLines.forEach((c) => c.classList.toggle('active', Number(c.dataset.step) === i));
    i = (i + 1) % steps.length;
  }, interval);
})();
