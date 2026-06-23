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

const LEVELS = [
  { name: "TẬP SỰ (4x4)", cols: 4, rows: 4, maxTime: 60, pairs: 8 },
  { name: "CHUYÊN GIA (4x5)", cols: 5, rows: 4, maxTime: 90, pairs: 10 },
  { name: "VÔ SONG (6x6)", cols: 6, rows: 6, maxTime: 150, pairs: 18 },
];

const LOCAL_STORAGE_KEY = "bolacdauphong_memory_stats";
let currentUser = null; // Profile of the currently signed-in Google user

// Read records from localStorage
function getStats() {
  try {
    const key = currentUser
      ? `${LOCAL_STORAGE_KEY}_${currentUser.id}`
      : LOCAL_STORAGE_KEY;
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
    const key = currentUser
      ? `${LOCAL_STORAGE_KEY}_${currentUser.id}`
      : LOCAL_STORAGE_KEY;
    window.localStorage.setItem(key, JSON.stringify(stats));
  } catch (e) {
    console.error("Error writing localStorage:", e);
  }
}

// Reusable menu button builder
function createMenuButton(text, onClick) {
  const btn = new Container();
  btn.eventMode = "static";
  btn.cursor = "pointer";

  const bg = new Graphics();
  btn.addChild(bg);

  const label = new Text({
    text: text,
    style: new TextStyle({
      fontFamily: "Outfit, sans-serif",
      fontSize: 15,
      fill: "#ffffff",
      fontWeight: "bold",
      letterSpacing: 1,
    }),
  });
  label.anchor.set(0.5);
  btn.addChild(label);

  btn.bg = bg;
  btn.label = label;
  btn.w = 120;
  btn.h = 32;
  btn.isRed = true;

  btn.updateStyle = (w, h, isRed = true) => {
    btn.w = w;
    btn.h = h;
    btn.isRed = isRed;
    bg.clear()
      .roundRect(-w / 2, -h / 2, w, h, 8)
      .fill({ color: isRed ? 0x5c0612 : 0x1b0103, alpha: 0.9 })
      .stroke({ width: 1.5, color: 0xd4af37 });
  };

  btn.on("pointertap", () => {
    audio.playFlip();
    onClick();
  });

  btn.on("pointerover", () => {
    btn.scale.set(1.05);
    bg.clear()
      .roundRect(-btn.w / 2, -btn.h / 2, btn.w, btn.h, 8)
      .fill({ color: btn.isRed ? 0x5c0612 : 0x1b0103, alpha: 0.95 })
      .stroke({ width: 2.5, color: 0xffea00 });
    label.style.fill = "#ffea00";
  });

  btn.on("pointerout", () => {
    btn.scale.set(1.0);
    bg.clear()
      .roundRect(-btn.w / 2, -btn.h / 2, btn.w, btn.h, 8)
      .fill({ color: btn.isRed ? 0x5c0612 : 0x1b0103, alpha: 0.9 })
      .stroke({ width: 1.5, color: 0xd4af37 });
    label.style.fill = "#ffffff";
  });

  return btn;
}

export class GameController extends Container {
  constructor(app) {
    super();
    this.app = app;

    this.currentLevelIndex = 0;
    this.score = 0;
    this.moves = 0;
    this.matches = 0;
    this.combo = 0;
    this.timeRemaining = 0;
    this.isGameOver = false;
    this.gameState = "MAIN_MENU";

    this.selectedCards = [];
    this.cards = [];

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

    // Logo Sprite
    this.menuLogoSprite = null;
    this.loadLogo();

    // Styling constants
    this.titleStyle = new TextStyle({
      fontFamily: "Outfit, sans-serif",
      fontSize: 32,
      fill: 0xffea00,
      dropShadow: { color: 0x2b050a, blur: 4, distance: 2 },
      fontWeight: "bold",
    });

    this.infoStyle = new TextStyle({
      fontFamily: "Outfit, sans-serif",
      fontSize: 15,
      fill: 0xffecb3,
      fontWeight: "600",
    });

    this.valueStyle = new TextStyle({
      fontFamily: "Outfit, sans-serif",
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
      this.mainMenuContainer.addChild(this.menuLogoSprite);
      this.resize();
    } catch (e) {
      console.error("Error loading logo.png:", e);
    }
  }

  setupUI() {
    // --- 1. MAIN MENU SCREEN ---
    this.menuTitleText = new Text({
      text: "BỘ LẠC KÝ ỨC",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 38,
        fill: new FillGradient({
          end: { x: 0, y: 1 },
          colorStops: [
            { color: 0xffea00, offset: 0 },
            { color: 0xd4af37, offset: 0.5 },
            { color: 0xaa7c11, offset: 1 },
          ],
        }),
        dropShadow: { color: 0x2b050a, blur: 6, distance: 3 },
        fontWeight: "bold",
        letterSpacing: 2,
      }),
    });
    this.menuTitleText.anchor.set(0.5);
    this.mainMenuContainer.addChild(this.menuTitleText);

