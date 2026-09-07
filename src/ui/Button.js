import { Container, Graphics, Text, FillGradient } from "pixi.js";
import { audio } from "../audio";
import gsap from "gsap";

export class Button extends Container {
  constructor(text, onClick, currentR = 30, theme = "orange") {
    super();
    this.onClick = onClick;
    this.currentR = currentR;

    this.content = new Container();
    this.addChild(this.content);

    this.shadow = new Graphics();
    this.bg = new Graphics();
    this.gloss = new Graphics();
    this.content.addChild(this.shadow, this.bg, this.gloss);

    let colorTop, colorBot, colorShadow;
    if (theme === "green") {
      colorTop = "#66BB6A";
      colorBot = "#388E3C";
      colorShadow = 0x1b5e20;
    } else if (theme === "blue") {
      colorTop = "#42A5F5";
      colorBot = "#1976D2";
      colorShadow = 0x0d47a1;
    } else if (theme === "yellow") {
      colorTop = "#FFCA28";
      colorBot = "#F57C00";
      colorShadow = 0xb26a00;
    } else if (theme === "red") {
      colorTop = "#EF5350";
      colorBot = "#C62828";
      colorShadow = 0x6e0912;
    } else if (theme === "purple") {
      colorTop = "#AB47BC";
      colorBot = "#7B1FA2";
      colorShadow = 0x4a148c;
    } else {
      // Default: Vibrant Marth3 Primary Orange
      colorTop = "#FF7043";
      colorBot = "#F4511E";
      colorShadow = 0xb23c17;
    }

    this.colorTop = colorTop;
    this.colorBot = colorBot;
    this.colorShadow = colorShadow;

    this.label = new Text({
      text: text,
      style: {
        fontFamily: "'Be Vietnam Pro', 'Baloo 2', sans-serif",
        fontSize: currentR * 0.75,
        fill: "#ffffff",
        fontWeight: "900",
        stroke: { color: "#000000", width: 4, join: "round" },
        dropShadow: {
          color: "#000000",
          alpha: 0.5,
          angle: Math.PI / 2,
          distance: 2,
        },
      },
    });
    this.label.anchor.set(0.5);
    this.content.addChild(this.label);

    const width = Math.max(this.label.width + currentR * 3, currentR * 5);
    const height = currentR * 2;

    this.updateStyle(width, height);

    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", () => {
      audio.playClick();
      this.content.scale.set(0.96);
      this.content.y = currentR * 0.12;
    });
    this.on("pointerup", () => {
      this.content.scale.set(1);
      this.content.y = 0;
      if (this.onClick) this.onClick();
    });
    this.on("pointerupoutside", () => {
      this.content.scale.set(1);
      this.content.y = 0;
    });
  }

  setLabelText(newText) {
    this.label.text = newText;
    const width = Math.max(
      this.label.width + this.currentR * 3,
      this.currentR * 5,
    );
    const height = this.currentR * 2;
    this.updateStyle(width, height);
  }

  updateStyle(width, height) {
    if (!width || !height) return;
    const currentR = this.currentR;
    this.shadow
      .clear()
      .roundRect(
        -width / 2,
        -height / 2 + currentR * 0.22,
        width,
        height,
        currentR,
      )
      .fill({ color: this.colorShadow });

    const btnGrad = new FillGradient({
      start: { x: 0, y: -height / 2 },
      end: { x: 0, y: height / 2 },
      colorStops: [
        { offset: 0, color: this.colorTop },
        { offset: 1, color: this.colorBot },
      ],
    });

    this.bg
      .clear()
      .roundRect(-width / 2, -height / 2, width, height, currentR)
      .fill(btnGrad)
      .stroke({ width: Math.max(3.5, currentR * 0.14), color: 0xffffff });

    this.gloss
      .clear()
      .roundRect(
        -width / 2 + 3,
        -height / 2 + 3,
        width - 6,
        height * 0.42,
        currentR * 0.8,
      )
      .fill({ color: 0xffffff, alpha: 0.22 });
  }
}

