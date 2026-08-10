import {
  Container,
  Graphics,
  Text,
  TextStyle,
  FillGradient,
  Sprite,
  Assets,
} from "pixi.js";
import { Card } from "./card";
import { ParticleSystem } from "./particles";
import { audio } from "./audio";
import { AVATAR_FILES } from "./symbols";
import { LacBirdFlock } from "./chimlac";
import { Button, IconBtn } from "./ui/Button";
import { winkGame } from "./integrations/wink/wink-adapter.js";
import gsap from "gsap";

/* global Path2D */
/* eslint-disable no-unused-vars */

function gameAlert(message) {
  return new Promise((resolve) => {
    if (!document.getElementById("game-alert-styles")) {
      const style = document.createElement("style");
      style.id = "game-alert-styles";
      style.textContent = `
        .game-alert-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100dvw;
          height: 100dvh;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100000;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .game-alert-card {
          background: #FFF3E0;
          border: 5px solid #F57C00;
          box-shadow: inset 0 0 0 2.5px #FFCC80, 0 10px 25px rgba(0, 0, 0, 0.35);
          border-radius: 20px;
          padding: 28px 24px;
          width: 85%;
          max-width: 340px;
          text-align: center;
          transform: scale(0.85);
          transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-family: 'Outfit', sans-serif;
        }
        .game-alert-text {
          color: #5D4037;
          font-size: 17px;
          line-height: 1.6;
          margin: 0 0 24px 0;
          font-weight: 700;
          text-shadow: 0 1px 0 rgba(255,255,255,0.8);
        }
        .game-alert-img-btn {
          height: 48px;
          width: auto;
          cursor: pointer;
          transition: transform 0.1s ease, filter 0.1s ease;
          outline: none;
        }
        .game-alert-img-btn:hover {
          transform: scale(1.08);
          filter: brightness(1.08);
        }
        .game-alert-img-btn:active {
          transform: scale(0.96);
          filter: brightness(0.92);
        }
      `;
      document.head.appendChild(style);
    }

    const existing = document.getElementById("game-alert-overlay-id");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "game-alert-overlay-id";
    overlay.className = "game-alert-overlay";

    const card = document.createElement("div");
    card.className = "game-alert-card";

    const text = document.createElement("p");
    text.className = "game-alert-text";
    text.innerText = message;

    const button = document.createElement("img");
    button.className = "game-alert-img-btn";
    button.src = "/assest/iconbtn/yes_btn.png";
    button.alt = "ĐỒNG Ý";

    card.appendChild(text);
    card.appendChild(button);
    overlay.appendChild(card);

    const container = document.getElementById("app") || document.body;
    container.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      card.style.transform = "scale(1)";
    });

    const closeAlert = () => {
      overlay.style.opacity = "0";
      card.style.transform = "scale(0.85)";
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 250);
    };

    button.addEventListener("click", closeAlert);
  });
}

function gameConfirm(message) {
  return new Promise((resolve) => {
    if (!document.getElementById("game-confirm-styles")) {
      const style = document.createElement("style");
      style.id = "game-confirm-styles";
      style.textContent = `
        .game-confirm-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100dvw; height: 100dvh;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex; justify-content: center; align-items: center;
          z-index: 110000;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .game-confirm-card {
          background: #FFF3E0;
          border: 5px solid #F57C00;
          box-shadow: inset 0 0 0 2.5px #FFCC80, 0 10px 25px rgba(0, 0, 0, 0.35);
          border-radius: 20px;
          padding: 28px 24px;
          width: 85%; max-width: 340px;
          text-align: center;
          transform: scale(0.85);
          transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-family: 'Be Vietnam Pro', sans-serif;
        }
        .game-confirm-text {
          color: #5D4037;
          font-size: 17px;
          line-height: 1.6;
          margin: 0 0 24px 0;
          font-weight: 700;
        }
        .game-confirm-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }
        .game-confirm-img-btn {
          height: 48px;
          width: auto;
          cursor: pointer;
          transition: transform 0.1s ease, filter 0.1s ease;
          outline: none;
        }
        .game-confirm-img-btn:hover {
          transform: scale(1.08);
          filter: brightness(1.08);
        }
        .game-confirm-img-btn:active {
          transform: scale(0.96);
          filter: brightness(0.92);
        }
      `;
      document.head.appendChild(style);
    }

    const overlay = document.createElement("div");
    overlay.className = "game-confirm-overlay";

    const card = document.createElement("div");
    card.className = "game-confirm-card";

    const text = document.createElement("p");
    text.className = "game-confirm-text";
    text.innerText = message;

    const actions = document.createElement("div");
    actions.className = "game-confirm-actions";

    const btnYes = document.createElement("img");
    btnYes.className = "game-confirm-img-btn";
    btnYes.src = "/assest/iconbtn/yes_btn.png";
    btnYes.alt = "ĐỒNG Ý";

    const btnNo = document.createElement("img");
    btnNo.className = "game-confirm-img-btn";
    btnNo.src = "/assest/iconbtn/close_btn.png";
    btnNo.alt = "KHÔNG";

    actions.appendChild(btnYes);
    actions.appendChild(btnNo);
    card.appendChild(text);
    card.appendChild(actions);
    overlay.appendChild(card);

    const container = document.getElementById("app") || document.body;
    container.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      card.style.transform = "scale(1)";
    });

    const closeConfirm = (res) => {
      overlay.style.opacity = "0";
      card.style.transform = "scale(0.85)";
      setTimeout(() => {
        overlay.remove();
        resolve(res);
      }, 250);
    };

    btnYes.onclick = () => closeConfirm(true);
    btnNo.onclick = () => closeConfirm(false);
  });
}

export const AdManager = {
  showRewardedVideo: async () => {
    console.log("[AdManager] Requesting Rewarded Video Ad...");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  },
  showInterstitial: async () => {
    console.log("[AdManager] Showing Interstitial Ad...");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  },
};

const LEVELS = [
  { name: "🟢 4x4", cols: 4, rows: 4, maxTime: 60, pairs: 8 },
  { name: "🟡 4x5", cols: 5, rows: 4, maxTime: 90, pairs: 10 },
  { name: "🔴 6x6", cols: 6, rows: 6, maxTime: 150, pairs: 18 },
];

const LOCAL_STORAGE_KEY = "bolacdauphong_memory_stats";
let currentUser = null; // Profile of the currently signed-in Google user

function getEffectiveUser() {
  if (currentUser) return currentUser;
  try {
    const savedUser = window.localStorage.getItem("google_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.name) {
        currentUser = parsed;
        return currentUser;
      }
    }
  } catch (err) {
    console.warn(err);
  }

  if (winkGame && winkGame.isAuthenticated) {
    return {
      id: "wink_user",
      name: "Thành viên",
      avatar: "/assest/image/imagenobackgrd/001_avatar_laclac.png",
    };
  }

  return null;
}

// Read records from localStorage
function getStats() {
  try {
    const user = getEffectiveUser();
    const key = user ? `${LOCAL_STORAGE_KEY}_${user.id}` : LOCAL_STORAGE_KEY;
    const data = window.localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading localStorage:", e);
  }
  return {
    totalWins: 0,
    records: {
      0: { highScore: 0, bestTime: 9999, fewestMoves: 999, history: [] },
      1: { highScore: 0, bestTime: 9999, fewestMoves: 999, history: [] },
      2: { highScore: 0, bestTime: 9999, fewestMoves: 999, history: [] },
    },
  };
}

// Save records to localStorage
function saveStats(stats) {
  try {
    const user = getEffectiveUser();
    const key = user ? `${LOCAL_STORAGE_KEY}_${user.id}` : LOCAL_STORAGE_KEY;
    if (user) {
      stats.userName = user.name;
      stats.userId = user.id;
    } else {
      stats.userName = "Khách";
      stats.userId = "guest";
    }
    window.localStorage.setItem(key, JSON.stringify(stats));
  } catch (e) {
    console.error("Error writing localStorage:", e);
  }
}

// Reusable menu button builder

