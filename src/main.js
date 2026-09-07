import { Application, Assets } from "pixi.js";
import "../public/style.css";
import { GameController } from "./game";
import { audio } from "./audio";
import { winkGame } from "./integrations/wink/wink-adapter.js";
import { waitForGameFonts } from "./utils/fontLoader.js";
import { installFocusPause } from "./utils/focusPause.js";
import { installInteractionGuard } from "./utils/interactionGuard.js";
import { i18n, t } from "./system/I18nManager.js";

installInteractionGuard();

function localizeSplash() {
  const splashText = document.getElementById("splash-text");
  if (splashText) {
    splashText.innerText = t("loading.progress", { progress: 0 });
  }
}

localizeSplash();
i18n.subscribe(localizeSplash);

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

  // 3.5 Hide splash screen smoothly with fake progress
  const splashScreen = document.getElementById("splash-screen");
  const splashProgress = document.getElementById("splash-progress");
  const splashText = document.getElementById("splash-text");
  if (splashScreen && splashProgress && splashText) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 90) progress = 90;
      splashProgress.style.width = progress + "%";
      splashText.innerText = t("loading.progress", { progress });
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      splashProgress.style.width = "100%";
      splashText.innerText = t("loading.progress", { progress: 100 });
      setTimeout(() => {
        splashScreen.style.opacity = "0";
        setTimeout(() => {
          splashScreen.style.display = "none";
        }, 500);
      }, 200);
    }, 600);
  } else if (splashScreen) {
    splashScreen.style.opacity = "0";
    setTimeout(() => {
      splashScreen.style.display = "none";
    }, 500);
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

  // ── Wink Bridge lifecycle binding ──
  winkGame.bindLifecycle({
    onPause: focusPause.pauseFromHost,
    onResume: focusPause.resumeFromHost,
    onMute: () => audio.setHostMuted(true),
    onUnmute: () => audio.setHostMuted(false),
  });

  winkGame.observe((state) => {
    console.log("[WinkBridge] phase:", state.phase);
    i18n.syncFromWink(state);
  });
  i18n.syncFromWink(winkGame.state);

  // Run initial resize to align everything correctly
  handleResize();

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
