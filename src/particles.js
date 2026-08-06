import { Container, Graphics, GraphicsContext } from "pixi.js";

// Share particle contexts to avoid redrawing geometries
const dotContext = new GraphicsContext().circle(0, 0, 6).fill(0xffffff);

const ringContext = new GraphicsContext()
  .circle(0, 0, 15)
  .stroke({ width: 2.0, color: 0xffffff });

const starContext = new GraphicsContext()
  .moveTo(0, -10)
  .quadraticCurveTo(0, 0, 10, 0)
  .quadraticCurveTo(0, 0, 0, 10)
  .quadraticCurveTo(0, 0, -10, 0)
  .quadraticCurveTo(0, 0, 0, -10)
  .fill(0xffffff);

// Tapered spark line pointing right, length = 20
const sparkContext = new GraphicsContext()
  .moveTo(-10, 0)
  .lineTo(0, -1.5)
  .lineTo(10, 0)
  .lineTo(0, 1.5)
  .closePath()
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
  spark: sparkContext,
  petal: petalContext,
  peanut: peanutContext,
  flash: dotContext, // uses dot geometry, behaves like flash
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

    // Random velocity in radial direction
    const angle = Math.random() * Math.PI * 2;

    let speed = 1.5 + Math.random() * 4.5;
    if (type === "spark") {
      speed = 3.5 + Math.random() * 6.5; // Sparks shoot out fast!
    } else if (type === "ring") {
      speed = 0.1 + Math.random() * 0.4; // Ring expands in place
    } else if (type === "star") {
      speed = 2.0 + Math.random() * 4.0;
    } else if (type === "petal") {
      speed = 0.8 + Math.random() * 1.5;
    }

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    // Gravity and friction
    if (type === "petal") {
      this.gravity = 0.02;
      this.friction = 0.96;
    } else if (type === "ring") {
      this.gravity = 0;
      this.friction = 0.95;
    } else if (type === "spark") {
      this.gravity = 0.05; // Light gravity for sparks
      this.friction = 0.96; // Decelerate to form trail
    } else {
      this.gravity = 0.08;
      this.friction = 0.98;
    }

    // Rotation and scale variables
    this.baseScale = 0.7 + Math.random() * 1.0;
    if (type === "flash") {
      this.baseScale = 2.5 + Math.random() * 1.5; // Giant central flash
    } else if (type === "ring") {
      this.baseScale = 0.2; // Starts small
    }
    this.scale.set(this.baseScale);

    this.rotation = Math.random() * Math.PI * 2;
    if (type === "spark") {
      this.rotation = Math.atan2(this.vy, this.vx);
      this.vr = 0; // Spark aligns with velocity instead of spinning
    } else if (type === "ring") {
      this.rotation = 0;
      this.vr = 0;
    } else {
      this.vr = (Math.random() - 0.5) * (type === "petal" ? 0.08 : 0.25);
    }

    // Twinkling for stars
    this.twinkleSpeed = 0.15 + Math.random() * 0.25;
    this.twinklePhase = Math.random() * Math.PI * 2;
    this.twinkleTime = 0;

    // Flutter for petals
    this.flutterSpeed = 0.08 + Math.random() * 0.12;
    this.flutterPhase = Math.random() * Math.PI * 2;
    this.flutterTime = 0;

    // Life variables
    this.alpha = 1.0;
    if (type === "flash") {
      this.fadeSpeed = 0.08; // Fades instantly
    } else if (type === "ring") {
      this.fadeSpeed = 0.025; // Fades as it expands
    } else if (type === "petal") {
      this.fadeSpeed = 0.01 + Math.random() * 0.012;
    } else {
      this.fadeSpeed = 0.015 + Math.random() * 0.02;
    }

    this.scaleSpeed = type === "ring" ? 0.08 : -0.008;
  }

  update(deltaTime) {
    // Apply physics
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;

    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // Spark direction alignment and dynamic stretching based on speed
    if (this.type === "spark") {
      const speedVal = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      this.scale.x = (0.6 + speedVal * 0.15) * this.baseScale;
      this.scale.y = this.baseScale;
      this.rotation = Math.atan2(this.vy, this.vx);
    } else if (this.type === "ring") {
      // Expand ring
      const newScale = this.scale.x + this.scaleSpeed * deltaTime;
      this.scale.set(newScale);
    } else if (this.type === "petal") {
      // Fluttering motion
      this.flutterTime += deltaTime * this.flutterSpeed;
      this.x +=
        Math.sin(this.flutterTime + this.flutterPhase) * 0.5 * deltaTime;
      this.rotation += this.vr * deltaTime;
    } else if (this.type === "star") {
      // Twinkle alpha
      this.twinkleTime += deltaTime * this.twinkleSpeed;
      this.alpha = 0.4 + Math.sin(this.twinkleTime + this.twinklePhase) * 0.6;
      this.rotation += this.vr * deltaTime;
    } else {
      this.rotation += this.vr * deltaTime;
    }

    // Fade out
    this.alpha -= this.fadeSpeed * deltaTime;

    // Scale down for non-rings
    if (this.type !== "ring") {
      const newScale = this.scale.x + this.scaleSpeed * deltaTime;
      this.scale.set(Math.max(0.1, newScale));
    }

    return this.alpha <= 0 || (this.type !== "ring" && this.scale.x <= 0.1);
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
      0x00e5ff, // Bright Cyan
      0x39ff14, // Neon Lime Green
      0xff00ff, // Neon Purple
    ];

    if (count >= 15) {
      // Big firework explosion!
      // 1. One central flash (bright white or yellow)
      const flashColor = [0xffffff, 0xffea00][Math.floor(Math.random() * 2)];
      const flash = new Particle(x, y, flashColor, "flash");
      this.addChild(flash);
      this.particles.push(flash);

      // 2. One or two expanding rings
      const ringColor = colors[Math.floor(Math.random() * colors.length)];
      const ring = new Particle(x, y, ringColor, "ring");
      this.addChild(ring);
      this.particles.push(ring);
      if (Math.random() > 0.5) {
        const ring2 = new Particle(
          x,
          y,
          colors[Math.floor(Math.random() * colors.length)],
          "ring",
        );
        ring2.scale.set(0.1);
        ring2.scaleSpeed = 0.12;
        this.addChild(ring2);
        this.particles.push(ring2);
      }

      // 3. Spawns count sparks shooting out in radial directions
      for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        // Mix: 60% sparks, 30% stars, 10% dots
        const rand = Math.random();
        let type = "spark";
        if (rand > 0.7) {
          type = "star";
        } else if (rand > 0.9) {
          type = "dot";
        }

        const particle = new Particle(x, y, color, type);
        this.addChild(particle);
        this.particles.push(particle);
      }
    } else {
      // Small match/sparkle trail
      for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const type = ["dot", "spark", "star"][Math.floor(Math.random() * 3)];
        const particle = new Particle(x, y, color, type);
        this.addChild(particle);
        this.particles.push(particle);
      }
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
