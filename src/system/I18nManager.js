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
    "settings.music": "MUSIC",
    "settings.sfx": "SOUND FX",
    "settings.language": "LANGUAGE",
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

    "settings.title": "CÀI ĐẶT GAME",
    "settings.music": "ÂM NHẠC",
    "settings.sfx": "HIỆU ỨNG",
    "settings.language": "NGÔN NGỮ",
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

function readBrowserLanguage() {
  if (typeof window === "undefined" || !window.navigator) return null;
  const candidates = [
    window.navigator.language,
    ...(window.navigator.languages || []),
  ];
  for (const item of candidates) {
    const norm = normalizeLanguage(item);
    if (norm) return norm;
  }
  return null;
}

export class I18nManager {
  constructor() {
    this.currentLanguage =
      readUrlLanguage() ||
      readStoredLanguage() ||
      readBrowserLanguage() ||
      "vi";
    this.listeners = new Set();
  }

  get language() {
    return this.currentLanguage;
  }

  t(key, params = {}) {
    const dict = messages[this.currentLanguage] || messages.vi;
    const template = dict[key] || messages.vi[key] || messages.en[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) =>
      params[name] !== undefined ? params[name] : `{${name}}`,
    );
  }

  setLanguage(nextLang) {
    const normalized = normalizeLanguage(nextLang);
    if (!normalized || normalized === this.currentLanguage) return;
    this.currentLanguage = normalized;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, normalized);
      }
    } catch {
      // Storage unavailable
    }
    this.listeners.forEach((fn) => {
      try {
        fn(this.currentLanguage);
      } catch (err) {
        console.error("i18n listener failed:", err);
      }
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  syncFromWink(state) {
    const winkLocale =
      state?.user?.locale ||
      state?.context?.locale ||
      state?.locale ||
      state?.language;
    const normalized = normalizeLanguage(winkLocale);
    if (normalized && normalized !== this.currentLanguage) {
      this.setLanguage(normalized);
    }
  }
}

export const i18n = new I18nManager();
