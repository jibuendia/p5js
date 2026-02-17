const particles = [];
const ripples = [];
const spacing = 68;
let canvasHost;

function setup() {
  canvasHost = document.getElementById("canvas-layer");
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent(canvasHost);

  const cols = Math.ceil(windowWidth / spacing);
  const rows = Math.ceil(windowHeight / spacing);

  for (let y = 0; y <= rows; y += 1) {
    for (let x = 0; x <= cols; x += 1) {
      particles.push({
        baseX: x * spacing + random(-10, 10),
        baseY: y * spacing + random(-10, 10),
        x: x * spacing,
        y: y * spacing,
        vx: 0,
        vy: 0,
        seed: random(1000)
      });
    }
  }

  noFill();
  strokeWeight(1.1);
}

function draw() {
  background(8, 22, 28, 36);

  for (let i = ripples.length - 1; i >= 0; i -= 1) {
    const ripple = ripples[i];
    ripple.radius += 3.6;
    ripple.life -= 0.015;
    if (ripple.life <= 0) {
      ripples.splice(i, 1);
    }
  }

  for (let i = 0; i < particles.length; i += 1) {
    const p = particles[i];

    const driftX = map(noise(p.seed, frameCount * 0.004), 0, 1, -14, 14);
    const driftY = map(noise(p.seed + 200, frameCount * 0.004), 0, 1, -14, 14);
    const targetX = p.baseX + driftX;
    const targetY = p.baseY + driftY;

    p.vx += (targetX - p.x) * 0.03;
    p.vy += (targetY - p.y) * 0.03;

    const d = dist(mouseX, mouseY, p.x, p.y);
    if (d < 190) {
      const angle = atan2(p.y - mouseY, p.x - mouseX);
      const force = map(d, 0, 190, 1.8, 0);
      p.vx += cos(angle) * force;
      p.vy += sin(angle) * force;
    }

    for (let r = 0; r < ripples.length; r += 1) {
      const ripple = ripples[r];
      const rd = dist(ripple.x, ripple.y, p.x, p.y);
      const band = abs(rd - ripple.radius);
      if (band < 26) {
        const angle = atan2(p.y - ripple.y, p.x - ripple.x);
        const push = map(band, 0, 26, 2.3, 0) * ripple.life;
        p.vx += cos(angle) * push;
        p.vy += sin(angle) * push;
      }
    }

    p.vx *= 0.84;
    p.vy *= 0.84;
    p.x += p.vx;
    p.y += p.vy;

    stroke(32, 211, 194, 140);
    point(p.x, p.y);
  }

  for (let i = 0; i < particles.length; i += 1) {
    const a = particles[i];
    for (let j = i + 1; j < particles.length; j += 1) {
      const b = particles[j];
      const d = dist(a.x, a.y, b.x, b.y);
      if (d < 82) {
        const alpha = map(d, 0, 82, 110, 0);
        stroke(255, 122, 24, alpha);
        line(a.x, a.y, b.x, b.y);
      }
    }
  }

  noStroke();
  fill(255, 150, 90, 36);
  circle(mouseX, mouseY, 80);
}

function mouseMoved() {
  ripples.push({ x: mouseX, y: mouseY, radius: 0, life: 1 });
  if (ripples.length > 8) {
    ripples.shift();
  }
}

function touchMoved() {
  mouseMoved();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
