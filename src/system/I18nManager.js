const STORAGE_KEY = "winkgames:bo-lac-ky-uc:language";
const SUPPORTED_LANGUAGES = Object.freeze(["en", "vi"]);

const messages = {
  en: {
    "game.title": "PEANUT MEMORY",
    "game.subtitle": "EXCITING MEMORY GAME",

    "menu.play": "PLAY NOW",
    "menu.leaderboard": "LEADERBOARD",
    "menu.tutorial": "HOW TO PLAY",
    "menu.settings": "SETTINGS",

    "level.title": "SELECT LEVEL",
    "level.easy": "APPRENTICE",
    "level.medium": "CHALLENGE",
    "level.hard": "MASTER",
    "level.pairs": "Pairs",
    "level.easySub": "⏱️ 60s • 8 Pairs (4x4)",
    "level.mediumSub": "⏱️ 90s • 10 Pairs (4x5)",
    "level.hardSub": "⏱️ 150s • 18 Pairs (6x6)",

    "hud.score": "SCORE",
    "hud.moves": "TURNS",
    "hud.time": "TIME",
    "hud.combo": "COMBO",

    "settings.title": "SETTINGS",
    "settings.pauseTitle": "PAUSED",
    "settings.music": "MUSIC",
    "settings.sfx": "SOUND FX",
    "settings.language": "LANGUAGE",
    "settings.version": "Version: 1.0.0",
    "settings.english": "English",
    "settings.vietnamese": "Tiếng Việt",

    "pause.title": "PAUSED",
    "pause.home": "Home",
    "pause.replay": "Replay",
    "pause.resume": "Resume",

    "tutorial.title": "HOW TO PLAY",
    "tutorial.step1Title": "1. FLIP CARDS",
    "tutorial.step1Desc":
      "Tap any 2 cards to reveal members of the Peanut Tribe.",
    "tutorial.step2Title": "2. MATCH & COMBO",
    "tutorial.step2Desc":
      "Matching pairs stay open permanently and award combo bonus points!",
    "tutorial.step3Title": "3. FOCUS & REMEMBER",
    "tutorial.step3Desc":
      "If cards do not match, they flip back after 1s. Remember their positions!",
    "tutorial.step4Title": "4. SMART HINT",
    "tutorial.step4Desc":
      "Tap the bulb 💡 to peek at all cards for 2 seconds when stuck.",
    "tutorial.understood": "UNDERSTOOD",

    "revive.title": "CONTINUE?",
    "revive.skip": "No, thanks",

    "victory.title": "VICTORY!",
    "victory.newRecord": "⭐ NEW RECORD! ⭐",
    "victory.congrats": "Congratulations! You won!",
    "victory.tribeTitle": "— PEANUT TRIBE MEMBERS —",
    "victory.score": "SCORE",
    "victory.moves": "TURNS",
    "victory.time": "TIME",
    "victory.accuracy": "ACCURACY",

    "defeat.title": "TIME'S UP!",

    "leaderboard.title": "LEADERBOARD",
    "leaderboard.rankHeader": "RANK",
    "leaderboard.playerHeader": "NAME",
    "leaderboard.scoreHeader": "SCORE",
    "leaderboard.detailsHeader": "TURNS & TIME",
    "leaderboard.empty": "No record rankings yet.",
    "leaderboard.accountSignedIn": "Account: {name} (Signed in)",
    "leaderboard.memberSignedIn": "Account: Member (Signed in)",
    "leaderboard.guest": "Account: Guest (Saved on device)",
    "leaderboard.turns": "turns",

    "actions.home": "Home",
    "actions.replay": "Replay",
    "actions.next": "Next",
    "actions.back": "Back",
    "actions.double": "Double (x2)",
  },
  vi: {
    "game.title": "BỘ LẠC KÝ ỨC",
    "game.subtitle": "TRÒ CHƠI TRÍ NHỚ KỲ THÚ",

    "menu.play": "CHƠI NGAY",
    "menu.leaderboard": "BẢNG VÀNG",
    "menu.tutorial": "HƯỚNG DẪN",
    "menu.settings": "CÀI ĐẶT",

    "level.title": "CHỌN CẤP ĐỘ",
    "level.easy": "TẬP SỰ",
    "level.medium": "THỬ THÁCH",
    "level.hard": "CAO THỦ",
    "level.pairs": "Cặp",
    "level.easySub": "⏱️ 60s • 8 Cặp (4x4)",
    "level.mediumSub": "⏱️ 90s • 10 Cặp (4x5)",
    "level.hardSub": "⏱️ 150s • 18 Cặp (6x6)",

    "hud.score": "ĐIỂM",
    "hud.moves": "LƯỢT ĐI",
    "hud.time": "THỜI GIAN",
    "hud.combo": "COMBO",

    "settings.title": "CÀI ĐẶT",
    "settings.pauseTitle": "TẠM DỪNG",
    "settings.music": "ÂM NHẠC",
    "settings.sfx": "HIỆU ỨNG",
    "settings.language": "NGÔN NGỮ",
    "settings.version": "Phiên bản: 1.0.0",
    "settings.english": "English",
    "settings.vietnamese": "Tiếng Việt",

    "pause.title": "TẠM DỪNG",
    "pause.home": "Trang chủ",
    "pause.replay": "Chơi lại",
    "pause.resume": "Tiếp tục",

    "tutorial.title": "HƯỚNG DẪN CHƠI",
    "tutorial.step1Title": "1. LẬT MỞ THẺ BÀI",
    "tutorial.step1Desc":
      "Chạm 2 thẻ bài bất kỳ để khám phá hình ảnh các bạn Bộ Lạc Đậu Phộng.",
    "tutorial.step2Title": "2. GHÉP CẶP & COMBO",
    "tutorial.step2Desc":
      "Hai thẻ giống nhau sẽ mở vĩnh viễn và nhận điểm thưởng Combo liên tiếp!",
    "tutorial.step3Title": "3. TẬP TRUNG GHI NHỚ",
    "tutorial.step3Desc":
      "Nếu thẻ khác nhau, bài sẽ tự úp lại sau 1 giây. Hãy ghi nhớ vị trí nhé!",
    "tutorial.step4Title": "4. TRỢ GIÚP THÔNG MINH",
    "tutorial.step4Desc":
      "Bấm nút bóng đèn 💡 để hé mở toàn bộ bài trong 2 giây khi bế tắc.",
    "tutorial.understood": "ĐÃ HIỂU",

    "revive.title": "TIẾP TỤC?",
    "revive.skip": "Không, cảm ơn",

    "victory.title": "CHIẾN THẮNG!",
    "victory.newRecord": "⭐ KỶ LỤC MỚI! ⭐",
    "victory.congrats": "Chúc mừng bạn đã chiến thắng!",
    "victory.tribeTitle": "— THÀNH VIÊN BỘ LẠC —",
    "victory.score": "ĐIỂM",
    "victory.moves": "LƯỢT ĐI",
    "victory.time": "THỜI GIAN",
    "victory.accuracy": "ĐỘ CHÍNH XÁC",

    "defeat.title": "HẾT GIỜ!",

    "leaderboard.title": "BẢNG VÀNG",
    "leaderboard.rankHeader": "HẠNG",
    "leaderboard.playerHeader": "TÊN",
    "leaderboard.scoreHeader": "ĐIỂM",
    "leaderboard.detailsHeader": "LƯỢT VÀ T.GIAN",
    "leaderboard.empty": "Chưa có thành tích kỷ lục.",
    "leaderboard.accountSignedIn": "Tài khoản: {name} (Đã đăng nhập)",
    "leaderboard.memberSignedIn": "Tài khoản: Thành viên (Đã đăng nhập)",
    "leaderboard.guest": "Tài khoản: Khách (Điểm lưu thiết bị)",
    "leaderboard.turns": "lượt",

    "actions.home": "Trang chủ",
    "actions.replay": "Chơi lại",
    "actions.next": "Tiếp tục",
    "actions.back": "Quay lại",
    "actions.double": "Nhân đôi (x2)",
  },
};

