import { GraphicsContext, FillGradient } from "pixi.js";

// List of all 44 avatar files in the shared assets directory
export const AVATAR_FILES = [
  "001_avatar_laclac.png",
  "002_avatar_cat_lick1.png",
  "003_avatar_duck.png",
  "004_avatar_turtle.png",
  "005_avatar_long.png",
  "006_avatar_horse.png",
  "007_avatar_tiguawhite.png",
  "008_avatar_husky.png",
  "009_avatar_doremonk.png",
  "010_avatar_echxanh1.png",
  "011_avatar_nudaeng.png",
  "012_avatar_hubcat.png",
  "013_avatar_unicorn.png",
  "014_avatar_zongbadou.png",
  "015_avatar_dauLan.png",
  "016_avatar_banhtung.png",
  "017_avatar_tiguayel.png",
  "018_avatar_megachard.png",
  "019_avatar_gigaboy.png",
  "020_avatar_cloudball.png",
  "021_avatar_culama.png",
  "022_avatar_poolpanda.png",
  "023_avatar_trollvn.png",
  "024_avatar_heothy.png",
  "025_avatar_zolype.png",
  "026_avatar_crick.png",
  "027_avatar_penguine.png",
  "028_avatar_timao.png",
  "029_avatar_caocal.png",
  "030_avatar_cowboy.png",
  "031_avatar_ninjadog.png",
  "032_avatar_petrocat.png",
  "033_avatar_richmonkey.png",
  "034_avatar_hazagi.png",
  "035_avatar_dogoin.png",
  "036_avatar_watermelon.png",
  "037_avatar_timone.png",
  "038_avatar_ronaldo.png",
  "039_avatar_hustmouse.png",
  "040_avatar_hitbear.png",
  "041_avatar_echxanh2.png",
  "042_avatar_zolype2.png",
  "043_avatar_cat_lick2.png",
  "044_avatar_poolpanda2.png",
];

export const getAvatarPath = (filename) => {
  return `/assest/image/imagebldp/${filename}`;
};

/**
 * Draw a peanut path (figure-8 shape) centered at (cx, cy)
 */
export function drawPeanutPath(ctx, cx, cy, w, h, inset = 0) {
  const iw = w - inset * 2;
  const ih = h - inset * 2;

  const topY = cy - ih * 0.23;
  const botY = cy + ih * 0.23;

  const rTop = iw * 0.44;
  const rBot = iw * 0.44;
  const waistHalfW = iw * 0.36;

  ctx.beginPath();
  ctx.moveTo(cx - waistHalfW, cy);
  ctx.bezierCurveTo(
    cx - iw * 0.48,
    cy - ih * 0.12,
    cx - rTop,
    topY - ih * 0.2,
    cx,
    topY - ih * 0.23,
  );
  ctx.bezierCurveTo(
    cx + rTop,
    topY - ih * 0.2,
    cx + iw * 0.48,
    cy - ih * 0.12,
    cx + waistHalfW,
    cy,
  );
  ctx.bezierCurveTo(
    cx + iw * 0.48,
    cy + ih * 0.12,
    cx + rBot,
    botY + ih * 0.2,
    cx,
    botY + ih * 0.23,
  );
  ctx.bezierCurveTo(
    cx - rBot,
    botY + ih * 0.2,
    cx - iw * 0.48,
    cy + ih * 0.12,
    cx - waistHalfW,
    cy,
  );
  ctx.closePath();
}

/**
 * Creates a shared GraphicsContext for the Card Back
 * Design: Stylized Golden Peanut (Lạc Vàng) on a rich traditional Burgundy lacquer background
 */