export const ICONS = {
  home: `<svg viewBox="0 0 24 24" width="40" height="40"><path fill="#ffffff" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" width="40" height="40"><path fill="#ffffff" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" width="40" height="40"><path fill="#ffffff" d="M19,5h-2V3H7v2H5C3.9,5,3,5.9,3,7v1c0,2.55,1.92,4.63,4.39,4.94c0.63,1.5,1.98,2.63,3.61,2.96V19H7v2h10v-2h-4v-3.1 c1.63-0.33,2.98-1.46,3.61-2.96C19.08,12.63,21,10.55,21,8V7C21,5.9,20.1,5,19,5z M5,8V7h2v3.82C5.84,10.4,5,9.3,5,8z M19,8 c0,1.3-0.84,2.4-2,2.82V7h2V8z"/></svg>`,
  replay: `<svg viewBox="0 0 24 24" width="40" height="40"><path fill="#ffffff" d="M17.65,6.35C16.2,4.9,14.21,4,12,4c-4.42,0-7.99,3.58-7.99,8s3.57,8,7.99,8c3.73,0,6.84-2.55,7.73-6h-2.08 c-0.82,2.33-3.04,4-5.65,4c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.66,0,3.14,0.69,4.22,1.78L13,11h7V4L17.65,6.35z"/></svg>`,
  help: `<svg viewBox="0 0 24 24" width="40" height="40"><path fill="#ffffff" d="M12 3.5C8.96 3.5 6.5 5.96 6.5 9h3.2c0-1.5 1.3-2.8 2.8-2.8s2.8 1.3 2.8 2.8c0 1.2-.7 1.9-1.7 2.8-1.2 1.1-2.3 2.3-2.3 4.2h3.2c0-1.2.7-1.9 1.7-2.8 1.2-1.1 2.3-2.3 2.3-4.2 0-3.3-2.7-6-6-6z M10.4 19a1.6 1.6 0 1 0 3.2 0 1.6 1.6 0 1 0-3.2 0z"/></svg>`,
  volume_up: `<svg viewBox="0 0 24 24" width="40" height="40"><path fill="#ffffff" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
  volume_off: `<svg viewBox="0 0 24 24" width="40" height="40"><path fill="#ffffff" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" width="40" height="40"><path fill="#ffffff" d="M8 5v14l11-7z"/></svg>`,
  back: `<svg viewBox="0 0 24 24" width="40" height="40"><path fill="#ffffff" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
  lightbulb: `<svg viewBox="0 0 24 24" width="40" height="40"><path fill="#ffffff" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-1.3l-.85-.6C7.8 13.16 7 11.42 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.42-.8 4.16-2.15 5.1z"/></svg>`,
};