// Helper function to generate pixel-perfect PixiJS style vibrant icons for DOM overlays
function getIconBtnDataUrl(iconName, theme) {
  const w = 120;
  const h = 120;
  const texH = h + h * 0.15 + 4;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = texH;
  const ctx = canvas.getContext("2d");

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
  } else if (theme === "purple") {
    colorTop = "#AB47BC";
    colorBot = "#7B1FA2";
    colorShadow = 0x4a148c;
  } else {
    // yellow
    colorTop = "#FFCA28";
    colorBot = "#FF8F00";
    colorShadow = 0xff6f00;
  }

  const shadowHex = "#" + colorShadow.toString(16).padStart(6, "0");
  const radius = w / 2;

  ctx.fillStyle = shadowHex;
  ctx.beginPath();
  ctx.arc(radius, radius + radius * 0.15, radius, 0, Math.PI * 2);
  ctx.fill();

  const gradient = ctx.createLinearGradient(0, 0, 0, w);
  gradient.addColorStop(0, colorTop);
  gradient.addColorStop(1, colorBot);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(3, radius * 0.15);
  ctx.stroke();

  const ICONS = {
    home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    gear: "M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z",
    trophy:
      "M19,5h-2V3H7v2H5C3.9,5,3,5.9,3,7v1c0,2.55,1.92,4.63,4.39,4.94c0.63,1.5,1.98,2.63,3.61,2.96V19H7v2h10v-2h-4v-3.1 c1.63-0.33,2.98-1.46,3.61-2.96C19.08,12.63,21,10.55,21,8V7C21,5.9,20.1,5,19,5z M5,8V7h2v3.82C5.84,10.4,5,9.3,5,8z M19,8 c0,1.3-0.84,2.4-2,2.82V7h2V8z",
    replay:
      "M17.65,6.35C16.2,4.9,14.21,4,12,4c-4.42,0-7.99,3.58-7.99,8s3.57,8,7.99,8c3.73,0,6.84-2.55,7.73-6h-2.08 c-0.82,2.33-3.04,4-5.65,4c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.66,0,3.14,0.69,4.22,1.78L13,11h7V4L17.65,6.35z",
    next: "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z",
    play: "M8 5v14l11-7z",
  };

  if (ICONS[iconName]) {
    const p = new Path2D(ICONS[iconName]);
    ctx.save();
    ctx.translate(radius, radius);
    const iconScale = (w * 0.6) / 24;
    ctx.scale(iconScale, iconScale);
    ctx.translate(-12, -12); // viewBox center
    ctx.fillStyle = "#ffffff";
    ctx.fill(p);
    ctx.restore();
  } else if (iconName === "x2") {
    ctx.font =
      "900 " + radius * 1.2 + 'px "Outfit", "Nunito", "Arial", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000000";
    ctx.lineJoin = "round";
    ctx.strokeText("x2", radius, radius);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("x2", radius, radius);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(radius, radius, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  return canvas.toDataURL();
}

function createMenuButton(text, onClick) {
  let cleanText = text;
  if (text.includes(" ")) {
    cleanText = text.substring(text.indexOf(" ") + 1);
  }
  if (text.startsWith("GOOGLE_ICON:")) {
    cleanText = text.substring(12);
  } else if (text.startsWith("GOOGLE_ICON")) {
    cleanText = "ĐĂNG NHẬP";
  }

  const btn = new Button(cleanText, onClick, 24);
  btn.updateStyle = (w, h) => {
    const scale = Math.min(1.2, h / (24 * 2));
    btn.scale.set(scale);
  };
  return btn;
}

// New builders for modern styled UI
function createPlayButton(text, onClick) {
  // Giảm fontSize từ 45 xuống 32 để nút không bị quá dài ngang
  const btn = new Button(text, onClick, 32);
  btn.updateStyle = (w, h) => {
    // Chỉ scale nhẹ dựa vào height thực tế của màn hình
    const scale = Math.min(1.0, h / 100);
    btn.scale.set(scale);
  };
  return btn;
}

function createCircularButton(emojiText, onClick) {
  let iconName = "";
  let theme = "yellow";

  if (emojiText === "🏆") {
    iconName = "trophy";
    theme = "yellow";
  } else if (emojiText === "⚙️") {
    iconName = "gear";
    theme = "blue";
  } else if (emojiText === "🏠") {
    iconName = "home";
    theme = "blue";
  } else if (emojiText === "🔄") {
    iconName = "replay";
    theme = "yellow";
  } else if (emojiText === "💡") {
    iconName = "💡";
    theme = "orange";
  } else if (emojiText === "⏱️") {
    iconName = "⏱️";
    theme = "red";
  } else if (
    emojiText === "📺" ||
    emojiText === "x2" ||
    emojiText === "x2 ĐIỂM"
  ) {
    iconName = "x2";
    theme = "green";
  } else if (
    emojiText === "▶️" ||
    emojiText === "next_btn" ||
    emojiText === "CHƠI TIẾP" ||
    emojiText === "TIẾP TỤC"
  ) {
    iconName = "▶";
    theme = "green";
  } else if (emojiText === "⏯️" || emojiText === "continue_btn") {
    iconName = "▶";
    theme = "orange";
  } else if (emojiText === "back_btn" || emojiText === "QUAY LẠI") {
    iconName = "↩";
    theme = "red";
  } else if (emojiText === "◀") {
    iconName = "◀";
    theme = "yellow";
  } else if (emojiText === "▶") {
    iconName = "▶";
    theme = "yellow";
  } else {
    iconName = emojiText;
    theme = "orange";
  }

  const btn = new IconBtn(iconName, onClick, 32, "", theme);
  btn.updateStyle = (r) => {
    const scale = Math.min(1.2, r / 32);
    btn.scale.set(scale);
  };
  return btn;
}

export class GameController extends Container {
  constructor(app) {
    super();
    this.app = app;

    this.currentLevelIndex = 0;
    this.achievementsLevelIndex = 0;
    this.score = 0;
    this.moves = 0;
    this.matches = 0;
    this.combo = 0;
    this.timeRemaining = 0;
    this.isGameOver = false;
    this.gameState = "MAIN_MENU";

    this.selectedCards = [];
    this.cards = [];
    this.victoryTweens = [];
    this.victoryIntervals = [];

    // Background overlay for lacquer theme
    this.bgOverlay = new Graphics();
    this.addChild(this.bgOverlay);

    // Dynamic Lạc Bird Flock background layer
    this.flock = new LacBirdFlock(0xd4af37);
    this.addChild(this.flock);

    // Dynamic Clouds background layer
    this.clouds = [];
    for (let i = 0; i < 3; i++) {
      const cloud = new Graphics();
      this.addChild(cloud);
      this.clouds.push(cloud);
      // Initialize random parameters
      cloud.x = Math.random() * 800;
      cloud.y = 80 + Math.random() * 200;
      cloud.speed = 0.15 + Math.random() * 0.2;
      cloud.w = 100 + Math.random() * 40;
      cloud.h = 45 + Math.random() * 15;
    }

    // Rotating Dong Son watermark layer
    this.dongSonWatermark = new Graphics();
    this.addChild(this.dongSonWatermark);

    // Swaying Hanging Lanterns layer
    this.lanterns = [];
    for (let i = 0; i < 4; i++) {
      const lantern = new Graphics();
      this.addChild(lantern);
      this.lanterns.push(lantern);
    }

    // Screen containers
    this.mainMenuContainer = new Container();
    this.levelSelectContainer = new Container();
    this.achievementsContainer = new Container();
    this.gamePlayContainer = new Container();
    this.gridContainer = new Container();
    this.overlayContainer = new Container();
    this.particles = new ParticleSystem();

    this.addChild(this.gridContainer);
    this.addChild(this.mainMenuContainer);
    this.addChild(this.levelSelectContainer);
    this.addChild(this.achievementsContainer);
    this.addChild(this.gamePlayContainer);
    this.addChild(this.particles);
    this.addChild(this.overlayContainer);

    // Logo Container & Sprite
    this.logoContainer = new Container();
    this.mainMenuContainer.addChild(this.logoContainer);
    this.menuLogoSprite = null;
    this.loadLogo();

    // Styling constants
    this.titleStyle = new TextStyle({
      fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
      fontSize: 32,
      fill: 0xffea00,

      fontWeight: "bold",
    });

    this.infoStyle = new TextStyle({
      fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
      fontSize: 15,
      fill: 0xffecb3,
      fontWeight: "600",
    });

    this.valueStyle = new TextStyle({
      fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
      fontSize: 20,
      fill: 0xffea00,
      fontWeight: "bold",
    });

    // Create UI elements
    this.setupUI();

    // Initialize HTML overlays (Google sign-in and Fullscreen)
    this.initDOMOverlays();

    // Start in MAIN_MENU state
    this.switchState("MAIN_MENU");
  }

  async loadLogo() {
    try {
      const texture = await Assets.load("/logo.png");
      if (this.destroyed) return;
      this.menuLogoSprite = new Sprite(texture);
      this.menuLogoSprite.anchor.set(0.5);
      this.logoContainer.addChild(this.menuLogoSprite);
      this.resize();

      // Slow floating bobbing effect
      gsap.to(this.menuLogoSprite, {
        y: 6,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Gentle breathing/pulsing scale effect
      gsap.to(this.menuLogoSprite.scale, {
        x: 1.05,
        y: 1.05,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    } catch (e) {
      console.error("Error loading logo.png:", e);
    }
  }

  setupUI() {
    // --- 1. MAIN MENU SCREEN ---
    this.menuTitleText = new Text({
      text: "BỘ LẠC KÝ ỨC",
      style: new TextStyle({
        fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
        fontSize: 38,
        fill: new FillGradient({
          end: { x: 0, y: 1 },
          colorStops: [
            { color: 0xffea00, offset: 0 },
            { color: 0xd4af37, offset: 0.5 },
            { color: 0xaa7c11, offset: 1 },
          ],
        }),

        fontWeight: "bold",
        letterSpacing: 2,
      }),
    });
    this.menuTitleText.anchor.set(0.5);
    this.mainMenuContainer.addChild(this.menuTitleText);

    this.menuSubtitleText = new Text({
      text: "TRÒ CHƠI TRÍ NHỚ KÝ THÚ",
      style: new TextStyle({
        fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
        fontSize: 14,
        fill: 0xffecb3,
        fontWeight: "600",
        letterSpacing: 3,
      }),
    });
    this.menuSubtitleText.anchor.set(0.5);
    this.mainMenuContainer.addChild(this.menuSubtitleText);

    this.playBtn = createPlayButton("Chơi Game", () => {
      this.switchState("LEVEL_SELECT");
    });
    this.mainMenuContainer.addChild(this.playBtn);

    this.achievementsBtn = createCircularButton(
      "🏆",
      () => {
        this.switchState("ACHIEVEMENTS");
      },
      "red",
    );
    this.mainMenuContainer.addChild(this.achievementsBtn);

    this.settingsBtn = createCircularButton(
      "⚙️",
      () => {
        this.showSettingsModal(false);
      },
      "red",
    );
    this.mainMenuContainer.addChild(this.settingsBtn);

    // --- 2. LEVEL SELECT SCREEN ---
    this.levelSelectTitle = new Text({
      text: "CHỌN CẤP ĐỘ",
      style: new TextStyle({
        fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
        fontSize: 28,
        fill: new FillGradient({
          end: { x: 0, y: 1 },
          colorStops: [
            { color: 0xffea00, offset: 0 },
            { color: 0xd4af37, offset: 0.5 },
          ],
        }),

        fontWeight: "bold",
        letterSpacing: 1.5,
      }),
    });
    this.levelSelectTitle.anchor.set(0.5);
    this.levelSelectContainer.addChild(this.levelSelectTitle);

    this.levelButtons = [];
    LEVELS.forEach((level, idx) => {
      const btn = createMenuButton(level.name, () => {
        this.currentLevelIndex = idx;
        this.initGame(idx);
        this.switchState("PLAYING");
      });
      this.levelSelectContainer.addChild(btn);
      this.levelButtons.push(btn);
    });

    this.levelBackBtn = createMenuButton("↩️ QUAY LẠI", () => {
      this.switchState("MAIN_MENU");
    });
    this.levelSelectContainer.addChild(this.levelBackBtn);

    // --- 3. ACHIEVEMENTS SCREEN ---
    this.achievementsTitle = new Text({
      text: "BẢNG VÀNG THÀNH TÍCH",
      style: new TextStyle({
        fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
        fontSize: 28,
        fill: new FillGradient({
          end: { x: 0, y: 1 },
          colorStops: [
            { color: 0xffea00, offset: 0 },
            { color: 0xd4af37, offset: 0.5 },
          ],
        }),

        fontWeight: "bold",
        letterSpacing: 1.5,
      }),
    });
    this.achievementsTitle.anchor.set(0.5);
    this.achievementsContainer.addChild(this.achievementsTitle);

    this.achievementsUserText = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
        fontSize: 13,
        fill: 0xffea00,
        fontWeight: "bold",
      }),
    });
    this.achievementsUserText.anchor.set(0.5);
    this.achievementsContainer.addChild(this.achievementsUserText);

    this.achievementsPanel = new Graphics();
    this.achievementsContainer.addChild(this.achievementsPanel);

    // Left and Right arrows to switch levels
    this.achievementsLeftArrow = createCircularButton("◀", () => {
      audio.playFlip();
      this.achievementsLevelIndex =
        (this.achievementsLevelIndex - 1 + LEVELS.length) % LEVELS.length;
      this.updateAchievementsDisplay();
    });
    this.achievementsRightArrow = createCircularButton("▶", () => {
      audio.playFlip();
      this.achievementsLevelIndex =
        (this.achievementsLevelIndex + 1) % LEVELS.length;
      this.updateAchievementsDisplay();
    });
    this.achievementsContainer.addChild(
      this.achievementsLeftArrow,
      this.achievementsRightArrow,
    );

    // Level name label
    this.achievementsLevelLabel = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
        fontSize: 22,
        fill: 0xffea00,
        fontWeight: "bold",
      }),
    });
    this.achievementsLevelLabel.anchor.set(0.5);
    this.achievementsContainer.addChild(this.achievementsLevelLabel);

    // Leaderboard Column Headers
    const headerStyle = new TextStyle({
      fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
      fontSize: 12,
      fill: 0x5c0612,
      fontWeight: "bold",
      align: "center",
    });
    this.achievementsHeaderRank = new Text({
      text: "HẠNG",
      style: headerStyle,
    });
    this.achievementsHeaderScore = new Text({
      text: "ĐIỂM",
      style: headerStyle,
    });
    this.achievementsHeaderMoves = new Text({
      text: "LƯỢT",
      style: headerStyle,
    });
    this.achievementsHeaderTime = new Text({
      text: "T.GIAN",
      style: headerStyle,
    });
    this.achievementsHeaderDate = new Text({
      text: "NGÀY",
      style: headerStyle,
    });

    this.achievementsHeaderRank.anchor.set(0.5, 0);
    this.achievementsHeaderScore.anchor.set(0.5, 0);
    this.achievementsHeaderMoves.anchor.set(0.5, 0);
    this.achievementsHeaderTime.anchor.set(0.5, 0);
    this.achievementsHeaderDate.anchor.set(0.5, 0);

    this.achievementsContainer.addChild(
      this.achievementsHeaderRank,
      this.achievementsHeaderScore,
      this.achievementsHeaderMoves,
      this.achievementsHeaderTime,
      this.achievementsHeaderDate,
    );

    // Container for dynamic rows and its mask
    this.achievementsRowsContainer = new Container();
    this.achievementsRowsContainer.eventMode = "none";
    this.achievementsContainer.addChild(this.achievementsRowsContainer);

    this.achievementsPersonalRankRow = null;

    this.achievementsMask = new Graphics();
    this.achievementsContainer.addChild(this.achievementsMask);
    this.achievementsRowsContainer.mask = this.achievementsMask;

    // Pointer-based touch dragging / swiping scrolling
    this.achievementsPanel.eventMode = "static";
    this.achievementsPanel.cursor = "default";

    let isDragging = false;
    let startY = 0;
    let startContainerY = 0;

    this.achievementsPanel.on("pointerdown", (e) => {
      isDragging = true;
      startY = e.global.y;
      startContainerY = this.achievementsRowsContainer.y;
    });

    this.achievementsPanel.on("globalpointermove", (e) => {
      if (!isDragging) return;
      const diffY = e.global.y - startY;
      let targetY = startContainerY + diffY;

      const minY =
        typeof this.achievementsMinY === "number"
          ? this.achievementsMinY
          : targetY;
      const maxY =
        typeof this.achievementsMaxY === "number"
          ? this.achievementsMaxY
          : targetY;
      targetY = Math.max(minY, Math.min(maxY, targetY));

      this.achievementsRowsContainer.y = targetY;
    });

    const stopDrag = () => {
      isDragging = false;
    };

    this.achievementsPanel.on("pointerup", stopDrag);
    this.achievementsPanel.on("pointerupoutside", stopDrag);
    this.achievementsPanel.on("pointercancel", stopDrag);

    // Mouse wheel scrolling
    this._onWheelScroll = (e) => {
      if (this.gameState !== "ACHIEVEMENTS" || this.destroyed) return;
      let targetY = this.achievementsRowsContainer.y - e.deltaY * 0.45;
      const minY =
        typeof this.achievementsMinY === "number"
          ? this.achievementsMinY
          : targetY;
      const maxY =
        typeof this.achievementsMaxY === "number"
          ? this.achievementsMaxY
          : targetY;
      targetY = Math.max(minY, Math.min(maxY, targetY));

      gsap.to(this.achievementsRowsContainer, {
        y: targetY,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("wheel", this._onWheelScroll, { passive: true });

    this.achievementsBackBtn = createMenuButton("↩️ QUAY LẠI", () => {
      this.switchState("MAIN_MENU");
    });
    this.achievementsContainer.addChild(this.achievementsBackBtn);

    // --- 4. GAMEPLAY SCREEN ---
    this.gameTitleText = new Text({
      text: "BỘ LẠC KÝ ỨC",
      style: new TextStyle({
        fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
        fontSize: 24,
        fill: new FillGradient({
          end: { x: 0, y: 1 },
          colorStops: [
            { color: 0xffea00, offset: 0 },
            { color: 0xd4af37, offset: 0.5 },
          ],
        }),

        fontWeight: "bold",
        letterSpacing: 1,
      }),
    });
    this.gameTitleText.anchor.set(0.5, 0);
    this.gamePlayContainer.addChild(this.gameTitleText);

    // Stats Panel (Score, Moves, Timer)
    this.statsPanel = new Graphics();
    this.gamePlayContainer.addChild(this.statsPanel);

    // Score label and value
    this.scoreLabel = new Text({ text: "ĐIỂM", style: this.infoStyle });
    this.scoreVal = new Text({ text: "0000", style: this.valueStyle });
    this.scoreLabel.anchor.set(0.5);
    this.scoreVal.anchor.set(0.5);
    this.gamePlayContainer.addChild(this.scoreLabel);
    this.gamePlayContainer.addChild(this.scoreVal);

    // Moves label and value
    this.movesLabel = new Text({ text: "LƯỢT ĐI", style: this.infoStyle });
    this.movesVal = new Text({ text: "0", style: this.valueStyle });
    this.movesLabel.anchor.set(0.5);
    this.movesVal.anchor.set(0.5);
    this.gamePlayContainer.addChild(this.movesLabel);
    this.gamePlayContainer.addChild(this.movesVal);

    // Time label and value
    this.timeLabel = new Text({ text: "THỜI GIAN", style: this.infoStyle });
    this.timeVal = new Text({ text: "00:00", style: this.valueStyle });
    this.timeLabel.anchor.set(0.5);
    this.timeVal.anchor.set(0.5);
    this.gamePlayContainer.addChild(this.timeLabel);
    this.gamePlayContainer.addChild(this.timeVal);

    // Progress bar background & fill
    this.timerBarBg = new Graphics();
    this.timerBarFill = new Graphics();
    this.gamePlayContainer.addChild(this.timerBarBg);
    this.gamePlayContainer.addChild(this.timerBarFill);

    // Home, Mute and Restart Buttons
    this.homeButton = createCircularButton("🏠", () => {
      this.isGameOver = true; // halt gameplay loop
      this.switchState("MAIN_MENU");
    });
    this.gamePlayContainer.addChild(this.homeButton);

    this.settingsBtnIngame = createCircularButton(
      "⚙️",
      () => {
        this.showSettingsModal(true);
      },
      "red",
    );
    this.gamePlayContainer.addChild(this.settingsBtnIngame);

    this.restartButton = createCircularButton("🔄", () =>
      this.initGame(this.currentLevelIndex),
    );
    this.gamePlayContainer.addChild(this.restartButton);

    // Hint button (Rewarded Ad)
    this.hintButton = createCircularButton("💡", async () => {
      if (this.isHintActive) return;
      const success = await AdManager.showRewardedVideo();
      if (success) {
        this.isHintActive = true;
        const cardsToFlip = this.cards.filter(
          (c) => !c.isMatched && !c.isFlipped,
        );
        await Promise.all(cardsToFlip.map((c) => c.flip(true)));
        setTimeout(async () => {
          await Promise.all(cardsToFlip.map((c) => c.flip(false)));
          this.isHintActive = false;
        }, 2000);
      }
    });
    this.gamePlayContainer.addChild(this.hintButton);
  }

  switchState(newState) {
    this.gameState = newState;

    this.mainMenuContainer.visible = newState === "MAIN_MENU";
    this.levelSelectContainer.visible = newState === "LEVEL_SELECT";
    this.achievementsContainer.visible = false; // Always false, handled by HTML DOM
    this.gamePlayContainer.visible = newState === "PLAYING";
    this.gridContainer.visible = newState === "PLAYING";

    // Hide or show the user profile widget depending on state to prevent overlapping during gameplay
    const profileWidget = document.getElementById("user-profile");
    if (profileWidget) {
      if (newState === "PLAYING") {
        profileWidget.style.display = "none";
      } else {
        const savedUser = window.localStorage.getItem("google_user");
        if (savedUser) {
          profileWidget.style.display = "flex";
        }
      }
    }

    if (newState !== "PLAYING") {
      this.overlayContainer.removeChildren();
      if (this.victoryIntervalId) {
        clearInterval(this.victoryIntervalId);
        this.victoryIntervalId = null;
      }
      if (this.victoryIntervals) {
        this.victoryIntervals.forEach((id) => clearInterval(id));
        this.victoryIntervals = [];
      }
      if (this.raysTickerFn) {
        this.app.ticker.remove(this.raysTickerFn);
        this.raysTickerFn = null;
      }
      if (this.victoryParadeTickerFn) {
        this.app.ticker.remove(this.victoryParadeTickerFn);
        this.victoryParadeTickerFn = null;
      }
      if (this.victoryTweens) {
        this.victoryTweens.forEach((t) => t.kill());
        this.victoryTweens = [];
      }
    }

    if (newState === "ACHIEVEMENTS") {
      this.showHTMLAchievements();
    } else {
      this.hideHTMLAchievements();
    }

    this.resize();
  }

  updateAchievementsDisplay() {
    if (this.achievementsPersonalRankRow) {
      this.achievementsPersonalRankRow.destroy({ children: true });
      this.achievementsPersonalRankRow = null;
    }

    const effUser = getEffectiveUser();
    if (this.achievementsUserText) {
      if (effUser) {
        this.achievementsUserText.text = `Tài khoản: ${effUser.name} (Đã đăng nhập)`;
        this.achievementsUserText.style.fill = 0xd32f2f;
      } else {
        this.achievementsUserText.text = `Tài khoản: Khách (Điểm lưu thiết bị)`;
        this.achievementsUserText.style.fill = 0x5c0612;
      }
    }

    const config = LEVELS[this.achievementsLevelIndex];
    this.achievementsLevelLabel.text = `BẢNG VÀNG - ${config.name}`;

    // Clear dynamic rows
    this.achievementsRowsContainer.removeChildren().forEach((c) => {
      c.destroy({ children: true });
    });

    const activeKey = currentUser
      ? `${LOCAL_STORAGE_KEY}_${currentUser.id}`
      : LOCAL_STORAGE_KEY;

    // 1. Gather the best run of each profile on this device
    const globalHistory = [];
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key.startsWith(LOCAL_STORAGE_KEY)) {
          const dataStr = window.localStorage.getItem(key);
          if (dataStr) {
            const statsObj = JSON.parse(dataStr);
            let pName = "Khách";
            if (statsObj.userName) {
              pName = statsObj.userName;
            } else if (key.startsWith(`${LOCAL_STORAGE_KEY}_`)) {
              pName = "Người chơi";
            }

            const record =
              statsObj.records && statsObj.records[this.achievementsLevelIndex];
            const history = (record && record.history) || [];
            if (history.length > 0) {
              // The first element is their best run
              const bestRun = history[0];
              globalHistory.push({
                ...bestRun,
                playerName: pName,
                profileKey: key,
              });
            }
          }
        }
      }
    } catch (e) {
      console.error("Error gathering global leaderboard history:", e);
    }

    // Sort global leaderboard: score desc, time asc, moves asc
    globalHistory.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.time !== b.time) return a.time - b.time;
      return a.moves - b.moves;
    });

    // Find the current active profile's best run on this level (first element since history is sorted)
    const currentStats = getStats();
    const currentRecord = currentStats.records[this.achievementsLevelIndex];
    const currentHistory = (currentRecord && currentRecord.history) || [];
    const levelBestRun = currentHistory.length > 0 ? currentHistory[0] : null;

    const cellStyle = new TextStyle({
      fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
      fontSize: 12,
      fill: "#5D4037",
      fontWeight: "bold",
    });

    const highlightedStyle = new TextStyle({
      fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
      fontSize: 12,
      fill: 0xd32f2f,
      fontWeight: "900",
    });

    // Gold, Silver, Bronze styles for top 3
    const top1Style = new TextStyle({
      fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
      fontSize: 12,
      fill: 0x8a6d20, // Gold
      fontWeight: "900",
    });

    const top2Style = new TextStyle({
      fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
      fontSize: 12,
      fill: 0x5a5a5a, // Silver
      fontWeight: "900",
    });

    const top3Style = new TextStyle({
      fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
      fontSize: 12,
      fill: 0x8c5a3c, // Bronze
      fontWeight: "900",
    });

    if (globalHistory.length === 0) {
      const emptyRow = new Container();
      emptyRow.emptyText = new Text({
        text: "Chưa có thành tích kỷ lục.",
        style: new TextStyle({
          fontFamily: '"Outfit", "Nunito", "Arial", sans-serif',
          fontSize: 14,
          fill: "#5D4037",
          align: "center",
        }),
      });
      emptyRow.emptyText.anchor.set(0.5);
      emptyRow.addChild(emptyRow.emptyText);
      this.achievementsRowsContainer.addChild(emptyRow);
    } else {
      // Show top 10 unique players' best runs
      const limit = Math.min(10, globalHistory.length);
      for (let i = 0; i < limit; i++) {
        const run = globalHistory[i];

        // The run belongs to the active profile
        const isCurrentPlayer = run.profileKey === activeKey;
        const isHighlighted = isCurrentPlayer;

        const row = new Container();
        row.isPersonalRankRow = false;
        row.isHighlightedPlayerRun = isHighlighted;

        let style;
        let rankText = `${i + 1}`;

        if (i === 0) {
          style = top1Style;
          rankText = "🥇";
        } else if (i === 1) {
          style = top2Style;
          rankText = "🥈";
        } else if (i === 2) {
          style = top3Style;
          rankText = "🥉";
        } else {
          style = isHighlighted ? highlightedStyle : cellStyle;
        }

        if (isCurrentPlayer) {
          rankText = `${rankText} 👤`;
        }

        const isTop3 = i < 3;
        if (isHighlighted || isTop3) {
          row.bgStripe = new Graphics();
          row.addChild(row.bgStripe);
        }

        row.cellRank = new Text({ text: rankText, style });
        row.cellScore = new Text({ text: `${run.score}`, style });
        row.cellTime = new Text({ text: `${run.time}s`, style });

        row.cellRank.anchor.set(0.5);
        row.cellScore.anchor.set(0.5);
        row.cellTime.anchor.set(0.5);

        row.addChild(row.cellRank, row.cellScore, row.cellTime);
        this.achievementsRowsContainer.addChild(row);
      }

      // Always show player's best run on this level at the bottom as a pinned footer (without the silhouette emoji)
      if (levelBestRun) {
        const userRankIndex = globalHistory.findIndex(
          (run) => run.profileKey === activeKey,
        );

        let rankDisplay = 0;
        if (userRankIndex !== -1) {
          rankDisplay = userRankIndex + 1;
        } else {
          const betterCount = globalHistory.filter((r) => {
            if (r.score !== levelBestRun.score)
              return r.score > levelBestRun.score;
            if (r.time !== levelBestRun.time) return r.time < levelBestRun.time;
            return r.moves < levelBestRun.moves;
          }).length;
          rankDisplay = betterCount + 1;
        }

        const row = new Container();
        row.isPersonalRankRow = true;
        row.isHighlightedPlayerRun = true;

        row.bgStripe = new Graphics();
        row.addChild(row.bgStripe);

        let rankText = `${rankDisplay}`;
        if (rankDisplay === 1) rankText = "🥇";
        else if (rankDisplay === 2) rankText = "🥈";
        else if (rankDisplay === 3) rankText = "🥉";

        row.cellRank = new Text({
          text: rankText,
          style: highlightedStyle,
        });
        row.cellScore = new Text({
          text: `${levelBestRun.score}`,
          style: highlightedStyle,
        });
        row.cellTime = new Text({
          text: `${levelBestRun.time}s`,
          style: highlightedStyle,
        });

        row.cellRank.anchor.set(0.5);
        row.cellScore.anchor.set(0.5);
        row.cellTime.anchor.set(0.5);

        row.addChild(row.cellRank, row.cellScore, row.cellTime);
        this.achievementsPersonalRankRow = row;
        this.achievementsContainer.addChild(row);
      }
    }

    this.achievementsRowsContainer.y = 0;
    this.resize();
  }

  showSettingsModal(isIngame = false) {
    audio.playFlip();
    this.injectHTMLPopupStyles();

    // Prevent duplicate modals
    const existing = document.getElementById("game-settings-overlay-id");
    if (existing) existing.remove();

    if (isIngame) {
      this.isPaused = true;
    }

    const overlay = document.createElement("div");
    overlay.id = "game-settings-overlay-id";
    overlay.className = "game-popup-overlay";

    const card = document.createElement("div");
    card.className = "game-popup-card";

    // Title
    const title = document.createElement("div");
    title.className = "game-popup-title";
    title.innerText = "CÀI ĐẶT GAME";
    card.appendChild(title);

    // Close button (only visible if not ingame pause, or let close button resume)
    if (!isIngame) {
      const closeBtn = document.createElement("button");
      closeBtn.className = "game-popup-close-btn";
      closeBtn.addEventListener("click", () => {
        audio.playFlip();
        overlay.style.opacity = "0";
        card.style.transform = "scale(0.85)";
        setTimeout(() => {
          overlay.remove();
        }, 250);
      });
      card.appendChild(closeBtn);
    }

    const rowContainer = document.createElement("div");
    rowContainer.className = "game-settings-row-container";

    const createToggleRow = (label, isEnabled, onToggle) => {
      const row = document.createElement("div");
      row.style.cssText = `width:100%; height:70px; border-radius:12px; background:#fbfaf5; border:3px solid #fff; display:flex; justify-content:space-between; align-items:center; padding:0 20px; box-sizing:border-box; margin-bottom: 15px;`;

      const text = document.createElement("span");
      text.style.cssText = `font-family:'Fredoka', 'Baloo 2', 'Be Vietnam Pro', sans-serif; font-size:18px; font-weight:bold; color:#47363B; letter-spacing:0.8px; white-space:nowrap;`;
      text.innerText = label;

      const toggle = document.createElement("div");
      const isMuted = !isEnabled;
      toggle.style.cssText = `width:96px; height:46px; border-radius:23px; background:${isMuted ? "#E8E3D8" : "#81C784"}; border:3px solid #fff; box-shadow: inset 0 3px 6px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1); cursor:pointer; position:relative; transition: background 0.25s, transform 0.1s; flex-shrink:0; display:flex; align-items:center;`;

      const statusText = document.createElement("span");
      statusText.innerText = isMuted ? "OFF" : "ON";
      statusText.style.cssText = `color:#fff; font-family:'Impact', 'Arial Black', sans-serif; font-size:18px; position:absolute; width:100%; text-align:center; padding-right:${isMuted ? "0" : "32px"}; padding-left:${isMuted ? "32px" : "0"}; box-sizing:border-box; transition: padding 0.25s; text-shadow: 0 2px 3px rgba(0,0,0,0.4); pointer-events:none;`;

      const knob = document.createElement("div");
      knob.style.cssText = `width:36px; height:36px; border-radius:50%; background:#fff; position:absolute; top:2px; left:${isMuted ? "3px" : "51px"}; transition: left 0.25s cubic-bezier(0.3, 1.2, 0.5, 1); box-shadow: 0 3px 6px rgba(0,0,0,0.4); pointer-events:none;`;

      toggle.appendChild(statusText);
      toggle.appendChild(knob);

      toggle.onclick = () => {
        const newState = onToggle(); // Trả về trạng thái ENABLED sau khi toggle
        const nowMuted = !newState;
        toggle.style.background = nowMuted ? "#E8E3D8" : "#81C784";
        knob.style.left = nowMuted ? "3px" : "51px";
        statusText.innerText = nowMuted ? "OFF" : "ON";
        statusText.style.paddingRight = nowMuted ? "0" : "32px";
        statusText.style.paddingLeft = nowMuted ? "32px" : "0";
      };

      toggle.onmousedown = () => (toggle.style.transform = "scale(0.92)");
      toggle.onmouseup = () => (toggle.style.transform = "scale(1)");
      toggle.onmouseleave = () => (toggle.style.transform = "scale(1)");

      row.appendChild(text);
      row.appendChild(toggle);
      return row;
    };

    // Music row
    const musicRow = createToggleRow("ÂM NHẠC", !audio.musicMuted, () => {
      audio.playFlip();
      audio.toggleMusicMute();
      return !audio.musicMuted;
    });
    rowContainer.appendChild(musicRow);

    // SFX row
    const sfxRow = createToggleRow("HIỆU ỨNG", !audio.sfxMuted, () => {
      audio.playFlip();
      audio.toggleSfxMute();
      return !audio.sfxMuted;
    });
    rowContainer.appendChild(sfxRow);

    card.appendChild(rowContainer);

    // In-game buttons (Home, Replay, Continue)
    if (isIngame) {
      const actionContainer = document.createElement("div");
      actionContainer.className = "game-paused-action-container";

      // Home
      const homeBtn = document.createElement("button");
      homeBtn.className = "game-paused-btn";
      homeBtn.style.backgroundImage = `url(${getIconBtnDataUrl("home", "blue")})`;
      homeBtn.addEventListener("click", () => {
        audio.playFlip();
        overlay.remove();
        this.isGameOver = true;
        this.isPaused = false;
        this.switchState("MAIN_MENU");
      });
      actionContainer.appendChild(homeBtn);

      // Replay
      const replayBtn = document.createElement("button");
      replayBtn.className = "game-paused-btn";
      replayBtn.style.backgroundImage = `url(${getIconBtnDataUrl("replay", "yellow")})`;
      replayBtn.addEventListener("click", () => {
        audio.playFlip();
        overlay.remove();
        this.isPaused = false;
        this.initGame(this.currentLevelIndex);
        this.switchState("PLAYING");
      });
      actionContainer.appendChild(replayBtn);

      // Resume
      const resumeBtn = document.createElement("button");
      resumeBtn.className = "game-paused-btn";
      resumeBtn.style.backgroundImage = `url(${getIconBtnDataUrl("play", "green")})`;
      resumeBtn.addEventListener("click", () => {
        audio.playFlip();
        overlay.remove();
        this.isPaused = false;
      });
      actionContainer.appendChild(resumeBtn);

      card.appendChild(actionContainer);
    }

    overlay.appendChild(card);
    const appContainer = document.getElementById("app") || document.body;
    appContainer.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      card.style.opacity = "1";
      card.style.transform = "scale(1)";
    });
  }

  initGame(levelIndex) {
    this.currentLevelIndex = levelIndex;
    const config = LEVELS[levelIndex];

    this.score = 0;
    this.moves = 0;
    this.matches = 0;
    this.combo = 0;
    this.timeRemaining = config.maxTime;
    this.isGameOver = false;
    this.hasRevivedThisRun = false;
    this.isHintActive = false;
    this.isPaused = false;

    // ── Wink: start a new round ──
    this._winkRound = winkGame.startRound();

    if (this.victoryIntervalId) {
      clearInterval(this.victoryIntervalId);
      this.victoryIntervalId = null;
    }
    if (this.raysTickerFn) {
      this.app.ticker.remove(this.raysTickerFn);
      this.raysTickerFn = null;
    }

    this.selectedCards = [];
    this.particles.clearAll();
    this.overlayContainer.removeChildren();

    // Destroy old cards
    this.cards.forEach((c) => c.destroy());
    this.cards = [];
    this.gridContainer.removeChildren();

    // Shuffle and pick avatars
    const neededPairs = config.pairs;
    const shuffledAvatars = [...AVATAR_FILES].sort(() => Math.random() - 0.5);
    const chosenAvatars = shuffledAvatars.slice(0, neededPairs);

    const cardPool = [];
    chosenAvatars.forEach((avatar, id) => {
      cardPool.push({ id, file: avatar });
      cardPool.push({ id, file: avatar });
    });
    cardPool.sort(() => Math.random() - 0.5);

    const cardW = levelIndex === 2 ? 80 : 95;
    const cardH = levelIndex === 2 ? 105 : 125;
    const spacing = 12;

    cardPool.forEach((item, index) => {
      const col = index % config.cols;
      const row = Math.floor(index / config.cols);

      const card = new Card(item.id, item.file, cardW, cardH, (tappedCard) =>
        this.handleCardTap(tappedCard),
      );

      card.x = col * (cardW + spacing) + cardW / 2;
      card.y = row * (cardH + spacing) + cardH / 2;

      this.gridContainer.addChild(card);
      this.cards.push(card);
    });

    this.updateStatsUI();
    this.resize();
    audio.init();
  }

  handleCardTap(card) {
    if (this.isGameOver || this.selectedCards.length >= 2 || this.isHintActive)
      return;

    this.selectedCards.push(card);
    card.flip(true);

    if (this.selectedCards.length === 2) {
      this.moves++;
      this.movesVal.text = this.moves;

      const [c1, c2] = this.selectedCards;
      if (c1.pairId === c2.pairId) {
        this.matches++;
        this.combo++;

        c1.markMatched();
        c2.markMatched();

        const matchPoints = 100 * this.combo;
        this.score += matchPoints;
        this.scoreVal.text = String(this.score).padStart(4, "0");

        setTimeout(() => {
          this.particles.spawnBurst(
            c1.x + this.gridContainer.x,
            c1.y + this.gridContainer.y,
            25,
          );
          this.particles.spawnBurst(
            c2.x + this.gridContainer.x,
            c2.y + this.gridContainer.y,
            25,
          );
          audio.playMatch();
        }, 300);

        this.selectedCards = [];

        const config = LEVELS[this.currentLevelIndex];
        if (this.matches === config.pairs) {
          this.triggerVictory();
        }
      } else {
        this.combo = 0;
        setTimeout(async () => {
          audio.playFail();
          await Promise.all([c1.flip(false), c2.flip(false)]);
          this.selectedCards = [];
        }, 900);
      }
    }
  }

  triggerVictory() {
    this.isGameOver = true;
    audio.playVictory();

    // ── Wink: complete round + submit score ──
    if (this._winkRound) {
      winkGame.completeRound(this._winkRound, {
        metadata: { outcome: "victory", score: this.score },
      });
      if (winkGame.canSubmitScore) {
        winkGame
          .submitFinalScore({
            score: this.score,
            playTime: Math.round(
              (Date.now() - this._winkRound.startedAtMs) / 1000,
            ),
            gameMode: "classic",
          })
          .catch(() => {});
      }
    }

    // Check for localStorage record updates
    const stats = getStats();
    const prevRecord = stats.records[this.currentLevelIndex];
    let isNewScore = false;
    let isNewMoves = false;
    let isNewTime = false;

    const config = LEVELS[this.currentLevelIndex];
    const elapsedTime = config.maxTime - this.timeRemaining;

    if (this.score > prevRecord.highScore) {
      prevRecord.highScore = this.score;
      isNewScore = true;
    }
    if (this.moves < prevRecord.fewestMoves) {
      prevRecord.fewestMoves = this.moves;
      isNewMoves = true;
    }
    if (elapsedTime < prevRecord.bestTime) {
      prevRecord.bestTime = elapsedTime;
      isNewTime = true;
    }

    // Save victory to top 100 history
    if (!prevRecord.history) {
      prevRecord.history = [];
    }
    const runId = Date.now();
    const newRun = {
      id: runId,
      score: this.score,
      moves: this.moves,
      time: Math.floor(elapsedTime),
      date: new Date().toLocaleDateString("vi-VN"),
    };
    prevRecord.history.push(newRun);

    // Sort: score desc, time asc, moves asc
    prevRecord.history.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.time !== b.time) return a.time - b.time;
      return a.moves - b.moves;
    });

    prevRecord.history = prevRecord.history.slice(0, 100);
    stats.lastRunId = runId;
    stats.totalWins++;
    saveStats(stats);

    const accuracy = Math.round((config.pairs / this.moves) * 100);

    // Continue drawing fireworks behind the HTML UI using PixiJS
    this.overlayContainer.removeChildren(); // clear canvas overlays

    // Spawn Continuous Confetti Fireworks
    this.victoryIntervalId = setInterval(() => {
      if (!this.isGameOver) {
        clearInterval(this.victoryIntervalId);
        return;
      }
      this.particles.spawnBurst(
        Math.random() * this.app.screen.width,
        Math.random() * this.app.screen.height * 0.6,
        18,
      );
    }, 800);

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        if (!this.isGameOver) return;
        this.particles.spawnBurst(
          this.app.screen.width / 2 + (Math.random() - 0.5) * 240,
          this.app.screen.height / 2 + (Math.random() - 0.5) * 240,
          35,
        );
      }, i * 300);
    }

    // BUILD HTML OVERLAY
    const existing = document.getElementById("game-victory-overlay-id");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "game-victory-overlay-id";
    overlay.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:'Outfit', 'Nunito', Arial, sans-serif;overflow:hidden;";

    // Dynamic scaling based on screen size (mimicking Canvas overlayScale)
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const overlayScale = Math.min(1.5, cw / 400, ch / 650);

    // Decorative Lanterns
    const leftLantern = document.createElement("div");
    leftLantern.innerText = "🏮";
    leftLantern.style.cssText =
      "position:absolute; font-size: 48px; left: calc(50% - 210px * " +
      overlayScale +
      "); top: calc(50% - 250px * " +
      overlayScale +
      "); transform: translate(-50%, -50%);";
    const rightLantern = leftLantern.cloneNode(true);
    rightLantern.style.left = "calc(50% + 210px * " + overlayScale + ")";
    overlay.appendChild(leftLantern);
    overlay.appendChild(rightLantern);

    const card = document.createElement("div");
    card.style.cssText = `
      background:#FFF3E0;
      border:5px solid #F57C00;
      border-radius:20px;
      width:380px;
      height:540px;
      display:flex;
      flex-direction:column;
      align-items:center;
      box-shadow:inset 0 0 0 4px #FFCC80, 0 15px 30px rgba(0,0,0,0.5);
      position:relative;
      zoom: ${overlayScale};
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    // SVG definitions for Drum and Lac Birds
    const starPoints = Array.from({ length: 24 }, (_, i) => {
      const r = i % 2 === 0 ? 15 : 6;
      const a = (i * Math.PI) / 12;
      return `${Math.cos(a) * r},${Math.sin(a) * r}`;
    }).join(" ");

    const lacBirdPath = `
      <path d="M 35 -4 L 10 -2 Q 12 -7 8 -8 Q -2 -16 -20 -14 Q -22 -13 -20 -12 Q -4 -10 4 -5 Q -4 2 -12 8 Q -25 14 -40 10 Q -55 15 -68 22 Q -54 11 -44 5 Q -58 12 -70 14 Q -48 5 -38 2 L -32 -3 Q -18 -4 -4 -3 L 10 -4.5 Z" fill="rgba(255,183,77,0.25)" stroke="#FFB74D" stroke-width="1.5" />
      <path d="M -22 0 C -15 -20 -5 -36 10 -45 C -2 -30 -8 -18 -12 -10 Q -16 -18 -20 0 Z" fill="rgba(255,183,77,0.3)" stroke="#FFB74D" stroke-width="1.5" />
      <path d="M 0 -20 L 4 -32 M -4 -16 L -1 -26 M -8 -12 L -5 -20 M -12 -8 L -9 -14" stroke="#FFB74D" stroke-width="1.2" />
      <path d="M -24 5 C -30 16 -36 26 -42 30 Q -32 18 -27 10 Q -29 12 -24 5 Z" fill="rgba(255,183,77,0.3)" stroke="#FFB74D" stroke-width="1.2" />
      <path d="M -28 12 L -34 21 M -26 9 L -31 16" stroke="#FFB74D" stroke-width="1.0" />
      <path d="M 11 -3.2 L 32 -4" stroke="rgba(255,183,77,0.7)" stroke-width="1.0" />
      <circle cx="7" cy="-5" r="2.2" fill="#FFCC80" stroke="#3e2723" stroke-width="0.8" />
      <circle cx="7" cy="-5" r="0.8" fill="#000000" />
      <circle cx="-18" cy="5" r="2.8" fill="none" stroke="#FFB74D" stroke-width="1.0" />
      <circle cx="-18" cy="5" r="1.2" fill="#FFCC80" />
      <circle cx="-28" cy="4" r="2.2" fill="none" stroke="#FFB74D" stroke-width="1.0" />
      <circle cx="-28" cy="4" r="0.8" fill="#FFCC80" />
      <path d="M -35 6 Q -48 15 -58 18 M -32 7 Q -45 17 -55 20" fill="none" stroke="#FFB74D" stroke-width="1.2" />
    `;

    const svgBadge = `
      <svg width="240" height="120" viewBox="-120 -60 240 120" style="margin-top:20px;">
        <defs>
          <radialGradient id="drumGrad" cx="0.5" cy="0.5" r="0.5" fx="0.2" fy="0.2">
            <stop offset="0%" stop-color="#FFCC80" />
            <stop offset="50%" stop-color="#FFB74D" />
            <stop offset="100%" stop-color="#F57C00" />
          </radialGradient>
        </defs>
        <!-- Left Bird -->
        <g transform="translate(-85, 0) scale(-1.4, 1.4)">${lacBirdPath}</g>
        <!-- Right Bird -->
        <g transform="translate(85, 0) scale(1.4, 1.4)">${lacBirdPath}</g>
        <!-- Rotating Drum -->
        <g>
          <circle cx="0" cy="0" r="55" fill="url(#drumGrad)" stroke="#FFCC80" stroke-width="2.8"/>
          <circle cx="0" cy="0" r="46" fill="none" stroke="rgba(255,183,77,0.6)" stroke-width="1.5"/>
          <circle cx="0" cy="0" r="37" fill="none" stroke="rgba(255,183,77,0.5)" stroke-width="1.2"/>
          <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(255,183,77,0.4)" stroke-width="1.0"/>
          <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(255,183,77,0.3)" stroke-width="0.8"/>
          <polygon points="${starPoints}" fill="#FFCC80" stroke="#FFB74D" stroke-width="1"/>
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="16s" repeatCount="indefinite"/>
        </g>
      </svg>
    `;
    const badgeDiv = document.createElement("div");
    badgeDiv.innerHTML = svgBadge;
    badgeDiv.style.position = "relative";
    card.appendChild(badgeDiv);

    // New Record Ribbon
    if (isNewScore || isNewMoves || isNewTime) {
      const ribbon = document.createElement("div");
      ribbon.innerText = "⭐ KỶ LỤC MỚI! ⭐";
      ribbon.style.cssText =
        "background:#F57C00;color:#fff;border:2px solid #FFCC80;border-radius:10px;padding:4px 12px;font-size:10px;font-weight:bold;margin-top:-15px;z-index:2;position:relative;";
      card.appendChild(ribbon);
    } else {
      card.appendChild(document.createElement("div")).style.height = "10px";
    }

    // Stats Grid
    const formatTime = (secs) => {
      const m = Math.floor(secs / 60)
        .toString()
        .padStart(2, "0");
      const s = (secs % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    };

    const statsGrid = document.createElement("div");
    statsGrid.style.cssText =
      "background:rgba(255, 236, 198, 0.85);border:2px solid rgba(211, 47, 47, 0.4);border-radius:12px;width:340px;display:flex;justify-content:space-evenly;padding:15px 0;margin-top:20px;";

    const createStatCol = (icon, label, valueId) => {
      return `
        <div style="display:flex;flex-direction:column;align-items:center;width:25%;">
          <div style="font-size:24px;">${icon}</div>
          <div style="font-size:11px;font-weight:bold;color:#5D4037;margin-top:8px;">${label}</div>
          <div id="${valueId}" style="font-size:22px;font-weight:900;color:#F57C00;margin-top:4px;">0</div>
        </div>
      `;
    };

    statsGrid.innerHTML =
      createStatCol("🏆", "ĐIỂM", "stat-score") +
      createStatCol("🏃", "LƯỢT ĐI", "stat-moves") +
      createStatCol("⏱️", "THỜI GIAN", "stat-time") +
      createStatCol("🎯", "ĐỘ CHÍNH XÁC", "stat-accuracy");

    card.appendChild(statsGrid);

    // Sub congrats text
    const congratsLabel = document.createElement("div");
    congratsLabel.innerText = "Chúc mừng bạn đã chiến thắng!";
    congratsLabel.style.cssText =
      "font-size:14px;color:#F57C00;font-weight:bold;margin-top:15px;";
    card.appendChild(congratsLabel);

    // Tribe title
    const tribeTitle = document.createElement("div");
    tribeTitle.innerText = "— THÀNH VIÊN BỘ LẠC —";
    tribeTitle.style.cssText =
      "font-size:12px;color:#F57C00;font-weight:bold;letter-spacing:1px;margin-top:15px;";
    card.appendChild(tribeTitle);

    // Avatar Strip
    const uniqueAvatars = [...new Set(this.cards.map((c) => c.avatarFile))];
    const repeatedAvatars = [
      ...uniqueAvatars,
      ...uniqueAvatars,
      ...uniqueAvatars,
      ...uniqueAvatars,
    ].slice(0, 16);

    // Add CSS Keyframes to document if not exists
    if (!document.getElementById("avatar-marquee-style")) {
      const style = document.createElement("style");
      style.id = "avatar-marquee-style";
      style.innerHTML = `
        @keyframes scrollAvatarStrip {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-58px * ${uniqueAvatars.length})); }
        }
      `;
      document.head.appendChild(style);
    }

    const stripContainer = document.createElement("div");
    stripContainer.style.cssText =
      "width:340px;height:52px;overflow:hidden;position:relative;margin-top:10px;";

    const stripContent = document.createElement("div");
    stripContent.style.cssText =
      "display:flex;gap:10px;width:max-content;animation:scrollAvatarStrip " +
      uniqueAvatars.length * 2 +
      "s linear infinite;";

    repeatedAvatars.forEach((file) => {
      const imgCont = document.createElement("div");
      imgCont.style.cssText =
        "width:48px;height:48px;border-radius:50%;border:2px solid #FFCC80;background:#fff;display:flex;justify-content:center;align-items:center;box-shadow:0 2px 5px rgba(0,0,0,0.2);overflow:hidden;flex-shrink:0;";
      const img = document.createElement("img");
      img.src = `/assest/image/imagebldp/${file}`;
      img.style.cssText = "width:100%;height:100%;object-fit:cover;";
      img.onerror = () => {
        img.style.display = "none";
      }; // fallback
      imgCont.appendChild(img);
      stripContent.appendChild(imgCont);
    });

    stripContainer.appendChild(stripContent);
    card.appendChild(stripContainer);

    // Bottom Action Buttons
    const btnRow = document.createElement("div");
    btnRow.style.cssText =
      "display:flex;justify-content:center;align-items:center;gap:15px;margin-top:20px;";

    const createIconBtn = (iconUrl, onClick, customBgStyle = "") => {
      const btn = document.createElement("button");
      btn.style.cssText = `
        width: 64px; height: 64px;
        border: none;
        background-color: transparent;
        background-image: url('${iconUrl}');
        background-repeat: no-repeat;
        cursor: pointer;
        transition: transform 0.1s;
        ${customBgStyle || "background-size: contain; background-position: center;"}
      `;
      btn.addEventListener(
        "mousedown",
        () => (btn.style.transform = "scale(0.92)"),
      );
      btn.addEventListener("mouseup", () => (btn.style.transform = "scale(1)"));
      btn.addEventListener(
        "mouseleave",
        () => (btn.style.transform = "scale(1)"),
      );
      btn.addEventListener("click", (e) => {
        audio.playFlip();
        if (onClick) onClick(e);
      });
      return btn;
    };

    // Home
    const btnHome = createIconBtn(getIconBtnDataUrl("home", "blue"), () => {
      audio.playFlip();
      if (this.victoryIntervalId) clearInterval(this.victoryIntervalId);
      overlay.remove();
      this.switchState("MAIN_MENU");
    });

    // Double (x2)
    let hasDoubled = false;
    const btnDouble = createIconBtn(
      getIconBtnDataUrl("x2", "green"),
      async () => {
        if (hasDoubled) return;
        audio.playFlip();
        const success = await AdManager.showRewardedVideo();
        if (success) {
          hasDoubled = true;
          this.score = this.score * 2;
          document.getElementById("stat-score").innerText = this.score;
          btnDouble.style.opacity = "0.5";
          btnDouble.style.pointerEvents = "none";
        }
      },
    );

    // Next / Replay
    const nextIcon =
      this.currentLevelIndex < LEVELS.length - 1
        ? getIconBtnDataUrl("next", "blue")
        : getIconBtnDataUrl("replay", "yellow");
    const btnNext = createIconBtn(nextIcon, () => {
      audio.playFlip();
      if (this.victoryIntervalId) clearInterval(this.victoryIntervalId);
      overlay.remove();
      const nextIdx = (this.currentLevelIndex + 1) % LEVELS.length;
      this.initGame(nextIdx);
      this.switchState("PLAYING");
    });

    btnRow.appendChild(btnHome);
    btnRow.appendChild(btnDouble);
    btnRow.appendChild(btnNext);
    card.appendChild(btnRow);

    overlay.appendChild(card);
    const appContainer = document.getElementById("app") || document.body;
    appContainer.appendChild(overlay);

    const handleResize = () => {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const scale = Math.min(1.5, cw / 400, ch / 650);
      card.style.zoom = scale;
      leftLantern.style.left = "calc(50% - 210px * " + scale + ")";
      leftLantern.style.top = "calc(50% - 250px * " + scale + ")";
      rightLantern.style.left = "calc(50% + 210px * " + scale + ")";
      rightLantern.style.top = "calc(50% - 250px * " + scale + ")";
    };
    window.addEventListener("resize", handleResize);

    const originalRemove = overlay.remove.bind(overlay);
    overlay.remove = () => {
      window.removeEventListener("resize", handleResize);
      originalRemove();
    };

    // Number counting animation
    let curObj = { s: 0, m: 0, t: 0 };
    gsap.to(curObj, {
      s: this.score,
      m: this.moves,
      t: Math.floor(elapsedTime),
      duration: 1.2,
      delay: 0.25,
      ease: "power2.out",
      onUpdate: () => {
        const scoreEl = document.getElementById("stat-score");
        if (scoreEl) scoreEl.innerText = Math.round(curObj.s);
        const movesEl = document.getElementById("stat-moves");
        if (movesEl) movesEl.innerText = Math.round(curObj.m);
        const timeEl = document.getElementById("stat-time");
        if (timeEl) timeEl.innerText = formatTime(Math.round(curObj.t));
      },
    });
    const accEl = document.getElementById("stat-accuracy");
    if (accEl) accEl.innerText = `${accuracy}%`;

    // Entrance animation
    requestAnimationFrame(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    });
  }

  showReviveOffer(onRevive, onSkip) {
    const existing = document.getElementById("game-revive-overlay-id");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "game-revive-overlay-id";
    overlay.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;";

    const card = document.createElement("div");
    card.style.cssText =
      "background:#FFF3E0;border:6px solid #F57C00;border-radius:24px;width:350px;padding:30px;display:flex;flex-direction:column;align-items:center;box-shadow:inset 0 0 0 2.5px #FFCC80, 0 15px 30px rgba(0,0,0,0.5);";

    const title = document.createElement("div");
    title.innerText = "HỒI SINH";
    title.style.cssText =
      "font-size:32px;font-weight:900;color:#F57C00;text-shadow: 0 1px 0 rgba(255,255,255,0.8);margin-bottom:20px;font-family:'Outfit', 'Nunito', 'Segoe UI', Arial, sans-serif;text-align:center;text-transform:uppercase;";

    const heartIcon = document.createElement("div");
    heartIcon.innerText = "💖";
    heartIcon.style.cssText =
      "font-size:110px;line-height:1;margin-bottom:20px;text-shadow:0 10px 20px rgba(0,0,0,0.2), 0 0 30px rgba(255,100,150,0.6);";
    heartIcon.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.2)" },
        { transform: "scale(1)" },
        { transform: "scale(1.2)" },
        { transform: "scale(1)" },
      ],
      { duration: 1200, iterations: Infinity, easing: "ease-in-out" },
    );

    const yesBtn = document.createElement("button");
    yesBtn.style.cssText =
      "background:linear-gradient(to bottom, #FFCC80, #FFB74D);border:none;border-radius:12px;padding:10px 60px;color:white;font-size:26px;font-weight:900;font-family:'Nunito', 'Segoe UI', Arial, sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 0 #F57C00, 0 8px 10px rgba(0,0,0,0.3);transition:transform 0.1s, box-shadow 0.1s;text-transform:uppercase;";

    const tvIcon = document.createElement("img");
    tvIcon.src = "/assest/iconbtn/images.png";
    tvIcon.style.cssText = "height:30px;width:auto;margin-right:15px;";

    const yesText = document.createElement("span");
    yesText.innerText = "CÓ";
    yesText.style.textShadow = "0 2px 4px rgba(0,0,0,0.3)";

    yesBtn.appendChild(tvIcon);
    yesBtn.appendChild(yesText);

    const skipText = document.createElement("div");
    skipText.innerText = "Không, cảm ơn";
    skipText.style.cssText =
      "margin-top:15px;font-family:sans-serif;font-size:16px;color:#888;text-decoration:underline;cursor:pointer;font-weight:bold;";

    card.appendChild(title);
    card.appendChild(heartIcon);
    card.appendChild(yesBtn);
    card.appendChild(skipText);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const cleanup = () => {
      overlay.style.opacity = "0";
      card.style.transform = "scale(0.85)";
      setTimeout(() => overlay.remove(), 250);
    };

    let isHandlingClick = false;
    yesBtn.addEventListener("click", () => {
      if (isHandlingClick) return;
      isHandlingClick = true;
      cleanup();
      onRevive();
    });

    skipText.addEventListener("click", () => {
      if (isHandlingClick) return;
      isHandlingClick = true;
      cleanup();
      onSkip();
    });

    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      card.style.transform = "scale(1)";
    });
  }

  triggerDefeat() {
    this.isGameOver = true;
    audio.playFail();

    if (!this.hasRevivedThisRun) {
      this.showReviveOffer(
        async () => {
          const success = await AdManager.showRewardedVideo();
          if (success) {
            this.hasRevivedThisRun = true;
            this.timeRemaining += 30;
            this.isGameOver = false;
            this.switchState("PLAYING");
          } else {
            this.showDefeatScreen();
          }
        },
        () => {
          this.showDefeatScreen();
        },
      );
    } else {
      this.showDefeatScreen();
    }
  }

  showDefeatScreen() {
    // ── Wink: complete round + submit score (even on defeat, the partial score might count) ──
    if (this._winkRound) {
      winkGame.completeRound(this._winkRound, {
        metadata: { outcome: "defeat", score: this.score },
      });
      if (winkGame.canSubmitScore) {
        winkGame
          .submitFinalScore({
            score: this.score,
            playTime: Math.round(
              (Date.now() - this._winkRound.startedAtMs) / 1000,
            ),
            gameMode: "classic",
          })
          .catch(() => {});
      }
    }

    // 1. Board shake on defeat to make it feel dramatic
    const originalGridX = this.gridContainer.x;
    gsap.fromTo(
      this.gridContainer,
      { x: originalGridX - 10 },
      {
        x: originalGridX + 10,
        duration: 0.05,
        repeat: 10,
        yoyo: true,
        ease: "sine.inOut",
        onComplete: () => {
          this.gridContainer.x = originalGridX;
        },
      },
    );

    const existing = document.getElementById("game-defeat-overlay-id");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "game-defeat-overlay-id";
    overlay.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;";

    const card = document.createElement("div");
    card.style.cssText =
      "background:#FFF3E0;border:6px solid #F57C00;border-radius:24px;width:340px;padding:50px 20px 40px 20px;display:flex;flex-direction:column;align-items:center;box-shadow:inset 0 0 0 2.5px #FFB74D, 0 15px 30px rgba(0,0,0,0.5);position:relative;";

    const ribbon = document.createElement("div");
    ribbon.innerText = "HẾT GIỜ";
    ribbon.style.cssText =
      "position:absolute;top:-25px;left:50%;transform:translateX(-50%);background:linear-gradient(to bottom, #FFF9C4, #FFB74D);color:#F57C00;font-family:'Baloo 2', 'Be Vietnam Pro', sans-serif;font-size:26px;font-weight:900;padding:5px 40px;border-radius:25px;border:3px solid #ffffff;box-shadow:0 6px 0 #F57C00, 0 8px 10px rgba(0,0,0,0.3);white-space:nowrap;letter-spacing:2px;text-shadow:0 1px 2px rgba(255,255,255,0.8);";

    const descText = document.createElement("div");
    descText.innerText = "Hãy thử sức lại nhé!";
    descText.style.cssText =
      "font-family:'Baloo 2', 'Outfit', 'Nunito', sans-serif;font-size:24px;color:#5D4037;text-align:center;line-height:1.6;font-weight:bold;margin-top:10px;margin-bottom:40px;white-space:pre-line;";

    const btnContainer = document.createElement("div");
    btnContainer.style.cssText =
      "display:flex;gap:50px;justify-content:center;align-items:center;";

    const createBtn = (iconUrl, onClick) => {
      const btn = document.createElement("button");
      btn.style.cssText = `width:72px;height:72px;border:none;background:url('${iconUrl}') no-repeat center center;background-size:contain;background-color:transparent;cursor:pointer;transition:transform 0.1s;outline:none;display:flex;align-items:center;justify-content:center;`;
      btn.onpointerdown = () => {
        btn.style.transform = "scale(0.92)";
      };
      btn.onpointerup = () => {
        btn.style.transform = "scale(1)";
      };
      btn.onpointerleave = btn.onpointerup;
      btn.addEventListener("click", () => {
        audio.playFlip();
        onClick();
      });
      return btn;
    };

    const btnHome = createBtn(getIconBtnDataUrl("home", "blue"), () => {
      overlay.remove();
      this.switchState("MAIN_MENU");
    });

    const btnRetry = createBtn(
      getIconBtnDataUrl("replay", "yellow"),
      async () => {
        overlay.remove();
        this.defeatCount = (this.defeatCount || 0) + 1;
        if (this.defeatCount >= 3) {
          this.defeatCount = 0;
          await AdManager.showInterstitial();
        }
        this.initGame(this.currentLevelIndex);
      },
      "#ffca28",
      "#ff8f00",
      "#ffffff",
    );

    btnContainer.appendChild(btnHome);
    btnContainer.appendChild(btnRetry);

    card.appendChild(ribbon);
    card.appendChild(descText);
    card.appendChild(btnContainer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const handleResize = () => {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const scale = Math.min(1.0, cw / 400, ch / 400);
      card.style.zoom = scale;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    const originalRemove = overlay.remove.bind(overlay);
    overlay.remove = () => {
      window.removeEventListener("resize", handleResize);
      originalRemove();
    };

    card.animate(
      [
        { transform: "scale(0.5)", opacity: 0 },
        { transform: "scale(1.05)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 400, easing: "ease-out", fill: "forwards" },
    );
  }

  updateStatsUI() {
    this.scoreVal.text = String(this.score).padStart(4, "0");
    this.movesVal.text = String(this.moves);

    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = Math.floor(this.timeRemaining % 60);
    this.timeVal.text = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const config = LEVELS[this.currentLevelIndex];
    const fillRatio = Math.max(0, this.timeRemaining / config.maxTime);
    this.drawTimerBar(fillRatio);
  }

  drawTimerBar(fillRatio) {
    const w = Math.min(this.app.screen.width * 0.8, 400);
    const h = 6;

    this.timerBarBg.clear().roundRect(0, 0, w, h, 3).fill({ color: 0x360207 });

    this.timerBarFill.clear();
    if (fillRatio > 0) {
      const color = fillRatio < 0.25 ? 0xd32f2f : 0xffea00;
      this.timerBarFill.roundRect(0, 0, w * fillRatio, h, 3).fill(color);
    }
  }

  update(ticker) {
    this.particles.update(ticker);
    this.cards.forEach((c) => c.update(ticker));

    // Update Lạc Bird Flock background animations
    if (this.flock) {
      const sw = this.app.screen.width;
      const sh = this.app.screen.height;
      this.flock.update(ticker.deltaTime, sw, sh);
    }

    // Rotate Dong Son drum watermark slowly
    if (this.dongSonWatermark) {
      this.dongSonWatermark.rotation += 0.0003 * ticker.deltaTime;
    }

    // Sway lanterns
    if (this.lanterns && this.lanterns.length > 0) {
      this.lanternTime = (this.lanternTime || 0) + ticker.deltaTime * 0.02;
      this.lanterns.forEach((lantern, idx) => {
        const phase = idx * 0.5;
        const swayRange = idx >= 2 ? 0.03 : 0.045;
        lantern.rotation = Math.sin(this.lanternTime + phase) * swayRange;
      });
    }

    // Drift clouds
    if (this.clouds && this.clouds.length > 0) {
      this.clouds.forEach((cloud) => {
        cloud.x += cloud.speed * ticker.deltaTime;
        if (cloud.x > this.app.screen.width + cloud.w * 0.6) {
          cloud.x = -cloud.w * 0.6;
          cloud.y = 80 + Math.random() * 200;
        }
      });
    }

    if (!this.isGameOver && this.gameState === "PLAYING" && !this.isPaused) {
      this.timeRemaining -= ticker.elapsedMS / 1000;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.updateStatsUI();
        this.triggerDefeat();
      } else {
        this.updateStatsUI();
      }
    }
  }

  resize() {
    const sw = this.app.screen.width;
    const sh = this.app.screen.height;

    // Draw rich lacquerware background gradient
    const bgGrad = new FillGradient({
      start: { x: 0, y: 0 },
      end: { x: sw, y: sh },
      colorStops: [
        { offset: 0, color: 0x2e080c },
        { offset: 0.5, color: 0x180204 },
        { offset: 1, color: 0x0d0001 },
      ],
    });
    this.bgOverlay.clear().rect(0, 0, sw, sh).fill(bgGrad);

    const cx = sw / 2;
    const cy = sh / 2;
    const maxRadius = Math.min(sw, sh) * 0.45;

    // Draw rotating Dong Son watermark on the dedicated layer
    if (this.dongSonWatermark) {
      this.dongSonWatermark.clear();
      this.dongSonWatermark.position.set(cx, cy);

      this.dongSonWatermark.setStrokeStyle({
        width: 1,
        color: 0xd4af37,
        alpha: 0.05,
      });
      this.dongSonWatermark.circle(0, 0, maxRadius * 0.15).stroke();
      this.dongSonWatermark.circle(0, 0, maxRadius * 0.35).stroke();
      this.dongSonWatermark.circle(0, 0, maxRadius * 0.6).stroke();
      this.dongSonWatermark.circle(0, 0, maxRadius * 0.85).stroke();

      const numRays = 12;
      const rInner = maxRadius * 0.06;
      const rOuter = maxRadius * 0.25;
      this.dongSonWatermark.beginPath();
      for (let i = 0; i < numRays * 2; i++) {
        const angle = (i * Math.PI) / numRays;
        const r = i % 2 === 0 ? rOuter : rInner;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) this.dongSonWatermark.moveTo(px, py);
        else this.dongSonWatermark.lineTo(px, py);
      }
      this.dongSonWatermark.closePath().stroke();
    }

    // Render/Redraw dynamic clouds
    if (this.clouds) {
      this.clouds.forEach((cloud) => {
        cloud.clear();
        cloud.beginPath();
        cloud.setStrokeStyle({ width: 1.0, color: 0xd4af37, alpha: 0.12 });
        cloud.fill({ color: 0xd4af37, alpha: 0.02 });

        const ch = cloud.h;
        const cw = cloud.w;
        cloud
          .circle(0, 0, ch * 0.5)
          .fill()
          .stroke();
        cloud
          .circle(-cw * 0.25, ch * 0.1, ch * 0.35)
          .fill()
          .stroke();
        cloud
          .circle(cw * 0.25, ch * 0.1, ch * 0.35)
          .fill()
          .stroke();

        cloud
          .moveTo(-cw * 0.5, ch * 0.22)
          .lineTo(cw * 0.5, ch * 0.22)
          .stroke();
        cloud
          .moveTo(-cw * 0.35, ch * 0.38)
          .bezierCurveTo(
            -cw * 0.15,
            ch * 0.45,
            cw * 0.15,
            ch * 0.45,
            cw * 0.35,
            ch * 0.38,
          )
          .stroke();
      });
    }

    // Redraw and position swaying lanterns
    if (this.lanterns && this.lanterns.length === 4) {
      const redrawSwayingLantern = (graphics, targetY, width, height) => {
        graphics.clear();
        const rx = width / 2;
        const ry = height / 2;

        // Hanging string from (0, 0)
        graphics
          .moveTo(0, 0)
          .lineTo(0, targetY - ry)
          .stroke({ width: 1, color: 0xd4af37, alpha: 0.5 });

        // Top cap
        graphics
          .roundRect(-rx * 0.4, targetY - ry - 2, rx * 0.8, 4, 1)
          .fill(0xd4af37);

        // Lantern body
        const bodyGrad = new FillGradient({
          start: { x: -rx, y: targetY },
          end: { x: rx, y: targetY },
          colorStops: [
            { offset: 0, color: 0xd32f2f },
            { offset: 0.5, color: 0xff1744 },
            { offset: 1, color: 0xb71c1c },
          ],
        });
        graphics
          .ellipse(0, targetY, rx, ry)
          .fill(bodyGrad)
          .stroke({ width: 1.5, color: 0xd4af37 });

        // Inner ribs
        graphics
          .ellipse(0, targetY, rx * 0.5, ry)
          .stroke({ width: 1, color: 0xd4af37, alpha: 0.4 });
        graphics
          .moveTo(0, targetY - ry)
          .lineTo(0, targetY + ry)
          .stroke({ width: 1, color: 0xd4af37, alpha: 0.4 });

        // Bottom cap
        graphics
          .roundRect(-rx * 0.4, targetY + ry - 2, rx * 0.8, 4, 1)
          .fill(0xd4af37);

        // Tassel string & gold bead
        graphics.circle(0, targetY + ry + 4, 2.5).fill(0xffea00);
        graphics
          .moveTo(0, targetY + ry + 6)
          .lineTo(0, targetY + ry + 20)
          .stroke({ width: 1.5, color: 0xd32f2f });
      };

      // Left main
      this.lanterns[0].position.set(45, 0);
      redrawSwayingLantern(this.lanterns[0], 55, 26, 38);

      // Right main
      this.lanterns[1].position.set(sw - 45, 0);
      redrawSwayingLantern(this.lanterns[1], 55, 26, 38);

      // Left small
      this.lanterns[2].position.set(85, 0);
      redrawSwayingLantern(this.lanterns[2], 35, 18, 26);

      // Right small
      this.lanterns[3].position.set(sw - 85, 0);
    }

    // Draw traditional waves at the bottom of the screen
    this.bgOverlay.save();
    const waveHeight = 12;
    const waveLength = 48;

    this.bgOverlay.setStrokeStyle({ width: 1.2, color: 0xd4af37, alpha: 0.16 });
    const yBase1 = sh - 35;
    for (let x = -waveLength; x < sw + waveLength; x += waveLength) {
      this.bgOverlay
        .moveTo(x, yBase1)
        .bezierCurveTo(
          x + waveLength * 0.25,
          yBase1 - waveHeight,
          x + waveLength * 0.75,
          yBase1 - waveHeight,
          x + waveLength,
          yBase1,
        )
        .stroke();
    }

    this.bgOverlay.setStrokeStyle({ width: 1.0, color: 0xd4af37, alpha: 0.1 });
    const yBase2 = sh - 23;
    for (
      let x = -waveLength - waveLength / 2;
      x < sw + waveLength;
      x += waveLength
    ) {
      this.bgOverlay
        .moveTo(x, yBase2)
        .bezierCurveTo(
          x + waveLength * 0.25,
          yBase2 - waveHeight,
          x + waveLength * 0.75,
          yBase2 - waveHeight,
          x + waveLength,
          yBase2,
        )
        .stroke();
    }
    this.bgOverlay.restore();

    // --- 1. Position MAIN MENU CONTAINER ---
    if (this.gameState === "MAIN_MENU") {
      const scale = Math.min(1.0, sw / 450, sh / 650);
      const logoY = sh * 0.2;
      let logoHeight = 120;

      if (this.menuLogoSprite) {
        this.logoContainer.position.set(sw / 2, logoY);
        const maxH = sh < 500 ? 90 : 160;
        const maxW = Math.min(sw * 0.85, 380);
        const logoScale = Math.min(
          maxH / this.menuLogoSprite.texture.height,
          maxW / this.menuLogoSprite.texture.width,
        );
        this.logoContainer.scale.set(logoScale);
        logoHeight = this.menuLogoSprite.texture.height * logoScale;
      }

      this.menuTitleText.style.fontSize = Math.max(
        20,
        Math.min(38, 38 * scale),
      );
      this.menuSubtitleText.style.fontSize = Math.max(
        10,
        Math.min(14, 14 * scale),
      );

      // Position title and subtitle below emblem
      this.menuTitleText.position.set(
        sw / 2,
        logoY + logoHeight / 2 + 45 * scale,
      );
      this.menuSubtitleText.position.set(
        sw / 2,
        logoY + logoHeight / 2 + 85 * scale,
      );

      // Center large Play button, moving it down to leave breathing room for title
      const titleBottomY = logoY + logoHeight / 2 + 85 * scale;
      const playY = Math.max(titleBottomY + 70 * scale, sh * 0.55);

      const playW = Math.max(90, Math.min(100, 100 * scale));
      const playH = Math.max(90, Math.min(100, 100 * scale));
      if (this.playBtn) {
        this.playBtn.position.set(sw / 2, playY);
        // If it's a square button created by createPlayButton
        if (this.playBtn.updateStyle) {
          this.playBtn.updateStyle(playW, playH);
        }
      }

      // Horizontal row of circular buttons below it (Achievements left, Settings right)
      // Push them to the bottom to fill empty space, but keep safe distance from Play button
      const circY = Math.max(playY + 160 * scale, sh * 0.82);
      const circR = Math.max(22, Math.min(28, 28 * scale));
      const circGap = 50 * scale;

      if (this.achievementsBtn) {
        this.achievementsBtn.position.set(
          sw / 2 - (circR + circGap / 2),
          circY,
        );
        this.achievementsBtn.updateStyle(circR);
      }

      if (this.settingsBtn) {
        this.settingsBtn.position.set(sw / 2 + (circR + circGap / 2), circY);
        this.settingsBtn.updateStyle(circR);
      }
    }

    // --- 2. Position LEVEL SELECT CONTAINER ---
    if (this.gameState === "LEVEL_SELECT") {
      const scale = Math.min(1.0, sw / 450, sh / 650);
      this.levelSelectTitle.style.fontSize = Math.max(
        18,
        Math.min(28, 28 * scale),
      );
      this.levelSelectTitle.position.set(sw / 2, sh * 0.22);

      const btnW = Math.max(180, Math.min(240, 240 * scale));
      const btnH = Math.max(42, Math.min(56, 56 * scale));
      const startY = sh * 0.35;
      const spacing = 12 * scale;

      this.levelButtons.forEach((btn, idx) => {
        btn.position.set(sw / 2, startY + idx * (btnH + spacing));
        btn.updateStyle(btnW, btnH);
      });

      this.levelBackBtn.position.set(
        sw / 2,
        startY + LEVELS.length * (btnH + spacing) + 8 * scale,
      );
      this.levelBackBtn.updateStyle(btnW, btnH, false);
    }

    // --- 3. Position ACHIEVEMENTS CONTAINER ---
    if (this.gameState === "ACHIEVEMENTS") {
      const scale = Math.min(1.0, sw / 450, sh / 650);

      // Static small category title
      this.achievementsTitle.style.fontSize = Math.max(
        24,
        Math.min(32, 32 * scale),
      );
      this.achievementsTitle.position.set(sw / 2, sh * 0.07);

      // Level title and arrows
      const labelY = sh * 0.13;
      this.achievementsLevelLabel.position.set(sw / 2, labelY);
      this.achievementsLevelLabel.style.fontSize = Math.max(
        20,
        Math.min(26, 26 * scale),
      );

      const arrowGap = 35 * scale;
      const labelW = this.achievementsLevelLabel.width;
      const arrowR = Math.max(20, Math.min(26, 26 * scale));

      if (this.achievementsLeftArrow) {
        this.achievementsLeftArrow.position.set(
          sw / 2 - labelW / 2 - arrowGap,
          labelY,
        );
        this.achievementsLeftArrow.updateStyle(arrowR);
      }
      if (this.achievementsRightArrow) {
        this.achievementsRightArrow.position.set(
          sw / 2 + labelW / 2 + arrowGap,
          labelY,
        );
        this.achievementsRightArrow.updateStyle(arrowR);
      }

      // User account details positioned right under
      if (this.achievementsUserText) {
        this.achievementsUserText.style.fontSize = Math.max(
          13,
          Math.min(17, 17 * scale),
        );
        this.achievementsUserText.position.set(sw / 2, labelY + 32 * scale);
      }

      const panelW = Math.min(sw * 0.96, 520);
      const panelY = sh * 0.22;
      const availableH = sh - panelY - 110 * scale;
      const panelH = Math.max(340, Math.min(540, availableH));

      this.achievementsPanel
        .clear()
        .roundRect(sw / 2 - panelW / 2, panelY, panelW, panelH, 12)
        .fill({ color: 0xfffae6, alpha: 0.95 })
        .stroke({ width: 5, color: 0xd32f2f })
        .roundRect(
          sw / 2 - panelW / 2 + 5,
          panelY + 5,
          panelW - 10,
          panelH - 10,
          8,
        )
        .stroke({ width: 1.5, color: 0xffea00 });

      // Column Header positioning
      const headerY = panelY + 14 * scale;
      const colRankX = sw / 2 - panelW * 0.33;
      const colScoreX = sw / 2;
      const colTimeX = sw / 2 + panelW * 0.33;

      this.achievementsHeaderRank.position.set(colRankX, headerY);
      this.achievementsHeaderScore.position.set(colScoreX, headerY);
      this.achievementsHeaderTime.position.set(colTimeX, headerY);

      // Hide unused headers
      this.achievementsHeaderMoves.visible = false;
      this.achievementsHeaderDate.visible = false;

      const headerFontSize = Math.max(18, Math.min(24, 24 * scale));
      this.achievementsHeaderRank.style.fontSize = headerFontSize;
      this.achievementsHeaderScore.style.fontSize = headerFontSize;
      this.achievementsHeaderTime.style.fontSize = headerFontSize;

      // Draw horizontal divider lines
      const hasPersonalRank = !!this.achievementsPersonalRankRow;
      this.achievementsPanel.setStrokeStyle({
        width: 0.8,
        color: 0xd32f2f,
        alpha: 0.35,
      });
      this.achievementsPanel
        .moveTo(sw / 2 - panelW / 2 + 15, panelY + 54 * scale)
        .lineTo(sw / 2 + panelW / 2 - 15, panelY + 54 * scale)
        .stroke();

      if (hasPersonalRank) {
        this.achievementsPanel
          .moveTo(sw / 2 - panelW / 2 + 15, panelY + panelH - 72 * scale)
          .lineTo(sw / 2 + panelW / 2 - 15, panelY + panelH - 72 * scale)
          .stroke();
      }

      // Draw mask for scroll container
      const maskY = panelY + 56 * scale;
      const maskH = hasPersonalRank
        ? panelH - 134 * scale
        : panelH - 74 * scale;

      this.achievementsMask
        .clear()
        .rect(sw / 2 - panelW / 2 + 5, maskY, panelW - 10, maskH)
        .fill(0xffffff);

      // Position each row container and its text elements inside
      const rowStartY = panelY + 98 * scale;
      const rowSpacing = Math.max(58, Math.min(76, 76 * scale));

      // Calculate scroll bounds
      const totalRows = this.achievementsRowsContainer.children.length;
      const contentHeight = totalRows * rowSpacing;
      const firstRowTopOffset = rowStartY - rowSpacing / 2 - maskY;
      const totalContentHeight = firstRowTopOffset + contentHeight;

      if (totalContentHeight <= maskH) {
        this.achievementsMinY = 0;
        this.achievementsMaxY = 0;
      } else {
        this.achievementsMinY = maskH - totalContentHeight;
        this.achievementsMaxY = 0;
      }

      // Clamp scroll container position
      this.achievementsRowsContainer.y = Math.max(
        this.achievementsMinY,
        Math.min(this.achievementsMaxY, this.achievementsRowsContainer.y),
      );

      this.achievementsRowsContainer.children.forEach((row, idx) => {
        const rowY = rowStartY + idx * rowSpacing;
        row.position.set(sw / 2, rowY);

        if (row.emptyText) {
          row.emptyText.position.set(0, panelH / 2 - 40 * scale);
          row.emptyText.style.fontSize = Math.max(20, Math.min(26, 26 * scale));
          return;
        }

        const cellFontSize = Math.max(22, Math.min(30, 30 * scale));

        if (row.cellRank) {
          row.cellRank.position.set(-panelW * 0.33, 0);
          const isMedal = idx === 0 || idx === 1 || idx === 2;
          row.cellRank.style.fontSize = isMedal
            ? Math.max(54, Math.min(72, 72 * scale))
            : cellFontSize;
        }
        if (row.cellScore) {
          row.cellScore.position.set(0, 0);
          row.cellScore.style.fontSize = cellFontSize;
        }
        if (row.cellTime) {
          row.cellTime.position.set(panelW * 0.33, 0);
          row.cellTime.style.fontSize = cellFontSize;
        }

        if (row.bgStripe) {
          let fillColor = 0xffffff;
          let strokeColor = 0xd32f2f;
          let fillAlpha = 0.8;
          let strokeAlpha = 0.2;
          let strokeWidth = 1.0;

          if (row.isHighlightedPlayerRun) {
            // Player's last run inside top 10 (soft yellow-orange highlight with red border)
            fillColor = 0xffecc6;
            fillAlpha = 0.95;
            strokeColor = 0xd32f2f;
            strokeAlpha = 1.0;
            strokeWidth = 1.5;

            if (idx === 0) {
              strokeColor = 0xffea00; // Gold border
              strokeWidth = 2.0;
            } else if (idx === 1) {
              strokeColor = 0xcccccc; // Silver border
              strokeWidth = 1.8;
            } else if (idx === 2) {
              strokeColor = 0xd4a373; // Bronze border
              strokeWidth = 1.6;
            }
          } else {
            // Static Top 3 decorative styles
            if (idx === 0) {
              fillColor = 0xfffae6; // Soft gold
              fillAlpha = 0.95;
              strokeColor = 0xffea00;
              strokeAlpha = 0.8;
              strokeWidth = 2.0;
            } else if (idx === 1) {
              fillColor = 0xf2f2f2; // Soft silver
              fillAlpha = 0.95;
              strokeColor = 0xcccccc;
              strokeAlpha = 0.75;
              strokeWidth = 1.8;
            } else if (idx === 2) {
              fillColor = 0xfaf0e6; // Soft bronze
              fillAlpha = 0.95;
              strokeColor = 0xd4a373;
              strokeAlpha = 0.7;
              strokeWidth = 1.6;
            }
          }

          row.bgStripe
            .clear()
            .roundRect(
              -panelW / 2 + 10,
              -rowSpacing / 2 + 1,
              panelW - 20,
              rowSpacing - 2,
              6,
            )
            .fill({ color: fillColor, alpha: fillAlpha })
            .stroke({
              width: strokeWidth,
              color: strokeColor,
              alpha: strokeAlpha,
            });
        }
      });

      // Position personal rank row separately if it exists (pinned to bottom of panel)
      if (this.achievementsPersonalRankRow) {
        const row = this.achievementsPersonalRankRow;
        const rowY = panelY + panelH - 36 * scale;
        row.position.set(sw / 2, rowY);

        const cellFontSize = Math.max(22, Math.min(30, 30 * scale));

        if (row.cellRank) {
          row.cellRank.position.set(-panelW * 0.33, 0);
          row.cellRank.style.fontSize = cellFontSize;
        }
        if (row.cellScore) {
          row.cellScore.position.set(0, 0);
          row.cellScore.style.fontSize = cellFontSize;
        }
        if (row.cellTime) {
          row.cellTime.position.set(panelW * 0.33, 0);
          row.cellTime.style.fontSize = cellFontSize;
        }

        if (row.bgStripe) {
          row.bgStripe
            .clear()
            .roundRect(
              -panelW / 2 + 10,
              -rowSpacing / 2 + 1,
              panelW - 20,
              rowSpacing - 2,
              6,
            )
            .fill({ color: 0xffecc6, alpha: 0.95 })
            .stroke({
              width: 1.5,
              color: 0xd32f2f,
              alpha: 1.0,
            });
        }
      }

      const btnW = Math.max(180, Math.min(240, 240 * scale));
      const btnH = Math.max(48, Math.min(64, 64 * scale));

      this.achievementsBackBtn.position.set(
        sw / 2,
        panelY + panelH + 50 * scale,
      );
      this.achievementsBackBtn.updateStyle(btnW, btnH, true);
    }

    // --- 4. Position GAMEPLAY CONTAINER ---
    if (this.gameState === "PLAYING") {
      this.gameTitleText.position.set(sw / 2, 20);

      const statsY = 80;
      const statW = 100;
      const statsPadding = 30;
      const totalStatsWidth = statW * 3 + statsPadding * 2;
      const startStatsX = sw / 2 - totalStatsWidth / 2;

      this.statsPanel
        .clear()
        .roundRect(startStatsX - 15, statsY - 12, totalStatsWidth + 30, 60, 10)
        .fill({ color: 0x1b0103, alpha: 0.55 })
        .stroke({ width: 1.2, color: 0xd4af37, alpha: 0.35 });

      this.scoreLabel.position.set(startStatsX + statW / 2, statsY);
      this.scoreVal.position.set(startStatsX + statW / 2, statsY + 24);

      this.movesLabel.position.set(
        startStatsX + statW + statsPadding + statW / 2,
        statsY,
      );
      this.movesVal.position.set(
        startStatsX + statW + statsPadding + statW / 2,
        statsY + 24,
      );

      this.timeLabel.position.set(
        startStatsX + (statW + statsPadding) * 2 + statW / 2,
        statsY,
      );
      this.timeVal.position.set(
        startStatsX + (statW + statsPadding) * 2 + statW / 2,
        statsY + 24,
      );

      const barW = Math.min(sw * 0.8, 400);
      const barX = sw / 2 - barW / 2;
      const barY = statsY + 52;
      this.timerBarBg.position.set(barX, barY);
      this.timerBarFill.position.set(barX, barY);
      this.drawTimerBar(
        this.timeRemaining / LEVELS[this.currentLevelIndex].maxTime,
      );

      const config = LEVELS[this.currentLevelIndex];
      const cardW = this.currentLevelIndex === 2 ? 80 : 95;
      const cardH = this.currentLevelIndex === 2 ? 105 : 125;
      const gridSpacing = 12;

      const gridW = config.cols * cardW + (config.cols - 1) * gridSpacing;
      const gridH = config.rows * cardH + (config.rows - 1) * gridSpacing;

      const startGridY = barY + 25;
      const remainingHeight = sh - startGridY - 60;

      const maxGridW = sw * 0.92;
      const maxGridH = remainingHeight - 40;
      let gridScale = 1.0;
      if (gridW > maxGridW || gridH > maxGridH) {
        gridScale = Math.min(maxGridW / gridW, maxGridH / gridH);
      }
      this.gridContainer.scale.set(gridScale);
      this.gridContainer.x = sw / 2 - (gridW * gridScale) / 2;
      this.gridContainer.y =
        startGridY + Math.max(0, (remainingHeight - gridH * gridScale) / 2);

      const ctrlY = sh - 42;
      const btnRadius = 26;

      this.homeButton.visible = false;
      this.restartButton.visible = false;

      this.settingsBtnIngame.position.set(sw / 2 - 45, ctrlY);
      this.settingsBtnIngame.updateStyle(btnRadius);

      this.hintButton.position.set(sw / 2 + 45, ctrlY);
      this.hintButton.updateStyle(btnRadius);
    }

    if (this.overlayContainer.children.length > 0) {
      const overlay = this.overlayContainer.children[0];
      overlay.x = sw / 2;
      overlay.y = sh / 2;
    }
  }

  initDOMOverlays() {
    // 2. Google Modal Account Items (Fallback mock list)
    const modal = document.getElementById("google-login-modal");
    const accountItems = document.querySelectorAll(".google-account-item");
    accountItems.forEach((item) => {
      item.onclick = () => {
        const accountId = item.getAttribute("data-account");
        let name = "Guest";
        let email = "";
        let avatar = "";

        if (accountId === "laclac") {
          name = "Lạc Lạc (Bơ Lạc)";
          email = "laclac.bolac@gmail.com";
          avatar = "/assest/image/imagebldp/001_avatar_laclac.png";
        } else if (accountId === "dauphong") {
          name = "Đậu Phộng";
          email = "dauphong.bolac@gmail.com";
          avatar = "/assest/image/imagebldp/015_avatar_dauLan.png";
        }

        // Set current user
        currentUser = { id: accountId, name, email, avatar };
        window.localStorage.setItem("google_user", JSON.stringify(currentUser));

        // Hide modal
        if (modal) modal.classList.remove("active");

        // Update UI
        this.updateUserUI();
      };
    });

    // 3. Close Modal Button
    const closeBtn = document.getElementById("google-modal-close-btn");
    if (closeBtn && modal) {
      closeBtn.onclick = () => {
        modal.classList.remove("active");
      };
    }

    // 4. Sign out Button
    const signOutBtn = document.getElementById("user-signout");
    if (signOutBtn) {
      signOutBtn.onclick = () => {
        currentUser = null;
        window.localStorage.removeItem("google_user");
        if (window.parent !== window) {
          window.parent.postMessage({ type: "trigger_google_logout" }, "*");
        }
        this.updateUserUI();
      };
    }

    // 5. Parent Iframe postMessage Bridge
    window.addEventListener("message", (event) => {
      const data = event.data;
      if (data && data.type === "user_profile") {
        const user = data.user; // { id: '...', name: '...', avatar: '...', email: '...' }
        if (user) {
          currentUser = user;
          window.localStorage.setItem(
            "google_user",
            JSON.stringify(currentUser),
          );
        } else {
          currentUser = null;
          window.localStorage.removeItem("google_user");
        }
        this.updateUserUI();
      }
    });

    // If running inside parent iframe, request the logged-in profile immediately
    if (window.parent !== window) {
      window.parent.postMessage({ type: "get_user_profile" }, "*");
    }

    // Load saved user from local storage
    try {
      const savedUser = window.localStorage.getItem("google_user");
      if (savedUser) {
        currentUser = JSON.parse(savedUser);
      }
    } catch (e) {
      console.error("Error loading user profile:", e);
    }

    this.updateUserUI();
  }

  updateUserUI() {
    const profileWidget = document.getElementById("user-profile");
    const avatarImg = document.getElementById("user-avatar");
    const nameSpan = document.getElementById("user-name");

    if (currentUser) {
      // Show profile widget
      if (profileWidget) profileWidget.style.display = "flex";
      if (avatarImg) avatarImg.src = currentUser.avatar;
      if (nameSpan) nameSpan.textContent = currentUser.name;
    } else {
      // Hide profile widget
      if (profileWidget) profileWidget.style.display = "none";
    }

    // Refresh achievements display in case stats changed
    this.updateAchievementsDisplay();
    this.resize();
  }

  showGoogleLoginModal() {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "trigger_google_login" }, "*");
    }
  }

  injectHTMLPopupStyles() {
    if (!document.getElementById("game-popup-shared-styles")) {
      const style = document.createElement("style");
      style.id = "game-popup-shared-styles";
      style.textContent = `
        .game-popup-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100dvw; height: 100dvh;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex; justify-content: center; align-items: center;
          z-index: 100000;
          opacity: 0;
          transition: opacity 0.25s ease;
          box-sizing: border-box;
        }
        .game-popup-card {
          background: #FFF3E0;
          border: 5px solid #F57C00;
          box-shadow: inset 0 0 0 2.5px #FFCC80, 0 6px 0 #8a0000, 0 12px 25px rgba(0, 0, 0, 0.35);
          border-radius: 20px;
          padding: 36px 24px 20px 24px;
          width: 90%; max-width: 380px;
          text-align: center;
          position: relative;
          transform: scale(0.85);
          transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.25s ease;
          font-family: 'Be Vietnam Pro', sans-serif;
          box-sizing: border-box;
          opacity: 0;
        }
        .game-popup-card.wide {
          max-width: 440px;
        }
        .game-popup-title {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(180deg, #ff6b6b 0%, #F57C00 100%);
          border: 2.5px solid #fff8b3;
          border-radius: 12px;
          box-shadow: 0 4px 0 #8a0000;
          color: #ffffff;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 1.5px;
          padding: 6px 32px;
          text-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
          white-space: nowrap;
          text-transform: uppercase;
        }
        .game-popup-close-btn {
          position: absolute;
          top: -16px;
          right: -16px;
          width: 40px;
          height: 40px;
          border: none;
          background: url(/assest/iconbtn/close_btn.png) no-repeat center center;
          background-size: contain;
          cursor: pointer;
          transition: transform 0.15s ease;
          z-index: 100100;
        }
        .game-popup-close-btn:hover {
          transform: scale(1.1);
        }
        .game-popup-close-btn:active {
          transform: scale(0.92);
        }
        .game-settings-row-container {
          margin-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .game-settings-row {
          background: #ffffff;
          border: 3.5px solid #ffccbc;
          border-radius: 15px;
          padding: 10px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          height: 62px;
        }
        .game-settings-label {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #5D4037;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .game-settings-toggle-btn {
          width: 68px;
          height: 42px;
          border: none;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          background-color: transparent;
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .game-settings-toggle-btn:hover {
          transform: scale(1.06);
        }
        .game-settings-toggle-btn:active {
          transform: scale(0.95);
        }
        .game-settings-reset-btn {
          background: linear-gradient(180deg, #ff6b6b 0%, #F57C00 100%);
          border: none;
          box-shadow: 0 4px 0 #8a0000;
          border-radius: 12px;
          color: #ffffff;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 14px;
          font-weight: 800;
          padding: 10px 20px;
          cursor: pointer;
          margin-top: 20px;
          transition: transform 0.1s ease, filter 0.1s ease;
          text-shadow: 0 1px 2px rgba(0,0,0,0.4);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .game-settings-reset-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
        .game-settings-reset-btn:hover {
          transform: scale(1.05);
          filter: brightness(1.05);
        }
        .game-settings-reset-btn:active {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #8a0000;
        }

        /* Paused popup */
        .game-paused-action-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 24px;
        }
        .game-paused-btn {
          width: 52px;
          height: 52px;
          border: none;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          background-color: transparent;
          cursor: pointer;
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .game-paused-btn:hover {
          transform: scale(1.1);
        }
        .game-paused-btn:active {
          transform: scale(0.92);
        }

        /* Achievements popup */
        .game-achievements-user-text {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #5D4037;
          margin: 10px 0;
          text-align: center;
        }
        .game-achievements-user-text.logged-in {
          color: #F57C00;
        }
        .game-achievements-level-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 14px;
        }
        .game-achievements-arrow-btn {
          background: none;
          border: none;
          font-size: 22px;
          color: #F57C00;
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .game-achievements-arrow-btn:hover {
          transform: scale(1.2);
        }
        .game-achievements-level-name {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #e53935;
          min-width: 180px;
          text-align: center;
        }
        .game-achievements-table {
          width: 100%;
          margin-top: 16px;
          border-collapse: collapse;
          font-family: 'Be Vietnam Pro', sans-serif;
        }
        .game-achievements-table th {
          position: sticky;
          top: 0;
          background: #FFF3E0;
          z-index: 10;
          font-size: 12px;
          font-weight: 800;
          color: #5D4037;
          padding: 8px 4px;
          border-bottom: 2px solid #ffccbc;
        }
        .game-achievements-table td {
          font-size: 12px;
          font-weight: 700;
          color: #5D4037;
          padding: 8px 4px;
          text-align: center;
        }
        .game-achievements-table tr.highlighted td {
          color: #F57C00;
          font-weight: 900;
        }
        .game-achievements-table tr.rank-0 td {
          color: #8a6d20;
          font-weight: 900;
        }
        .game-achievements-table tr.rank-1 td {
          color: #5a5a5a;
          font-weight: 900;
        }
        .game-achievements-table tr.rank-2 td {
          color: #8c5a3c;
          font-weight: 900;
        }
        .game-achievements-table tbody tr {
          border-bottom: 1px solid #ffebe6;
        }
        .game-achievements-table tbody tr:last-child {
          border-bottom: none;
        }
        .game-achievements-table-container {
          max-height: min(350px, 50vh);
          overflow-y: auto;
          margin-top: 10px;
          padding-right: 4px;
        }
        .game-achievements-table-container::-webkit-scrollbar {
          width: 6px;
        }
        .game-achievements-table-container::-webkit-scrollbar-track {
          background: #f1ebd8;
          border-radius: 4px;
        }
        .game-achievements-table-container::-webkit-scrollbar-thumb {
          background: #c5beaa;
          border-radius: 4px;
        }
        /* Footer personal best */
        .game-achievements-footer {
          margin-top: 14px;
          background: #fff3cd;
          border: 2px solid #FFCC80;
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 48px;
          box-sizing: border-box;
          font-family: 'Be Vietnam Pro', sans-serif;
        }
        .game-achievements-footer-item {
          font-size: 13px;
          font-weight: 900;
          color: #F57C00;
          width: 33%;
          text-align: center;
        }
        .game-achievements-footer-item:first-child {
          text-align: left;
        }
        .game-achievements-footer-item:last-child {
          text-align: right;
        }
      `;
      document.head.appendChild(style);
    }
  }

  showHTMLAchievements() {
    this.injectHTMLPopupStyles();

    let overlay = document.getElementById("game-achievements-overlay-id");
    let card;
    if (overlay) {
      card = overlay.querySelector(".game-popup-card");
      card.innerHTML = "";
    } else {
      overlay = document.createElement("div");
      overlay.id = "game-achievements-overlay-id";
      overlay.className = "game-popup-overlay";

      card = document.createElement("div");
      card.className = "game-popup-card wide";
      overlay.appendChild(card);
      const appContainer = document.getElementById("app") || document.body;
      appContainer.appendChild(overlay);
    }

    // Ribbon Title
    const title = document.createElement("div");
    title.className = "game-popup-title";
    title.innerText = "BẢNG VÀNG";
    card.appendChild(title);

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "game-popup-close-btn";
    closeBtn.addEventListener("click", () => {
      audio.playFlip();
      this.hideHTMLAchievements();
      this.switchState("MAIN_MENU");
    });
    card.appendChild(closeBtn);

    // User profile status
    const effUser = getEffectiveUser();
    const userText = document.createElement("div");
    userText.className = `game-achievements-user-text${effUser ? " logged-in" : ""}`;
    if (effUser) {
      userText.innerText = `Tài khoản: ${effUser.name} (Đã đăng nhập)`;
    } else {
      userText.innerText = `Tài khoản: Khách (Điểm lưu thiết bị)`;
    }
    card.appendChild(userText);

    // Level Selector
    const levelSelector = document.createElement("div");
    levelSelector.className = "game-achievements-level-selector";

    const leftArrow = document.createElement("button");
    leftArrow.className = "game-achievements-arrow-btn";
    leftArrow.innerText = "◀";
    leftArrow.addEventListener("click", () => {
      audio.playFlip();
      this.achievementsLevelIndex =
        (this.achievementsLevelIndex - 1 + LEVELS.length) % LEVELS.length;
      this.showHTMLAchievements();
    });
    levelSelector.appendChild(leftArrow);

    const levelName = document.createElement("span");
    levelName.className = "game-achievements-level-name";
    levelName.innerText = LEVELS[this.achievementsLevelIndex].name;
    levelSelector.appendChild(levelName);

    const rightArrow = document.createElement("button");
    rightArrow.className = "game-achievements-arrow-btn";
    rightArrow.innerText = "▶";
    rightArrow.addEventListener("click", () => {
      audio.playFlip();
      this.achievementsLevelIndex =
        (this.achievementsLevelIndex + 1) % LEVELS.length;
      this.showHTMLAchievements();
    });
    levelSelector.appendChild(rightArrow);

    card.appendChild(levelSelector);

    // Gather records
    const activeKey = currentUser
      ? `${LOCAL_STORAGE_KEY}_${currentUser.id}`
      : LOCAL_STORAGE_KEY;
    const globalHistory = [];
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key.startsWith(LOCAL_STORAGE_KEY)) {
          const dataStr = window.localStorage.getItem(key);
          if (dataStr) {
            const statsObj = JSON.parse(dataStr);
            let pName = "Khách";
            if (statsObj.userName) {
              pName = statsObj.userName;
            } else if (key.startsWith(`${LOCAL_STORAGE_KEY}_`)) {
              pName = "Người chơi";
            }
            const record =
              statsObj.records && statsObj.records[this.achievementsLevelIndex];
            const history = (record && record.history) || [];
            if (history.length > 0) {
              const bestRun = history[0];
              globalHistory.push({
                ...bestRun,
                playerName: pName,
                profileKey: key,
              });
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    globalHistory.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.time !== b.time) return a.time - b.time;
      return a.moves - b.moves;
    });

    const currentStats = getStats();
    const currentRecord = currentStats.records[this.achievementsLevelIndex];
    const currentHistory = (currentRecord && currentRecord.history) || [];
    const levelBestRun = currentHistory.length > 0 ? currentHistory[0] : null;

    // Table container
    const tableContainer = document.createElement("div");
    tableContainer.className = "game-achievements-table-container";

    const table = document.createElement("table");
    table.className = "game-achievements-table";

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>HẠNG</th>
        <th>TÊN</th>
        <th>ĐIỂM</th>
        <th>LƯỢT VÀ T.GIAN</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    if (globalHistory.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="4" style="padding: 20px; font-style: italic;">Chưa có thành tích kỷ lục.</td>`;
      tbody.appendChild(emptyRow);
    } else {
      const limit = Math.min(10, globalHistory.length);
      for (let i = 0; i < limit; i++) {
        const run = globalHistory[i];
        const isCurrentPlayer = run.profileKey === activeKey;

        let rankDisplay = `${i + 1}`;
        if (i === 0) rankDisplay = "🥇";
        else if (i === 1) rankDisplay = "🥈";
        else if (i === 2) rankDisplay = "🥉";

        if (isCurrentPlayer) {
          rankDisplay = `${rankDisplay} 👤`;
        }

        const row = document.createElement("tr");
        if (isCurrentPlayer) row.className = "highlighted";
        if (i < 3) row.classList.add(`rank-${i}`);

        row.innerHTML = `
          <td>${rankDisplay}</td>
          <td>${run.playerName}</td>
          <td>${run.score}</td>
          <td>${run.moves} lượt (${run.time}s)</td>
        `;
        tbody.appendChild(row);
      }
    }
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    card.appendChild(tableContainer);

    // Personal Best Footer
    if (levelBestRun) {
      const userRankIndex = globalHistory.findIndex(
        (run) => run.profileKey === activeKey,
      );
      let rankDisplay = 0;
      if (userRankIndex !== -1) {
        rankDisplay = userRankIndex + 1;
      } else {
        const betterCount = globalHistory.filter((r) => {
          if (r.score !== levelBestRun.score)
            return r.score > levelBestRun.score;
          if (r.time !== levelBestRun.time) return r.time < levelBestRun.time;
          return r.moves < levelBestRun.moves;
        }).length;
        rankDisplay = betterCount + 1;
      }

      let rankText = `${rankDisplay}`;
      if (rankDisplay === 1) rankText = "🥇";
      else if (rankDisplay === 2) rankText = "🥈";
      else if (rankDisplay === 3) rankText = "🥉";

      const footer = document.createElement("div");
      footer.className = "game-achievements-footer";

      const rankItem = document.createElement("div");
      rankItem.className = "game-achievements-footer-item";
      rankItem.innerText = `PB: Hạng ${rankText}`;
      footer.appendChild(rankItem);

      const scoreItem = document.createElement("div");
      scoreItem.className = "game-achievements-footer-item";
      scoreItem.innerText = `Điểm: ${levelBestRun.score}`;
      footer.appendChild(scoreItem);

      const timeItem = document.createElement("div");
      timeItem.className = "game-achievements-footer-item";
      timeItem.innerText = `${levelBestRun.time}s (${levelBestRun.moves} l)`;
      footer.appendChild(timeItem);

      card.appendChild(footer);
    }

    if (overlay.style.opacity !== "1") {
      requestAnimationFrame(() => {
        overlay.style.opacity = "1";
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
      });
    }
  }

  hideHTMLAchievements() {
    const overlay = document.getElementById("game-achievements-overlay-id");
    if (overlay) {
      const card = overlay.querySelector(".game-popup-card");
      overlay.style.opacity = "0";
      if (card) {
        card.style.opacity = "0";
        card.style.transform = "scale(0.85)";
      }
      setTimeout(() => {
        overlay.remove();
      }, 250);
    }
  }

  destroy(options) {
    if (this._onWheelScroll) {
      window.removeEventListener("wheel", this._onWheelScroll);
    }
    super.destroy(options);
  }
}
