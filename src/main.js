import { Application, Assets } from "pixi.js";
import { GameController } from "./game";
import { audio } from "./audio";
import { winkGame } from "./integrations/wink/wink-adapter.js";
import { waitForGameFonts } from "./utils/fontLoader.js";
import { installFocusPause } from "./utils/focusPause.js";
import { installInteractionGuard } from "./utils/interactionGuard.js";
import { i18n, t } from "./system/I18nManager.js";

installInteractionGuard();

const splashStartedAt = window.performance.now();
const splashScreen = document.getElementById("splash-screen");
const splashProgressElement = document.getElementById("splash-progress");
const splashText = document.getElementById("splash-text");
let splashProgress = 0;

function setSplashProgress(progress) {
  splashProgress = Math.max(0, Math.min(100, Math.round(progress)));

  if (splashProgressElement) {
    splashProgressElement.style.width = `${splashProgress}%`;
  }
  if (splashText) {
    const nextText = t("loading.progress", { progress: splashProgress });
    if (splashText.innerText !== nextText) splashText.innerText = nextText;
  }
}

function localizeSplash() {
  if (splashText) {
    splashText.innerText = t("loading.progress", {
      progress: splashProgress,
    });
  }
}

localizeSplash();
i18n.subscribe(localizeSplash);

const splashProgressTimer = window.setInterval(() => {
  if (splashProgress >= 90) return;
  const step = Math.max(1, Math.ceil((90 - splashProgress) * 0.12));
  setSplashProgress(Math.min(90, splashProgress + step));
}, 80);

async function hideSplashWhenReady() {
  window.clearInterval(splashProgressTimer);
  if (!splashScreen) return;

  const studioLogo = splashScreen.querySelector(".studio-splash-logo");
  if (studioLogo instanceof window.HTMLImageElement && !studioLogo.complete) {
    await Promise.race([
      studioLogo.decode().catch(() => undefined),
      new Promise((resolve) => window.setTimeout(resolve, 500)),
    ]);
  }

  const minimumSplashDuration = 1400;
  const remainingDuration = Math.max(
    0,
    minimumSplashDuration - (window.performance.now() - splashStartedAt),
  );
  if (remainingDuration > 0) {
    await new Promise((resolve) =>
      window.setTimeout(resolve, remainingDuration),
    );
  }

  setSplashProgress(100);
  await new Promise((resolve) => window.setTimeout(resolve, 160));
  splashScreen.classList.add("is-hidden");
  await new Promise((resolve) => window.setTimeout(resolve, 450));
  splashScreen.style.display = "none";
}

(async () => {
  await waitForGameFonts([
    "400 1em 'Be Vietnam Pro'",
    "500 1em 'Be Vietnam Pro'",
    "600 1em 'Be Vietnam Pro'",
    "700 1em 'Be Vietnam Pro'",
    "800 1em 'Be Vietnam Pro'",
    "900 1em 'Be Vietnam Pro'",
    "700 1em 'Baloo 2'",
    "800 1em 'Baloo 2'",
  ]);

  // 1. Create a new Application instance
  const app = new Application();

  const container = document.getElementById("pixi-container") || document.body;

  // 2. Initialize the application asynchronously (Vite safe IIFE pattern)
  Assets.add({
    alias: "continue_btn",
    src: "/assest/iconbtn/continue_btn.webp",
  });
  Assets.add({
    alias: "next_btn",
    src: "/assest/iconbtn/next_btn.webp",
  });
  await app.init({
    background: "#0a0b1e",
    resizeTo: container,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  });

  // 3. Append the canvas view to the DOM container
  if (container.id === "pixi-container") {
    container.innerHTML = ""; // Clear loader text
    container.appendChild(app.canvas);
  } else {
    document.body.appendChild(app.canvas);
  }

  // 4. Create the game manager container
  const game = new GameController(app);
  window.__game = game;
  app.stage.addChild(game);

  // 5. Connect the update loop to the Application ticker
  app.ticker.add((ticker) => {
    game.update(ticker);
  });

  const focusPause = installFocusPause({
    isRunning: () => Boolean(app.ticker.started),
    pause: () => app.ticker.stop(),
    resume: () => app.ticker.start(),
    pauseAudio: () => audio.pauseForFocus(),
    resumeAudio: () => audio.resumeFromFocus(),
  });

  // 6. Robust resize function that reads container size
  const handleResize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    app.renderer.resize(w, h);
    game.resize();
  };

  // Connect window resize and ResizeObserver to game layout updates
  window.addEventListener("resize", handleResize);
  if (window.ResizeObserver) {
    const resizeObserver = new window.ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
  }

  // ── Wink SDK lifecycle binding ──
  winkGame.bindLifecycle({
    onPause: focusPause.pauseFromHost,
    onResume: focusPause.resumeFromHost,
    onMute: () => audio.setHostMuted(true),
    onUnmute: () => audio.setHostMuted(false),
  });

  winkGame.observe((state) => {
    i18n.syncFromWink(state);
  });
  i18n.syncFromWink(winkGame.state);

  // Run initial resize to align everything correctly
  handleResize();
  void hideSplashWhenReady();

  // Test / Hash navigation support for automated UI inspection
  const checkHash = () => {
    if (window.location.hash === "#defeat") {
      setTimeout(() => game.showDefeatScreen(), 350);
    } else if (window.location.hash === "#level1") {
      setTimeout(() => {
        game.initGame(0);
        game.switchState("PLAYING");
      }, 350);
    } else if (window.location.hash === "#level2") {
      setTimeout(() => {
        game.initGame(1);
        game.switchState("PLAYING");
      }, 350);
    } else if (
      window.location.hash === "#level3" ||
      window.location.hash === "#gameplay"
    ) {
      setTimeout(() => {
        game.initGame(2);
        game.switchState("PLAYING");
      }, 350);
    } else if (
      window.location.hash === "#levels" ||
      window.location.hash === "#level_select"
    ) {
      setTimeout(() => {
        game.switchState("LEVEL_SELECT");
      }, 350);
    } else if (window.location.hash === "#menu") {
      setTimeout(() => {
        game.switchState("MAIN_MENU");
      }, 350);
    } else if (window.location.hash === "#revive") {
      setTimeout(() => {
        game.showReviveOffer(
          () => console.log("Revived!"),
          () => console.log("Skipped!"),
        );
      }, 350);
    }
  };
  window.addEventListener("hashchange", checkHash);
  window.addEventListener("keydown", (e) => {
    if (e.key === "d" || e.key === "D") {
      game.showDefeatScreen();
    }
  });
  checkHash();
})();