export class IconBtn extends Container {
  constructor(
    iconName,
    onClick,
    currentR = 35,
    labelText = "",
    theme = "green",
  ) {
    super();
    this.onClick = onClick;
    this.currentR = currentR;
    this.theme = theme;
    this.iconName = iconName;

    let colorTop, colorBot, colorShadow;
    if (theme === "green") {
      colorTop = "#66BB6A";
      colorBot = "#43A047";
      colorShadow = 0x2e7d32;
    } else if (theme === "orange") {
      colorTop = "#FFB74D";
      colorBot = "#F57C00";
      colorShadow = 0xe65100;
    } else if (theme === "blue") {
      colorTop = "#29B6F6";
      colorBot = "#0288D1";
      colorShadow = 0x01579b;
    } else if (theme === "red") {
      colorTop = "#ff3b4e";
      colorBot = "#d32f2f";
      colorShadow = 0x6e0912;
    } else if (theme === "purple") {
      colorTop = "#BA68C8";
      colorBot = "#8E24AA";
      colorShadow = 0x4a148c;
    } else {
      // yellow
      colorTop = "#FFCA28";
      colorBot = "#FF8F00";
      colorShadow = 0xff6f00;
    }

    this.colorTop = colorTop;
    this.colorBot = colorBot;
    this.colorShadow = colorShadow;

    this.content = new Container();
    this.addChild(this.content);

    this.shadow = new Graphics();
    this.bg = new Graphics();
    this.gloss = new Graphics();
    this.content.addChild(this.shadow, this.bg, this.gloss);

    this.iconContainer = new Container();
    this.content.addChild(this.iconContainer);

    // Optional label underneath
    if (labelText) {
      this.label = new Text({
        text: labelText,
        style: {
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: Math.max(12, currentR * 0.44),
          fill: "#ffffff",
          fontWeight: "900",
          stroke: { color: "#000000", width: 3.5, join: "round" },
        },
      });
      this.label.anchor.set(0.5, 0);
      this.label.y = currentR + 4;
      this.content.addChild(this.label);
    }

    this.updateStyle(currentR);

    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", () => {
      audio.playClick();
      this.content.scale.set(0.95);
      this.content.y = this.currentR * 0.1;
    });
    this.on("pointerup", () => {
      this.content.scale.set(1);
      this.content.y = 0;
      if (this.onClick) this.onClick();
    });
    this.on("pointerupoutside", () => {
      this.content.scale.set(1);
      this.content.y = 0;
    });
  }

  updateStyle(newRadius) {
    if (!newRadius) return;
    this.currentR = newRadius;
    const currentR = newRadius;

    this.shadow
      .clear()
      .circle(0, currentR * 0.15, currentR)
      .fill({ color: this.colorShadow });

    const btnGrad = new FillGradient({
      start: { x: 0, y: -currentR },
      end: { x: 0, y: currentR },
      colorStops: [
        { offset: 0, color: this.colorTop },
        { offset: 1, color: this.colorBot },
      ],
    });

    this.bg
      .clear()
      .circle(0, 0, currentR)
      .fill(btnGrad)
      .stroke({ width: Math.max(2.8, currentR * 0.14), color: 0xffffff });

    this.gloss
      .clear()
      .ellipse(0, -currentR * 0.35, currentR * 0.65, currentR * 0.3)
      .fill({ color: 0xffffff, alpha: 0.25 });

    this.renderIcon(this.iconName, currentR);

    if (this.label) {
      this.label.style.fontSize = Math.max(11, currentR * 0.42);
      this.label.y = currentR + 4;
    }
  }

  renderIcon(iconName, currentR) {
    this.iconContainer.removeChildren();
    if (ICONS[iconName]) {
      const icon = new Graphics();
      icon.svg(ICONS[iconName]);
      icon.pivot.set(12, 12);
      icon.scale.set((currentR * 1.25) / 24);
      icon.y = 0;
      this.iconContainer.addChild(icon);
    } else if (iconName) {
      const iconText = new Text({
        text: iconName,
        style: {
          fontFamily: '"Be Vietnam Pro", sans-serif',
          fontSize: currentR * 1.1,
          fill: "#ffffff",
          fontWeight: "bold",
        },
      });
      iconText.anchor.set(0.5);
      iconText.y = 0;
      this.iconContainer.addChild(iconText);
    }
  }

  updateIcon(newIconName) {
    this.iconName = newIconName;
    this.renderIcon(newIconName, this.currentR);
  }

  setTexture() {
    // Backward compatibility
  }
}

/**
 * Vibrant 3D Capsule Button (Hero Play button & Level Card)
 */
