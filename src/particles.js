import { Container, Graphics, GraphicsContext } from "pixi.js";

// Share particle contexts to avoid redrawing geometries
const dotContext = new GraphicsContext().circle(0, 0, 4).fill(0xffffff);

const ringContext = new GraphicsContext()
  .circle(0, 0, 5)
  .stroke({ width: 1.5, color: 0xffffff });

const starContext = new GraphicsContext()
  .moveTo(0, -6)
  .quadraticCurveTo(0, 0, 6, 0)
  .quadraticCurveTo(0, 0, 0, 6)
  .quadraticCurveTo(0, 0, -6, 0)
  .quadraticCurveTo(0, 0, 0, -6)
  .fill(0xffffff);

const petalContext = new GraphicsContext()
  .moveTo(0, -5)
  .bezierCurveTo(-4, -5, -5, -2, -3, 2)
  .bezierCurveTo(-1, 5, 1, 5, 3, 2)
  .bezierCurveTo(5, -2, 4, -5, 0, -5)
  .fill(0xffffff);

const peanutContext = new GraphicsContext()
  .moveTo(-2.5, 0)
  .bezierCurveTo(-3.5, -2, -3.2, -5.5, 0, -5.75)
  .bezierCurveTo(3.2, -5.5, 3.5, -2, 2.5, 0)
  .bezierCurveTo(3.5, 2, 3.2, 5.5, 0, 5.75)
  .bezierCurveTo(-3.2, 5.5, -3.5, 2, -2.5, 0)
  .closePath()
  .fill(0xffffff);

const CONTEXT_MAP = {
  dot: dotContext,
  ring: ringContext,
  star: starContext,
  petal: petalContext,
  peanut: peanutContext,
};

class Particle extends Graphics {
  constructor(x, y, color, type = "dot") {
    super({
      context: CONTEXT_MAP[type] || dotContext,
    });

    this.x = x;
    this.y = y;
    this.tint = color;
    this.type = type;

    // Random velocity
    const angle = Math.random() * Math.PI * 2;
    const speed =
      type === "petal" ? 0.8 + Math.random() * 1.5 : 1.5 + Math.random() * 4.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    // Gravity and friction
    this.gravity = type === "petal" ? 0.02 : 0.08;
    this.friction = type === "petal" ? 0.96 : 0.98;

    // Rotation variables (spinning effect)
    this.rotation = Math.random() * Math.PI * 2;
    this.vr = (Math.random() - 0.5) * (type === "petal" ? 0.08 : 0.25);

    // Flutter variables for petal floating
    this.flutterSpeed = 0.08 + Math.random() * 0.12;
    this.flutterPhase = Math.random() * Math.PI * 2;
    this.flutterTime = 0;

    // Life variables
    this.alpha = 1.0;
    this.fadeSpeed =
      type === "petal"
        ? 0.01 + Math.random() * 0.012
        : 0.015 + Math.random() * 0.02;
    this.scale.set(0.6 + Math.random() * 0.9);
    this.scaleSpeed = -0.008;
  }

  update(deltaTime) {
    // Apply physics
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;

    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // Fluttering motion for petals (leaves/cherry blossoms floating)
    if (this.type === "petal") {
      this.flutterTime += deltaTime * this.flutterSpeed;
      this.x +=
        Math.sin(this.flutterTime + this.flutterPhase) * 0.5 * deltaTime;
    }

    // Spin particle
    this.rotation += this.vr * deltaTime;

    // Fade out
    this.alpha -= this.fadeSpeed * deltaTime;

    // Scale down
    const newScale = this.scale.x + this.scaleSpeed * deltaTime;
    this.scale.set(Math.max(0.1, newScale));

    return this.alpha <= 0 || this.scale.x <= 0.1;
  }
}

export class ParticleSystem extends Container {
  constructor() {
    super();
    this.particles = [];
  }

  /**
   * Spawns a burst of particles at a specific position
   */
  spawnBurst(x, y, count = 20) {
    const colors = [
      0xffea00, // Gold
      0xd4af37, // Metallic Gold
      0xff3366, // Peach Pink
      0xff7799, // Apricot Blossom
      0xffffff, // Glitter White
      0xff9100, // Orange
    ];
    const types = ["dot", "ring", "star", "petal", "peanut"];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const particle = new Particle(x, y, color, type);
      this.addChild(particle);
      this.particles.push(particle);
    }
  }

  /**
   * Updates all active particles and cleans up dead ones
   */
  update(ticker) {
    const dt = ticker.deltaTime;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      const isDead = p.update(dt);

      if (isDead) {
        this.removeChild(p);
        p.destroy();
        this.particles.splice(i, 1);
      }
    }
  }

  clearAll() {
    for (const p of this.particles) {
      this.removeChild(p);
      p.destroy();
    }
    this.particles = [];
  }
}
