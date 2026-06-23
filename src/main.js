import { Application } from "pixi.js";
import { GameController } from "./game";

(async () => {
  // 1. Create a new Application instance
  const app = new Application();

  // 2. Initialize the application asynchronously (Vite safe IIFE pattern)
  await app.init({
    background: "#0a0b1e",
    resizeTo: window,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  });

  // 3. Append the canvas view to the DOM container
  const container = document.getElementById("pixi-container");
  if (container) {
    container.innerHTML = ""; // Clear loader text
    container.appendChild(app.canvas);
  } else {
    document.body.appendChild(app.canvas);
  }

  // 4. Create the game manager container
  const game = new GameController(app);
  app.stage.addChild(game);

  // 5. Connect the update loop to the Application ticker
  app.ticker.add((ticker) => {
    game.update(ticker);
  });

  // 6. Connect window resize to game layout updates
  window.addEventListener("resize", () => {
    game.resize();
  });
})();