export class VibrantCapsuleBtn extends Container {
  constructor({
    text,
    subText = "",
    badge = "",
    width = 240,
    height = 68,
    theme = "orange",
    iconName = "play",
    pulse = false,
    onClick = null,
  }) {
    super();
    this.onClick = onClick;
    this.btnWidth = width;
    this.btnHeight = height;

    this.content = new Container();
    this.addChild(this.content);

    let colorTop, colorBot, colorShadow;
    if (theme === "green") {
      colorTop = "#4CAF50";
      colorBot = "#2E7D32";
      colorShadow = 0x1b5e20;
    } else if (theme === "amber" || theme === "yellow") {
      colorTop = "#FFA726";
      colorBot = "#EF6C00";
      colorShadow = 0xb25000;
    } else if (theme === "red") {
      colorTop = "#EF5350";
      colorBot = "#C62828";
      colorShadow = 0x8a0000;
    } else if (theme === "blue") {
      colorTop = "#42A5F5";
      colorBot = "#1565C0";
      colorShadow = 0x0d47a1;
    } else {
      // Primary Orange
      colorTop = "#FF7043";
      colorBot = "#E64A19";
      colorShadow = 0xbf360c;
    }

    const radius = Math.min(24, height / 2);

    this.shadow = new Graphics()
      .roundRect(-width / 2, -height / 2 + 7, width, height, radius)
      .fill({ color: colorShadow });

    const btnGrad = new FillGradient({
      start: { x: 0, y: -height / 2 },
      end: { x: 0, y: height / 2 },
      colorStops: [
        { offset: 0, color: colorTop },
        { offset: 1, color: colorBot },
      ],
    });

    this.bg = new Graphics()
      .roundRect(-width / 2, -height / 2, width, height, radius)
      .fill(btnGrad)
      .stroke({ width: 3.5, color: 0xffffff });

    this.gloss = new Graphics()
      .roundRect(
        -width / 2 + 4,
        -height / 2 + 3,
        width - 8,
        height * 0.38,
        radius * 0.75,
      )
      .fill({ color: 0xffffff, alpha: 0.25 });

    this.content.addChild(this.shadow, this.bg, this.gloss);

    // Layout elements inside
    this.textContainer = new Container();
    this.content.addChild(this.textContainer);

    let contentOffsetX = 0;
    if (iconName && ICONS[iconName]) {
      const icon = new Graphics();
      icon.svg(ICONS[iconName]);
      icon.pivot.set(12, 12);
      icon.scale.set((height * 0.5) / 24);
      icon.position.set(-width / 2 + height * 0.45, 0);
      this.content.addChild(icon);
      contentOffsetX = height * 0.18;
    }

    // Main Title Text
    this.title = new Text({
      text: text,
      style: {
        fontFamily: "'Baloo 2', 'Be Vietnam Pro', sans-serif",
        fontSize: subText ? 21 : 24,
        fill: "#ffffff",
        fontWeight: "900",
        letterSpacing: 1.5,
        dropShadow: {
          alpha: 0.45,
          blur: 2,
          distance: 1.5,
          color: 0x000000,
        },
      },
    });
    this.title.anchor.set(0.5, subText ? 1 : 0.5);
    this.title.position.set(contentOffsetX, subText ? -2 : 0);
    this.textContainer.addChild(this.title);

    // Optional Subtitle
    if (subText) {
      this.sub = new Text({
        text: subText,
        style: {
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: 13,
          fill: "#ffe0b2",
          fontWeight: "700",
          dropShadow: {
            alpha: 0.4,
            blur: 1.5,
            distance: 1,
            color: 0x000000,
          },
        },
      });
      this.sub.anchor.set(0.5, 0);
      this.sub.position.set(contentOffsetX, 3);
      this.textContainer.addChild(this.sub);
    }

    // Optional Badge positioned neatly inside on the right side
    if (badge) {
      const badgeText = new Text({
        text: badge,
        style: {
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: 11,
          fill: "#ffffff",
          fontWeight: "900",
        },
      });
      badgeText.anchor.set(0.5);

      const bw = badgeText.width + 16;
      const bh = 22;
      const badgeBg = new Graphics()
        .roundRect(-bw / 2, -bh / 2, bw, bh, bh / 2)
        .fill({ color: 0x000000, alpha: 0.32 })
        .stroke({ width: 1.5, color: 0xffffff, alpha: 0.7 });

      const badgeContainer = new Container();
      badgeContainer.addChild(badgeBg, badgeText);
      // Place neatly inside capsule near right end
      badgeContainer.position.set(width / 2 - bw / 2 - 14, 0);
      this.content.addChild(badgeContainer);
    }

    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", () => {
      audio.playClick();
      this.content.scale.set(0.96);
      this.content.y = 4;
    });
    this.on("pointerup", () => {
      this.content.scale.set(1);
      this.content.y = 0;
      if (this.onClick) this.onClick();
    });
    this.on("pointerupoutside", () => {
      this.content.scale.set(1);
      this.content.y = 0;
    });

    if (pulse) {
      this.pulseTween = gsap.to(this.scale, {
        x: 1.04,
        y: 1.04,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }

  setLabelText(newText, newSubText = null) {
    if (this.title) {
      this.title.text = newText;
    }
    if (newSubText !== null && this.sub) {
      this.sub.text = newSubText;
    }
  }

  destroy(options) {
    if (this.pulseTween) {
      this.pulseTween.kill();
      this.pulseTween = null;
    }
    super.destroy(options);
  }
}
