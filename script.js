// ---------- Shared helpers used across every page ----------

// Scatters small gold sparkles inside any element with class "sparkles"
function scatterSparkles(container, count = 18) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = (Math.random() * 6).toFixed(2) + "s";
    s.style.width = s.style.height = 2 + Math.random() * 3 + "px";
    container.appendChild(s);
  }
}

// Confetti / cracker burst — draws on a full-screen canvas
function fireConfetti(durationMs = 3200) {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#cf9f4e", "#e3c07f", "#f6efdf", "#8f2030", "#ffffff"];
  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  const pieces = Array.from({ length: 140 }, () => ({
    x: W() / 2 + (Math.random() - 0.5) * 60,
    y: H() * 0.35 + (Math.random() - 0.5) * 40,
    vx: (Math.random() - 0.5) * 11,
    vy: -Math.random() * 11 - 4,
    size: 5 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));

  const start = performance.now();
  function frame(t) {
    const elapsed = t - start;
    ctx.clearRect(0, 0, W(), H());
    pieces.forEach((p) => {
      p.vy += 0.28; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}

// Respect the visitor's reduced-motion preference
if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.dataset.reducedMotion = "true";
}