export function createCardBackContext(w, h) {
  const ctx = new GraphicsContext();
  const cx = w / 2;
  const cy = h / 2;

  // Create a rich Burgundy/Dark-Red gradient for the card body
  const bodyGrad = new FillGradient({
    start: { x: 0, y: 0 },
    end: { x: w, y: h },
    colorStops: [
      { offset: 0, color: 0x5c0612 },
      { offset: 0.5, color: 0x360207 },
      { offset: 1, color: 0x1b0103 },
    ],
  });

  // Base card shape & fill
  drawPeanutPath(ctx, cx, cy, w, h);
  ctx.fill(bodyGrad);

  // Outer border with premium gold stroke
  ctx.stroke({
    width: 2.5,
    color: 0xd4af37, // Metallic gold
    alignment: 0.5,
  });

  // Inner margin border (soft gold line following the peanut shape)
  drawPeanutPath(ctx, cx, cy, w, h, 6);
  ctx.stroke({
    width: 1,
    color: 0xffd700,
    alpha: 0.4,
  });

  // Center Golden Peanut Shell emblem
  const pw = w * 0.35;
  const ph = h * 0.42;
  const goldGrad = new FillGradient({
    start: { x: cx - pw / 2, y: cy - ph / 2 },
    end: { x: cx + pw / 2, y: cy + ph / 2 },
    colorStops: [
      { offset: 0, color: 0xffea00 }, // Bright yellow gold
      { offset: 0.5, color: 0xd4af37 }, // Rich gold
      { offset: 1, color: 0xaa7c11 }, // Dark gold
    ],
  });

  // Draw the small golden peanut shell base
  drawPeanutPath(ctx, cx, cy, pw, ph);
  ctx.fill(goldGrad).stroke({ width: 1.2, color: 0x5c0612 });

  // Draw grid lines inside the central peanut shell (peanut mesh texture)
  ctx.save();
  ctx.setStrokeStyle({ width: 0.8, color: 0x5c0612, alpha: 0.45 });
  ctx.moveTo(cx - pw * 0.3, cy - ph * 0.2).lineTo(cx + pw * 0.3, cy + ph * 0.2);
  ctx.moveTo(cx - pw * 0.3, cy - ph * 0.4).lineTo(cx + pw * 0.4, cy + ph * 0.1);
  ctx.moveTo(cx - pw * 0.4, cy).lineTo(cx + pw * 0.2, cy + ph * 0.4);

  ctx.moveTo(cx + pw * 0.3, cy - ph * 0.2).lineTo(cx - pw * 0.3, cy + ph * 0.2);
  ctx.moveTo(cx + pw * 0.3, cy - ph * 0.4).lineTo(cx - pw * 0.4, cy + ph * 0.1);
  ctx.moveTo(cx + pw * 0.4, cy).lineTo(cx - pw * 0.2, cy + ph * 0.4);
  ctx.stroke();
  ctx.restore();

  // Traditional gold clouds/carvings around the center peanut
  ctx.setStrokeStyle({ width: 1, color: 0xffd700, alpha: 0.5 });
  // Left cloud
  ctx
    .moveTo(cx - pw * 0.7, cy - ph * 0.2)
    .bezierCurveTo(
      cx - pw * 1.2,
      cy - ph * 0.5,
      cx - pw * 1.5,
      cy - ph * 0.1,
      cx - pw * 1.2,
      cy + ph * 0.1,
    )
    .bezierCurveTo(
      cx - pw * 0.9,
      cy + ph * 0.3,
      cx - pw * 0.7,
      cy + ph * 0.1,
      cx - pw * 0.7,
      cy,
    );
  ctx.stroke();

  // Right cloud
  ctx
    .moveTo(cx + pw * 0.7, cy - ph * 0.2)
    .bezierCurveTo(
      cx + pw * 1.2,
      cy - ph * 0.5,
      cx + pw * 1.5,
      cy - ph * 0.1,
      cx + pw * 1.2,
      cy + ph * 0.1,
    )
    .bezierCurveTo(
      cx + pw * 0.9,
      cy + ph * 0.3,
      cx + pw * 0.7,
      cy + ph * 0.1,
      cx + pw * 0.7,
      cy,
    );
  ctx.stroke();

  // Small golden dots/leaves rising above and below the center
  ctx.circle(cx, cy - ph * 0.65, 2.5).fill(0xffd700);
  ctx.circle(cx - 10, cy - ph * 0.6, 2).fill(0xffd700);
  ctx.circle(cx + 10, cy - ph * 0.6, 2).fill(0xffd700);

  ctx.circle(cx, cy + ph * 0.65, 2.5).fill(0xffd700);
  ctx.circle(cx - 10, cy + ph * 0.6, 2).fill(0xffd700);
  ctx.circle(cx + 10, cy + ph * 0.6, 2).fill(0xffd700);

  return ctx;
}

/**
 * Creates a shared GraphicsContext for the Card Front background
 * Design: Premium warm cream/ivory peanut shape background with faint watermark
 */
export function createCardFrontBackgroundContext(w, h) {
  const ctx = new GraphicsContext();
  const cx = w / 2;
  const cy = h / 2;

  // Premium warm ivory/cream gradient
  const bgGrad = new FillGradient({
    start: { x: 0, y: 0 },
    end: { x: w, y: h },
    colorStops: [
      { offset: 0, color: 0xfffefb },
      { offset: 1, color: 0xf5eedb },
    ],
  });

  // Base card shape & fill
  drawPeanutPath(ctx, cx, cy, w, h);
  ctx.fill(bgGrad);

  // Gold border to match the card back
  ctx.stroke({
    width: 2,
    color: 0xd4af37,
    alignment: 0.5,
  });

  // Soft inner border frame following the peanut shape
  drawPeanutPath(ctx, cx, cy, w, h, 6);
  ctx.stroke({
    width: 1,
    color: 0xd4af37,
    alpha: 0.25,
  });

  // Watermark peanut inside the card front center
  drawPeanutPath(ctx, cx, cy, w * 0.6, h * 0.6);
  ctx.stroke({
    width: 0.7,
    color: 0xd4af37,
    alpha: 0.12,
  });

  return ctx;
}
