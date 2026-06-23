import { Container, Graphics } from "pixi.js";

export class ChimLac extends Container {
  constructor(color = 0xd4af37) {
    super();
    this.color = color;

    // Bird body graphics
    this.body = new Graphics();
    this.addChild(this.body);

    // Left (background) wing and Right (foreground) wing
    this.leftWing = new Graphics();
    this.rightWing = new Graphics();
    this.addChild(this.leftWing);
    this.addChild(this.rightWing);

    this.drawBird();

    // Flapping parameters
    this.flapCycle = Math.random() * Math.PI * 2;
    this.flapSpeed = 0.08 + Math.random() * 0.04;
  }

  drawBird() {
    // Elegant Lạc Bird silhouette (crane-like facing right)
    this.body
      .clear()
      // Beak: extremely long, elegant and slightly curved down
      .moveTo(16, -1)
      .lineTo(34, 1)
      .lineTo(14, 2)
      // Head
      .moveTo(12, -2)
      .quadraticCurveTo(16, -2, 16, 0.5)
      .quadraticCurveTo(16, 3, 12, 3)
      // Crest (elegant feathers pointing back from head)
      .moveTo(13, -2)
      .quadraticCurveTo(7, -6, 1, -4)
      .quadraticCurveTo(7, -3, 12, -1)
      // Long curving neck
      .moveTo(12, 1)
      .quadraticCurveTo(7, 2.5, 3, 3)
      // Body (centered around 0, 0)
      .ellipse(-4, 2.5, 12, 4.5)
      // Long trailing tail/legs feathers
      .moveTo(-14, 2.5)
      .quadraticCurveTo(-26, 5, -34, 7)
      .moveTo(-14, 3.5)
      .quadraticCurveTo(-24, 7.5, -30, 11)
      // Fill and golden stroke
      .fill({ color: this.color, alpha: 0.22 })
      .stroke({ width: 1.2, color: this.color });

    // Foreground wing (curves up/back)
    this.rightWing
      .clear()
      .moveTo(0, 0)
      .quadraticCurveTo(-8, -16, -15, -24)
      .quadraticCurveTo(-13, -11, -3, -3)
      .closePath()
      .fill({ color: this.color, alpha: 0.28 })
      .stroke({ width: 1.0, color: this.color });

    // Background wing (curves down/back, slightly darker)
    this.leftWing
      .clear()
      .moveTo(0, 0)
      .quadraticCurveTo(-8, 16, -15, 24)
      .quadraticCurveTo(-13, 11, -3, 3)
      .closePath()
      .fill({ color: this.color, alpha: 0.16 })
      .stroke({ width: 0.8, color: this.color, alpha: 0.7 });
  }

  update(deltaTime) {
    this.flapCycle += this.flapSpeed * deltaTime;

    // Wing flapping animation: scale.y oscillates to represent full strokes
    const flapScale = Math.sin(this.flapCycle);
    this.rightWing.scale.y = 0.35 + flapScale * 0.65;
    this.leftWing.scale.y = 0.35 - flapScale * 0.65;
  }
}

export class LacBirdFlock extends Container {
  constructor(color = 0xd4af37) {
    super();
    this.color = color;
    this.birds = [];
    this.basePositions = [];
    this.phases = [];

    // V-formation offsets:
    // Leader at (0, 0)
    // 2 trailing at (-60, -35), (-60, 35)
    // 2 further trailing at (-120, -70), (-120, 70)
    const offsets = [
      { x: 0, y: 0 },
      { x: -50, y: -30 },
      { x: -50, y: 30 },
      { x: -100, y: -60 },
      { x: -100, y: 60 },
    ];

    offsets.forEach((offset, idx) => {
      const bird = new ChimLac(color);
      bird.position.set(offset.x, offset.y);
      this.addChild(bird);
      this.birds.push(bird);

      // Keep base positions for organic bobbing
      this.basePositions.push({ x: offset.x, y: offset.y });
      this.phases.push(idx * 1.2);
    });

    this.bobCycle = 0;
    this.speed = 1.0 + Math.random() * 0.5;

    // Start offscreen left
    this.x = -200;
    this.y = 120 + Math.random() * 200;
  }

  update(deltaTime, sw, sh) {
    this.bobCycle += 0.03 * deltaTime;

    // Update each bird's flap animation and add organic bobbing
    this.birds.forEach((bird, idx) => {
      bird.update(deltaTime);

      const base = this.basePositions[idx];
      const phase = this.phases[idx];
      bird.x = base.x + Math.cos(this.bobCycle + phase) * 4;
      bird.y = base.y + Math.sin(this.bobCycle * 1.5 + phase) * 5;
    });

    // Move flock forward (left to right)
    this.x += this.speed * deltaTime;

    // If the trailing-most bird has flown off the right edge, wrap the flock to the left side
    const trailBoundX = this.x - 120;
    if (trailBoundX > sw + 50) {
      this.resetFlock(sh);
    }
  }

  resetFlock(sh) {
    this.x = -200;
    this.y = 80 + Math.random() * (sh - 220);
    this.speed = 1.0 + Math.random() * 0.8;

    // Scale flock slightly to simulate height/depth variety
    const scaleVal = 0.75 + Math.random() * 0.35;
    this.scale.set(scaleVal);
  }
}
