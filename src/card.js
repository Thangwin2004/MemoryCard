import { Container, Graphics, Sprite, Assets, Text, TextStyle } from "pixi.js";
import {
  createCardBackContext,
  createCardFrontBackgroundContext,
  getAvatarPath,
  drawPeanutPath,
} from "./symbols";
import { audio } from "./audio";

export class Card extends Container {
  /**
   * @param {number} id - Match pair ID
   * @param {string} avatarFile - Filename of the avatar image
   * @param {number} width - Card width
   * @param {number} height - Card height
   * @param {function} onClickCallback - Triggered when the card is clicked
   */
  constructor(id, avatarFile, width, height, onClickCallback) {
    super();

    this.pairId = id;
    this.avatarFile = avatarFile;
    this.w = width;
    this.h = height;
    this.onClickCallback = onClickCallback;

    this.isFlipped = false;
    this.isMatched = false;
    this.isAnimating = false;

    // Set pivot to the center for flipping and hover scaling
    this.pivot.set(width / 2, height / 2);

    // Create front container
    this.frontContainer = new Container();
    this.frontContainer.visible = false;
    this.addChild(this.frontContainer);

    // Front background
    const frontBgCtx = createCardFrontBackgroundContext(width, height);
    const frontBg = new Graphics({ context: frontBgCtx });
    this.frontContainer.addChild(frontBg);

    // Create front mask following the peanut shape so the avatar is beautifully clipped
    const frontMask = new Graphics();
    drawPeanutPath(frontMask, width / 2, height / 2, width, height);
    frontMask.fill(0xffffff);
    this.frontContainer.addChild(frontMask);
    this.frontContainer.mask = frontMask;

    // Load and add avatar sprite
    this.avatarSprite = null;
    this.loadAvatar();

    // Create back graphics
    const backCtx = createCardBackContext(width, height);
    this.backGraphics = new Graphics({ context: backCtx });
    this.addChild(this.backGraphics);

    // Add tiny brand text on the back
    const brandStyle = new TextStyle({
      fontFamily: "Outfit, sans-serif",
      fontSize: 8,
      fill: 0xffea00,
      fontWeight: "bold",
    });
    const brandText = new Text({
      style: brandStyle,
    });
    brandText.anchor.set(0.5);
    brandText.alpha = 0.55;
    brandText.position.set(width / 2, height - 12);
    this.backGraphics.addChild(brandText);

    // Enable interactions
    this.eventMode = "static";
    this.cursor = "pointer";

    // Event listeners
    this.on("pointerover", this.onHoverStart, this);
    this.on("pointerout", this.onHoverEnd, this);
    this.on("pointertap", this.onTap, this);

    // Pulse properties for matched animation
    this.pulseTime = 0;
    this.isPulsing = false;
  }

  async loadAvatar() {
    try {
      const texture = await Assets.load(getAvatarPath(this.avatarFile));
      if (this.destroyed) return;

      this.avatarSprite = new Sprite(texture);
      this.avatarSprite.anchor.set(0.5);

      // Position at card center
      this.avatarSprite.x = this.w / 2;
      this.avatarSprite.y = this.h / 2;

      // Fit inside card with padding
      const maxDim = Math.min(this.w, this.h) * 0.75;
      const scale = maxDim / Math.max(texture.width, texture.height);
      this.avatarSprite.scale.set(scale);

      this.frontContainer.addChild(this.avatarSprite);
    } catch (e) {
      console.error("Error loading avatar texture:", e);
    }
  }

  onHoverStart() {
    if (this.isMatched || this.isAnimating || this.isFlipped) return;
    // Scale up slightly and glow
    this.scale.set(1.05);
  }

  onHoverEnd() {
    if (this.isMatched || this.isAnimating) return;
    this.scale.set(1.0);
  }

  onTap() {
    if (this.isFlipped || this.isMatched || this.isAnimating) return;

    audio.playFlip();
    this.onClickCallback(this);
  }

  /**
   * Performs 3D-like flip animation (squash X-scale to 0, swap side, restore X-scale)
   * @param {boolean} showFront
   * @returns {Promise<void>}
   */
  flip(showFront) {
    if (this.isFlipped === showFront || this.isAnimating) {
      return Promise.resolve();
    }

    this.isAnimating = true;
    this.isFlipped = showFront;
    this.eventMode = "none"; // Disable clicks during animation

    return new Promise((resolve) => {
      let step = 0;
      const duration = 12; // number of frames for the flip
      const initialScaleX = this.scale.x;
      const targetScaleY = this.scale.y;

      const flipTick = () => {
        step++;
        if (step <= duration / 2) {
          // Squashing card
          const ratio = 1 - step / (duration / 2);
          this.scale.x = ratio * initialScaleX;
        } else {
          // Change visibility halfway
          this.backGraphics.visible = !showFront;
          this.frontContainer.visible = showFront;

          // Expanding card
          const ratio = (step - duration / 2) / (duration / 2);
          this.scale.x = ratio * initialScaleX;
        }

        if (step < duration) {
          requestAnimationFrame(flipTick);
        } else {
          this.scale.x = initialScaleX;
          this.scale.y = targetScaleY;
          this.isAnimating = false;

          if (!this.isMatched) {
            this.eventMode = "static";
          }
          resolve();
        }
      };

      requestAnimationFrame(flipTick);
    });
  }

  /**
   * Sets card matched state and plays match effect
   */
  markMatched() {
    this.isMatched = true;
    this.eventMode = "none";
    this.cursor = "default";
    this.scale.set(1.0);
    this.isPulsing = true;
    this.pulseTime = 0;
  }

  /**
   * Ticker update for card animation (e.g. pulse when matched)
   */
  update(ticker) {
    if (this.isPulsing) {
      this.pulseTime += ticker.deltaTime * 0.15;
      const scaleVal =
        1 + Math.sin(this.pulseTime) * 0.08 * Math.exp(-this.pulseTime * 0.5);

      this.scale.set(scaleVal);

      if (this.pulseTime > Math.PI * 2) {
        this.isPulsing = false;
        this.scale.set(1.0);
      }
    }
  }
}