    this.menuSubtitleText = new Text({
      text: "TRÒ CHƠI TRÍ NHỚ KÝ THÚ",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 14,
        fill: 0xffecb3,
        fontWeight: "600",
        letterSpacing: 3,
      }),
    });
    this.menuSubtitleText.anchor.set(0.5);
    this.mainMenuContainer.addChild(this.menuSubtitleText);

    this.playBtn = createMenuButton("CHƠI NGAY", () => {
      this.initGame(this.currentLevelIndex);
      this.switchState("PLAYING");
    });
    this.mainMenuContainer.addChild(this.playBtn);

    this.levelSelectBtn = createMenuButton("CHỌN CẤP ĐỘ", () => {
      this.switchState("LEVEL_SELECT");
    });
    this.mainMenuContainer.addChild(this.levelSelectBtn);

    this.achievementsBtn = createMenuButton("THÀNH TÍCH", () => {
      this.switchState("ACHIEVEMENTS");
    });
    this.mainMenuContainer.addChild(this.achievementsBtn);

    this.googleLoginBtn = createMenuButton("ĐĂNG NHẬP GOOGLE", () => {
      this.showGoogleLoginModal();
    });
    this.mainMenuContainer.addChild(this.googleLoginBtn);

    // --- 2. LEVEL SELECT SCREEN ---
    this.levelSelectTitle = new Text({
      text: "CHỌN CẤP ĐỘ",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 28,
        fill: new FillGradient({
          end: { x: 0, y: 1 },
          colorStops: [
            { color: 0xffea00, offset: 0 },
            { color: 0xd4af37, offset: 0.5 },
          ],
        }),
        dropShadow: { color: 0x2b050a, blur: 4, distance: 2 },
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

    this.levelBackBtn = createMenuButton("QUAY LẠI", () => {
      this.switchState("MAIN_MENU");
    });
    this.levelSelectContainer.addChild(this.levelBackBtn);

    // --- 3. ACHIEVEMENTS SCREEN ---
    this.achievementsTitle = new Text({
      text: "BẢNG VÀNG THÀNH TÍCH",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 28,
        fill: new FillGradient({
          end: { x: 0, y: 1 },
          colorStops: [
            { color: 0xffea00, offset: 0 },
            { color: 0xd4af37, offset: 0.5 },
          ],
        }),
        dropShadow: { color: 0x2b050a, blur: 4, distance: 2 },
        fontWeight: "bold",
        letterSpacing: 1.5,
      }),
    });
    this.achievementsTitle.anchor.set(0.5);
    this.achievementsContainer.addChild(this.achievementsTitle);

    this.achievementsPanel = new Graphics();
    this.achievementsContainer.addChild(this.achievementsPanel);

    // Guide subtitle for viewing leaderboards
    this.achievementsSub = new Text({
      text: "(Nhấp vào từng cấp độ để xem Bảng Vàng Top 10)",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 11,
        fill: 0xd4af37,
        fontStyle: "italic",
        alpha: 0.85,
      }),
    });
    this.achievementsSub.anchor.set(0.5);
    this.achievementsContainer.addChild(this.achievementsSub);

    this.achievementRows = [];
    this.recordTitleTexts = [];
    this.recordValueTexts = [];

    LEVELS.forEach((level, idx) => {
      const row = new Container();
      row.eventMode = "static";
      row.cursor = "pointer";

      const rowBg = new Graphics();
      row.addChild(rowBg);
      row.bg = rowBg;

      const titleLabel = new Text({
        text: "",
        style: new TextStyle({
          fontFamily: "Outfit, sans-serif",
          fontSize: 15,
          fill: 0xffea00,
          fontWeight: "bold",
          letterSpacing: 1.2,
        }),
      });
      titleLabel.anchor.set(0.5);
      row.addChild(titleLabel);
      row.titleLabel = titleLabel;
      this.recordTitleTexts.push(titleLabel);

      const valueLabel = new Text({
        text: "",
        style: new TextStyle({
          fontFamily: "Outfit, sans-serif",
          fontSize: 12.5,
          fill: 0xffecb3,
          fontWeight: "600",
        }),
      });
      valueLabel.anchor.set(0.5);
      row.addChild(valueLabel);
      row.valueLabel = valueLabel;
      this.recordValueTexts.push(valueLabel);

      // Row hover effects
      row.on("pointerover", () => {
        rowBg
          .clear()
          .roundRect(-row.w / 2, -row.h / 2, row.w, row.h, 6)
          .fill({ color: 0xd4af37, alpha: 0.12 })
          .stroke({ width: 0.8, color: 0xd4af37, alpha: 0.3 });
      });

      row.on("pointerout", () => {
        rowBg.clear();
      });

      row.on("pointertap", () => {
        this.showLeaderboardModal(idx);
      });

      this.achievementsContainer.addChild(row);
      this.achievementRows.push(row);
    });

    this.resetStatsBtn = createMenuButton("XÓA THÀNH TÍCH", () => {
      saveStats({
        totalWins: 0,
        records: {
          0: { highScore: 0, bestTime: 9999, fewestMoves: 999, history: [] },
          1: { highScore: 0, bestTime: 9999, fewestMoves: 999, history: [] },
          2: { highScore: 0, bestTime: 9999, fewestMoves: 999, history: [] },
        },
      });
      this.updateAchievementsDisplay();
    });
    this.achievementsContainer.addChild(this.resetStatsBtn);

    this.achievementsBackBtn = createMenuButton("QUAY LẠI", () => {
      this.switchState("MAIN_MENU");
    });
    this.achievementsContainer.addChild(this.achievementsBackBtn);

    // --- 3.5. LEADERBOARD TOP 10 MODAL OVERLAY ---
    this.leaderboardModal = new Container();
    this.leaderboardModal.visible = false;
    this.achievementsContainer.addChild(this.leaderboardModal);

    this.lbOverlay = new Graphics();
    this.lbOverlay.eventMode = "static"; // Intercept clicks underneath
    this.leaderboardModal.addChild(this.lbOverlay);

    this.lbCard = new Graphics();
    this.leaderboardModal.addChild(this.lbCard);

    this.lbTitle = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 20,
        fill: 0xffea00,
        fontWeight: "bold",
        letterSpacing: 1.5,
        align: "center",
      }),
    });
    this.lbTitle.anchor.set(0.5, 0);
    this.leaderboardModal.addChild(this.lbTitle);

    const headerStyle = new TextStyle({
      fontFamily: "Outfit, sans-serif",
      fontSize: 12,
      fill: 0xd4af37,
      fontWeight: "bold",
      align: "center",
    });

    this.lbHeaderRank = new Text({ text: "HẠNG", style: headerStyle });
    this.lbHeaderScore = new Text({ text: "ĐIỂM", style: headerStyle });
    this.lbHeaderMoves = new Text({ text: "LƯỢT", style: headerStyle });
    this.lbHeaderTime = new Text({ text: "THỜI GIAN", style: headerStyle });
    this.lbHeaderDate = new Text({ text: "NGÀY", style: headerStyle });

    this.lbHeaderRank.anchor.set(0.5, 0);
    this.lbHeaderScore.anchor.set(0.5, 0);
    this.lbHeaderMoves.anchor.set(0.5, 0);
    this.lbHeaderTime.anchor.set(0.5, 0);
    this.lbHeaderDate.anchor.set(0.5, 0);

    this.leaderboardModal.addChild(
      this.lbHeaderRank,
      this.lbHeaderScore,
      this.lbHeaderMoves,
      this.lbHeaderTime,
      this.lbHeaderDate,
    );

    const colStyle = new TextStyle({
      fontFamily: "Outfit, sans-serif",
      fontSize: 11.5,
      fill: 0xffffff,
      align: "center",
      lineHeight: 22,
    });

    this.lbColRank = new Text({ text: "", style: colStyle });
    this.lbColScore = new Text({ text: "", style: colStyle });
    this.lbColMoves = new Text({ text: "", style: colStyle });
    this.lbColTime = new Text({ text: "", style: colStyle });
    this.lbColDate = new Text({ text: "", style: colStyle });

    this.lbColRank.anchor.set(0.5, 0);
    this.lbColScore.anchor.set(0.5, 0);
    this.lbColMoves.anchor.set(0.5, 0);
    this.lbColTime.anchor.set(0.5, 0);
    this.lbColDate.anchor.set(0.5, 0);

    this.leaderboardModal.addChild(
      this.lbColRank,
      this.lbColScore,
      this.lbColMoves,
      this.lbColTime,
      this.lbColDate,
    );

    this.lbCloseBtn = createMenuButton("ĐÓNG", () => {
      this.leaderboardModal.visible = false;
    });
    this.leaderboardModal.addChild(this.lbCloseBtn);

    // --- 4. GAMEPLAY SCREEN ---
    this.gameTitleText = new Text({
      text: "BỘ LẠC KÝ ỨC",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 24,
        fill: new FillGradient({
          end: { x: 0, y: 1 },
          colorStops: [
            { color: 0xffea00, offset: 0 },
            { color: 0xd4af37, offset: 0.5 },
          ],
        }),
        dropShadow: { color: 0x2b050a, blur: 4, distance: 2 },
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
    this.homeButton = new Container();
    this.homeButton.eventMode = "static";
    this.homeButton.cursor = "pointer";
    const homeBg = new Graphics();
    const homeLabel = new Text({
      text: "TRỜ VỀ",
      style: new TextStyle({
        fontFamily: "Outfit",
        fontSize: 12,
        fill: 0xffffff,
      }),
    });
    homeLabel.anchor.set(0.5);
    this.homeButton.addChild(homeBg, homeLabel);
    this.homeButton.bg = homeBg;
    this.homeButton.on("pointertap", () => {
      this.isGameOver = true; // halt gameplay loop
      this.switchState("MAIN_MENU");
    });
    this.gamePlayContainer.addChild(this.homeButton);

    this.muteButton = new Container();
    this.muteButton.eventMode = "static";
    this.muteButton.cursor = "pointer";
    const muteBg = new Graphics();
    this.muteText = new Text({
      text: "ÂM THANH: BẬT",
      style: new TextStyle({
        fontFamily: "Outfit",
        fontSize: 12,
        fill: 0xffffff,
      }),
    });
    this.muteText.anchor.set(0.5);
    this.muteButton.addChild(muteBg, this.muteText);
    this.muteButton.bg = muteBg;
    this.muteButton.on("pointertap", () => {
      const isMuted = audio.toggleMute();
      this.muteText.text = isMuted ? "ÂM THANH: TẮT" : "ÂM THANH: BẬT";
      this.muteButton.bg.tint = isMuted ? 0xd32f2f : 0xffea00;
    });
    this.gamePlayContainer.addChild(this.muteButton);

    this.restartButton = new Container();
    this.restartButton.eventMode = "static";
    this.restartButton.cursor = "pointer";
    const restartBg = new Graphics();
    const restartLabel = new Text({
      text: "LÀM MỚI",
      style: new TextStyle({
        fontFamily: "Outfit",
        fontSize: 12,
        fill: 0xffffff,
      }),
    });
    restartLabel.anchor.set(0.5);
    this.restartButton.addChild(restartBg, restartLabel);
    this.restartButton.bg = restartBg;
    this.restartButton.on("pointertap", () =>
      this.initGame(this.currentLevelIndex),
    );
    this.gamePlayContainer.addChild(this.restartButton);
  }

  switchState(newState) {
    this.gameState = newState;

    this.mainMenuContainer.visible = newState === "MAIN_MENU";
    this.levelSelectContainer.visible = newState === "LEVEL_SELECT";
    this.achievementsContainer.visible = newState === "ACHIEVEMENTS";
    this.gamePlayContainer.visible = newState === "PLAYING";
    this.gridContainer.visible = newState === "PLAYING";

    if (newState !== "PLAYING") {
      this.overlayContainer.removeChildren();
    }

    if (newState === "ACHIEVEMENTS") {
      this.updateAchievementsDisplay();
    }

    this.resize();
  }

  updateAchievementsDisplay() {
    const stats = getStats();
    LEVELS.forEach((level, idx) => {
      const record = stats.records[idx];
      const hasPlayed = record.highScore > 0;

      const scoreStr = hasPlayed ? `${record.highScore} điểm` : "--";
      const movesStr = hasPlayed ? `${record.fewestMoves} lượt` : "--";
      const timeStr =
        hasPlayed && record.bestTime < 9999
          ? `${Math.floor(record.bestTime)} giây`
          : "--";

      this.recordTitleTexts[idx].text = level.name;
      this.recordValueTexts[idx].text =
        `Điểm kỷ lục: ${scoreStr}   •   Lượt đi ít nhất: ${movesStr}   •   Thời gian tốt nhất: ${timeStr}`;
    });
  }

  showLeaderboardModal(levelIndex) {
    audio.playFlip();

    const level = LEVELS[levelIndex];
    const stats = getStats();
    const record = stats.records[levelIndex];
    const history = record.history || [];

    this.leaderboardModal.visible = true;
    this.leaderboardModal.levelIndex = levelIndex;

    this.lbTitle.text = `BẢNG VÀNG - ${level.name.split("(")[0].trim()}`;

    if (history.length === 0) {
      this.lbColRank.text = "";
      this.lbColScore.text = "";
      this.lbColMoves.text = "";
      this.lbColTime.text = "";
      this.lbColDate.text = "Chưa có thành tích kỷ lục.";
    } else {
      let ranks = "";
      let scores = "";
      let moves = "";
      let times = "";
      let dates = "";

      history.forEach((h, idx) => {
        ranks += `${idx + 1}\n`;
        scores += `${h.score}\n`;
        moves += `${h.moves}\n`;
        times += `${h.time}s\n`;
        dates += `${h.date}\n`;
      });

      this.lbColRank.text = ranks;
      this.lbColScore.text = scores;
      this.lbColMoves.text = moves;
      this.lbColTime.text = times;
      this.lbColDate.text = dates;
    }

    this.resize();
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
    if (this.isGameOver || this.selectedCards.length >= 2) return;

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

    // Save victory to top 10 history
    if (!prevRecord.history) {
      prevRecord.history = [];
    }
    const newRun = {
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

    // Keep top 10 records
    prevRecord.history = prevRecord.history.slice(0, 10);

    stats.totalWins++;
    saveStats(stats);

    const accuracy = Math.round((config.pairs / this.moves) * 100);

    const overlay = new Graphics();
    overlay
      .roundRect(0, 0, 360, 240, 16)
      .fill({ color: 0x2b050a, alpha: 0.95 })
      .stroke({ width: 2.5, color: 0xd4af37 });

    const victoryText = new Text({
      text: "CHIẾN THẮNG",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 24,
        fill: 0xffea00,
        fontWeight: "bold",
        letterSpacing: 2,
      }),
    });
    victoryText.anchor.set(0.5);
    victoryText.position.set(180, 36);
    overlay.addChild(victoryText);

    let congratsText = "Chúc mừng bạn đã chiến thắng!";
    if (isNewScore || isNewMoves || isNewTime) {
      congratsText = "⭐ KỶ LỤC MỚI ĐÃ THIẾT LẬP! ⭐";
    }
    const congratsLabel = new Text({
      text: congratsText,
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 12,
        fill: 0xffea00,
        fontWeight: "bold",
      }),
    });
    congratsLabel.anchor.set(0.5);
    congratsLabel.position.set(180, 68);
    overlay.addChild(congratsLabel);

    const scoreLabelText = new Text({
      text: `ĐIỂM SỐ: ${this.score}\nĐỘ CHÍNH XÁC: ${accuracy}%\nSỐ LƯỢT ĐI: ${this.moves}\nTHỜI GIAN: ${Math.floor(elapsedTime)}s`,
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 14,
        fill: 0xffffff,
        align: "center",
        lineHeight: 24,
      }),
    });
    scoreLabelText.anchor.set(0.5);
    scoreLabelText.position.set(180, 122);
    overlay.addChild(scoreLabelText);

    // Play next level / retry button (Right)
    const btnNext = new Container();
    btnNext.eventMode = "static";
    btnNext.cursor = "pointer";
    btnNext.position.set(250, 185);

    const btnNextBg = new Graphics();
    btnNextBg
      .roundRect(-60, -16, 120, 32, 16)
      .fill(0xd32f2f)
      .stroke({ width: 1.5, color: 0xffea00 });

    const btnNextLabel = new Text({
      text:
        this.currentLevelIndex < LEVELS.length - 1 ? "TIẾP THEO" : "CHƠI LẠI",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 11,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    btnNextLabel.anchor.set(0.5);
    btnNext.addChild(btnNextBg, btnNextLabel);
    btnNext.on("pointertap", () => {
      const nextIdx = (this.currentLevelIndex + 1) % LEVELS.length;
      this.initGame(nextIdx);
    });
    overlay.addChild(btnNext);

    // Home button (Left)
    const btnHome = new Container();
    btnHome.eventMode = "static";
    btnHome.cursor = "pointer";
    btnHome.position.set(110, 185);

    const btnHomeBg = new Graphics();
    btnHomeBg
      .roundRect(-60, -16, 120, 32, 16)
      .fill(0x1b0103)
      .stroke({ width: 1.5, color: 0xd4af37 });

    const btnHomeLabel = new Text({
      text: "TRỞ VỀ MENU",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 11,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    btnHomeLabel.anchor.set(0.5);
    btnHome.addChild(btnHomeBg, btnHomeLabel);
    btnHome.on("pointertap", () => this.switchState("MAIN_MENU"));
    overlay.addChild(btnHome);

    overlay.pivot.set(180, 120);
    const overlayScale = Math.min(
      1.0,
      this.app.screen.width / 450,
      this.app.screen.height / 650,
    );
    overlay.scale.set(overlayScale);
    overlay.x = this.app.screen.width / 2;
    overlay.y = this.app.screen.height / 2;

    this.overlayContainer.addChild(overlay);

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.particles.spawnBurst(
          this.app.screen.width / 2 + (Math.random() - 0.5) * 200,
          this.app.screen.height / 2 + (Math.random() - 0.5) * 200,
          35,
        );
      }, i * 300);
    }
  }

  triggerDefeat() {
    this.isGameOver = true;
    audio.playFail();

    const overlay = new Graphics();
    overlay
      .roundRect(0, 0, 360, 220, 16)
      .fill({ color: 0x2b050a, alpha: 0.95 })
      .stroke({ width: 2.5, color: 0xd32f2f });

    const defeatText = new Text({
      text: "HẾT GIỜ",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 24,
        fill: 0xd32f2f,
        fontWeight: "bold",
        letterSpacing: 2,
      }),
    });
    defeatText.anchor.set(0.5);
    defeatText.position.set(180, 45);
    overlay.addChild(defeatText);

    const descText = new Text({
      text: "Đã hết thời gian quy định.\nHãy thử sức lại nhé!",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 16,
        fill: 0xffecb3,
        align: "center",
        lineHeight: 28,
      }),
    });
    descText.anchor.set(0.5);
    descText.position.set(180, 105);
    overlay.addChild(descText);

    // Try again button (Right)
    const btnRetry = new Container();
    btnRetry.eventMode = "static";
    btnRetry.cursor = "pointer";
    btnRetry.position.set(250, 170);

    const btnRetryBg = new Graphics();
    btnRetryBg
      .roundRect(-60, -16, 120, 32, 16)
      .fill(0xd32f2f)
      .stroke({ width: 1.5, color: 0xffea00 });

    const btnRetryLabel = new Text({
      text: "THỬ LẠI",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 11,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    btnRetryLabel.anchor.set(0.5);
    btnRetry.addChild(btnRetryBg, btnRetryLabel);
    btnRetry.on("pointertap", () => this.initGame(this.currentLevelIndex));
    overlay.addChild(btnRetry);

    // Home button (Left)
    const btnHome = new Container();
    btnHome.eventMode = "static";
    btnHome.cursor = "pointer";
    btnHome.position.set(110, 170);

    const btnHomeBg = new Graphics();
    btnHomeBg
      .roundRect(-60, -16, 120, 32, 16)
      .fill(0x1b0103)
      .stroke({ width: 1.5, color: 0xd4af37 });

    const btnHomeLabel = new Text({
      text: "TRỞ VỀ MENU",
      style: new TextStyle({
        fontFamily: "Outfit, sans-serif",
        fontSize: 11,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    btnHomeLabel.anchor.set(0.5);
    btnHome.addChild(btnHomeBg, btnHomeLabel);
    btnHome.on("pointertap", () => this.switchState("MAIN_MENU"));
    overlay.addChild(btnHome);

    overlay.pivot.set(180, 110);
    const overlayScale = Math.min(
      1.0,
      this.app.screen.width / 450,
      this.app.screen.height / 650,
    );
    overlay.scale.set(overlayScale);
    overlay.x = this.app.screen.width / 2;
    overlay.y = this.app.screen.height / 2;

    this.overlayContainer.addChild(overlay);
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

    if (!this.isGameOver && this.gameState === "PLAYING") {
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
      redrawSwayingLantern(this.lanterns[3], 35, 18, 26);
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
      const logoY = sh * 0.16;
      let logoHeight = 120;

      if (this.menuLogoSprite) {
        this.menuLogoSprite.position.set(sw / 2, logoY);
        const maxH = sh < 500 ? 70 : 130;
        const maxW = Math.min(sw * 0.8, 320);
        const logoScale = Math.min(
          maxH / this.menuLogoSprite.texture.height,
          maxW / this.menuLogoSprite.texture.width,
        );
        this.menuLogoSprite.scale.set(logoScale);
        logoHeight = this.menuLogoSprite.height;
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
        logoY + logoHeight / 2 + 35 * scale,
      );
      this.menuSubtitleText.position.set(
        sw / 2,
        logoY + logoHeight / 2 + 70 * scale,
      );

      const btnW = Math.max(150, Math.min(200, 200 * scale));
      const btnH = Math.max(30, Math.min(40, 40 * scale));
      const startY = logoY + logoHeight / 2 + 105 * scale;
      const spacing = 14 * scale;

      this.playBtn.position.set(sw / 2, startY);
      this.playBtn.updateStyle(btnW, btnH);

      this.levelSelectBtn.position.set(sw / 2, startY + btnH + spacing);
      this.levelSelectBtn.updateStyle(btnW, btnH);

      this.achievementsBtn.position.set(sw / 2, startY + (btnH + spacing) * 2);
      this.achievementsBtn.updateStyle(btnW, btnH);

      if (this.googleLoginBtn) {
        this.googleLoginBtn.position.set(sw / 2, startY + (btnH + spacing) * 3);
        this.googleLoginBtn.updateStyle(btnW, btnH, false); // dark gold style
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

      const btnW = Math.max(160, Math.min(220, 220 * scale));
      const btnH = Math.max(30, Math.min(38, 38 * scale));
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
      this.achievementsTitle.style.fontSize = Math.max(
        18,
        Math.min(28, 28 * scale),
      );
      this.achievementsTitle.position.set(sw / 2, sh * 0.18);

      const panelW = Math.min(sw * 0.95, 520);
      const panelH = Math.max(170, Math.min(230, 230 * scale));
      const panelY = sh * 0.25;

      this.achievementsPanel
        .clear()
        .roundRect(sw / 2 - panelW / 2, panelY, panelW, panelH, 12)
        .fill({ color: 0x1b0103, alpha: 0.65 })
        .stroke({ width: 1.5, color: 0xd4af37, alpha: 0.45 });

      // Draw elegant horizontal dividers between levels inside the panel
      const rowH = panelH / 3;
      this.achievementsPanel.setStrokeStyle({
        width: 0.8,
        color: 0xd4af37,
        alpha: 0.22,
      });
      this.achievementsPanel
        .moveTo(sw / 2 - panelW / 2 + 20, panelY + rowH)
        .lineTo(sw / 2 + panelW / 2 - 20, panelY + rowH)
        .stroke()
        .moveTo(sw / 2 - panelW / 2 + 20, panelY + rowH * 2)
        .lineTo(sw / 2 + panelW / 2 - 20, panelY + rowH * 2)
        .stroke();

      // Position the subheading helper
      this.achievementsSub.style.fontSize = Math.max(
        8.5,
        Math.min(11, 11 * scale),
      );
      this.achievementsSub.position.set(sw / 2, panelY - 14 * scale);

      // Position each row container and its text elements inside
      for (let idx = 0; idx < 3; idx++) {
        const row = this.achievementRows[idx];
        const rowCenter = panelY + rowH * idx + rowH / 2;

        row.w = panelW - 6;
        row.h = rowH - 6;
        row.position.set(sw / 2, rowCenter);

        row.titleLabel.style.fontSize = Math.max(11, Math.min(15, 15 * scale));
        row.valueLabel.style.fontSize = Math.max(
          9,
          Math.min(12.5, 12.5 * scale),
        );

        row.titleLabel.position.set(0, -14 * scale);
        row.valueLabel.position.set(0, 14 * scale);

        // Clear hover background to draw correct bounds
        row.bg.clear();
      }

      // Position Leaderboard Modal overlay if visible
      if (this.leaderboardModal && this.leaderboardModal.visible) {
        this.lbOverlay
          .clear()
          .rect(0, 0, sw, sh)
          .fill({ color: 0x000000, alpha: 0.75 });

        const cardW = Math.min(sw * 0.95, 460);
        const cardH = Math.min(sh * 0.72, 420);
        const cardX = sw / 2 - cardW / 2;
        const cardY = sh / 2 - cardH / 2;

        this.lbCard
          .clear()
          .roundRect(cardX, cardY, cardW, cardH, 16)
          .fill({ color: 0x2b050a, alpha: 0.98 })
          .stroke({ width: 2.5, color: 0xd4af37 });

        // Draw horizontal divider line under table header
        const headerLineY = cardY + 75 * scale;
        this.lbCard.setStrokeStyle({
          width: 0.8,
          color: 0xd4af37,
          alpha: 0.22,
        });
        this.lbCard
          .moveTo(cardX + 15, headerLineY)
          .lineTo(cardX + cardW - 15, headerLineY)
          .stroke();

        // Title
        this.lbTitle.style.fontSize = Math.max(16, Math.min(22, 22 * scale));
        this.lbTitle.position.set(sw / 2, cardY + 22 * scale);

        // Header column X distribution
        const colPad = cardW / 5;
        const headerY = cardY + 54 * scale;

        this.lbHeaderRank.style.fontSize = Math.max(
          10,
          Math.min(12, 12 * scale),
        );
        this.lbHeaderScore.style.fontSize = Math.max(
          10,
          Math.min(12, 12 * scale),
        );
        this.lbHeaderMoves.style.fontSize = Math.max(
          10,
          Math.min(12, 12 * scale),
        );
        this.lbHeaderTime.style.fontSize = Math.max(
          10,
          Math.min(12, 12 * scale),
        );
        this.lbHeaderDate.style.fontSize = Math.max(
          10,
          Math.min(12, 12 * scale),
        );

        this.lbHeaderRank.position.set(cardX + colPad * 0.45, headerY);
        this.lbHeaderScore.position.set(cardX + colPad * 1.35, headerY);
        this.lbHeaderMoves.position.set(cardX + colPad * 2.3, headerY);
        this.lbHeaderTime.position.set(cardX + colPad * 3.25, headerY);
        this.lbHeaderDate.position.set(cardX + colPad * 4.2, headerY);

        // Table body font size and vertical Y start
        const colFontSize = Math.max(9, Math.min(11.5, 11.5 * scale));
        this.lbColRank.style.fontSize = colFontSize;
        this.lbColScore.style.fontSize = colFontSize;
        this.lbColMoves.style.fontSize = colFontSize;
        this.lbColTime.style.fontSize = colFontSize;
        this.lbColDate.style.fontSize = colFontSize;

        const tableStartY = cardY + 86 * scale;

        const record = getStats().records[this.leaderboardModal.levelIndex];
        const hasHistory =
          record && record.history && record.history.length > 0;

        if (!hasHistory) {
          this.lbColDate.position.set(sw / 2, cardY + cardH / 2 - 10 * scale);
        } else {
          this.lbColRank.position.set(cardX + colPad * 0.45, tableStartY);
          this.lbColScore.position.set(cardX + colPad * 1.35, tableStartY);
          this.lbColMoves.position.set(cardX + colPad * 2.3, tableStartY);
          this.lbColTime.position.set(cardX + colPad * 3.25, tableStartY);
          this.lbColDate.position.set(cardX + colPad * 4.2, tableStartY);
        }

        // Close button
        const closeBtnW = Math.max(110, Math.min(140, 140 * scale));
        const closeBtnH = Math.max(28, Math.min(34, 34 * scale));
        this.lbCloseBtn.position.set(sw / 2, cardY + cardH - 30 * scale);
        this.lbCloseBtn.updateStyle(closeBtnW, closeBtnH);
      }

      const btnW = Math.max(120, Math.min(160, 160 * scale));
      const btnH = Math.max(28, Math.min(36, 36 * scale));
      this.resetStatsBtn.position.set(
        sw / 2 - 90 * scale,
        panelY + panelH + 25 * scale,
      );
      this.resetStatsBtn.updateStyle(btnW, btnH, false);

      this.achievementsBackBtn.position.set(
        sw / 2 + 90 * scale,
        panelY + panelH + 25 * scale,
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

      const ctrlY = sh - 35;
      const ctrlBtnW = 100;
      const ctrlBtnH = 26;

      this.homeButton.position.set(sw / 2 - 120, ctrlY);
      this.homeButton.bg
        .clear()
        .roundRect(-ctrlBtnW / 2, -ctrlBtnH / 2, ctrlBtnW, ctrlBtnH, 13)
        .fill({ color: 0x360207, alpha: 0.85 })
        .stroke({ width: 1.5, color: 0xd4af37 });

      this.muteButton.position.set(sw / 2, ctrlY);
      this.muteButton.bg
        .clear()
        .roundRect(-ctrlBtnW / 2, -ctrlBtnH / 2, ctrlBtnW, ctrlBtnH, 13)
        .fill({ color: 0x360207, alpha: 0.85 })
        .stroke({ width: 1.5, color: audio.isMuted ? 0xd32f2f : 0xffea00 });
      this.restartButton.position.set(sw / 2 + 120, ctrlY);
      this.restartButton.bg
        .clear()
        .roundRect(-ctrlBtnW / 2, -ctrlBtnH / 2, ctrlBtnW, ctrlBtnH, 13)
        .fill({ color: 0x360207, alpha: 0.85 })
        .stroke({ width: 1.5, color: 0xffea00 });
    }

    if (this.overlayContainer.children.length > 0) {
      const overlay = this.overlayContainer.children[0];
      overlay.x = sw / 2;
      overlay.y = sh / 2;
    }
  }

  initDOMOverlays() {
    // 1. Fullscreen Button
    const fsBtn = document.getElementById("fullscreen-btn");
    if (fsBtn) {
      fsBtn.onclick = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.error("Error attempting to enable fullscreen:", err);
          });
        } else {
          document.exitFullscreen();
        }
      };
    }

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

    // 6. Real Google Identity Services (GSI) Integration with polling fallback
    const initRealGoogleSignIn = () => {
      try {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id:
              import.meta.env.VITE_GOOGLE_CLIENT_ID ||
              "55776077309-8pco7q4b260ghldp.apps.googleusercontent.com",
            callback: (response) => {
              try {
                const jwt = response.credential;
                const base64Url = jwt.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                  window
                    .atob(base64)
                    .split("")
                    .map(
                      (c) =>
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2),
                    )
                    .join(""),
                );
                const payload = JSON.parse(jsonPayload);
                currentUser = {
                  id: payload.sub,
                  name: payload.name,
                  avatar: payload.picture,
                  email: payload.email,
                };
                window.localStorage.setItem(
                  "google_user",
                  JSON.stringify(currentUser),
                );

                if (modal) modal.classList.remove("active");

                // Notify parent of successful login
                if (window.parent !== window) {
                  window.parent.postMessage(
                    { type: "google_login_success", user: currentUser },
                    "*",
                  );
                }
                this.updateUserUI();
              } catch (err) {
                console.error("Failed to parse Google JWT credential:", err);
              }
            },
          });

          // Render the official Google Sign-in button
          const realBtnContainer = document.getElementById(
            "google-real-signin-btn",
          );
          if (realBtnContainer) {
            window.google.accounts.id.renderButton(realBtnContainer, {
              theme: "outline",
              size: "large",
              width: 260,
            });
          }
        } else {
          // If not loaded yet, retry in 100ms
          setTimeout(initRealGoogleSignIn, 100);
        }
      } catch (e) {
        console.warn("GSI client initialization was blocked or failed:", e);
      }
    };
    initRealGoogleSignIn();

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

      // Hide Google Sign In button in menu if it exists
      if (this.googleLoginBtn) {
        this.googleLoginBtn.visible = false;
      }
    } else {
      // Hide profile widget
      if (profileWidget) profileWidget.style.display = "none";

      // Show Google Sign In button in menu
      if (this.googleLoginBtn) {
        this.googleLoginBtn.visible = true;
      }
    }

    // Refresh achievements display in case stats changed
    this.updateAchievementsDisplay();
    this.resize();
  }

  showGoogleLoginModal() {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "trigger_google_login" }, "*");
    } else {
      const modal = document.getElementById("google-login-modal");
      if (modal) {
        modal.classList.add("active");
      }
    }
  }
}