function normalizeLanguage(value) {
  if (typeof value !== "string") return null;
  const base = value.trim().toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(base) ? base : null;
}

function readStoredLanguage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return normalizeLanguage(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function readUrlLanguage() {
  try {
    const params = new window.URLSearchParams(window.location.search);
    return normalizeLanguage(
      params.get("locale") || params.get("lang") || params.get("language"),
    );
  } catch {
    return null;
  }
}

function readWinkLanguage(state) {
  return normalizeLanguage(
    state?.locale ||
      state?.language ||
      state?.user?.locale ||
      state?.context?.locale ||
      state?.preferences?.language ||
      state?.preferences?.locale,
  );
}

export class I18nManager {
  constructor() {
    this.hasLocalOverride = Boolean(readStoredLanguage());
    this.language = readStoredLanguage() || readUrlLanguage() || "en";
    this.listeners = new Set();
    this.applyDocumentLanguage();
  }

  get currentLanguage() {
    return this.language;
  }

  applyDocumentLanguage() {
    if (globalThis.document?.documentElement) {
      document.documentElement.lang = this.language;
      const title = this.t("game.documentTitle");
      if (title && title !== "game.documentTitle") {
        document.title = title;
      }
    }
  }

  setLanguage(language, { persist = true } = {}) {
    const normalized = normalizeLanguage(language) || "en";
    if (persist) {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(STORAGE_KEY, normalized);
          this.hasLocalOverride = true;
        }
      } catch {
        // The selected language still applies for this session.
      }
    }
    if (normalized === this.language) return false;
    this.language = normalized;
    this.applyDocumentLanguage();
    for (const listener of this.listeners) {
      try {
        listener(normalized);
      } catch (err) {
        console.error("i18n listener failed:", err);
      }
    }
    return true;
  }

  syncFromWink(state) {
    if (this.hasLocalOverride) return false;
    const platformLanguage = readWinkLanguage(state) || readUrlLanguage();
    if (!platformLanguage) return false;
    return this.setLanguage(platformLanguage, { persist: false });
  }

  t(key, variables = {}) {
    const dict = messages[this.language] || messages.en;
    const template = dict[key] ?? messages.en[key] ?? messages.vi[key] ?? key;
    return String(template).replace(/\{(\w+)\}/g, (_, name) =>
      variables[name] === undefined || variables[name] === null
        ? `{${name}}`
        : String(variables[name]),
    );
  }

  formatNumber(value) {
    const locale = this.language === "vi" ? "vi-VN" : "en-US";
    return Number(value || 0).toLocaleString(locale);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const i18n = new I18nManager();
export const t = (key, variables) => i18n.t(key, variables);
export { SUPPORTED_LANGUAGES };
