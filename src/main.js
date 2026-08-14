import { Application, Assets } from "pixi.js";
import { GameController } from "./game";
import { winkGame } from "./integrations/wink/wink-adapter.js";

(async () => {
  // 0. Force-load Google Fonts with Vietnamese text before PixiJS renders any Text
  await Promise.allSettled([
    document.fonts.load("700 1em Outfit", "Bộ Lạc Đậu Phộng"),
    document.fonts.load("700 1em Fredoka", "Bộ Lạc Đậu Phộng"),
  ]);
  await document.fonts.ready;

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
      splashText.innerText = `Loading ${progress}%`;
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      splashProgress.style.width = "100%";
      splashText.innerText = `Loading 100%`;
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
    onPause: () => {
      if (app.ticker) app.ticker.stop();
    },
    onResume: () => {
      if (app.ticker) app.ticker.start();
    },
  });

  winkGame.observe((state) => {
    console.log("[WinkBridge] phase:", state.phase);
  });

  // Run initial resize to align everything correctly
  handleResize();
})();
