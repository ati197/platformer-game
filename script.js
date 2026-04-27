const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// =====================
// 📷 CAMERA
// =====================
let cameraX = 0;

// =====================
// 🏆 GAME STATE
// =====================
let level = 1;
let score = 0;
let levelComplete = false;

// =====================
// 🧍 PLAYER
// =====================
let player = {
  x: 50,
  y: 300,
  w: 30,
  h: 30,
  dx: 0,
  dy: 0,
  speed: 3,
  jump: -11,
  onGround: false,
  alive: true
};

// =====================
// 🌍 GRAVITY
// =====================
let gravity = 0.6;

// =====================
// 🎮 LEVELS
// =====================
let levels = {

  1: {
    platforms: [
      { x: 0, y: 350, w: 800, h: 50 },
      { x: 200, y: 280, w: 120, h: 20 },
      { x: 400, y: 240, w: 120, h: 20 }
    ],
    coins: [
      { x: 220, y: 250, r: 8, c: false },
      { x: 420, y: 210, r: 8, c: false }
    ],
    enemies: [
      { x: 300, y: 325, w: 25, h: 25, dir: 1 }
    ],
    flag: { x: 700, y: 300, w: 20, h: 50 }
  },

  2: {
    platforms: [
      { x: 0, y: 350, w: 1000, h: 50 },
      { x: 250, y: 300, w: 120, h: 20 },
      { x: 500, y: 250, w: 120, h: 20 },
      { x: 750, y: 220, w: 120, h: 20 }
    ],
    coins: [
      { x: 260, y: 270, r: 8, c: false },
      { x: 520, y: 220, r: 8, c: false },
      { x: 760, y: 190, r: 8, c: false }
    ],
    enemies: [
      { x: 400, y: 325, w: 25, h: 25, dir: 1 },
      { x: 650, y: 325, w: 25, h: 25, dir: -1 }
    ],
    flag: { x: 900, y: 300, w: 20, h: 50 }
  },

  3: {
    platforms: [
      { x: 0, y: 350, w: 1200, h: 50 },
      { x: 300, y: 300, w: 120, h: 20 },
      { x: 600, y: 250, w: 120, h: 20 },
      { x: 900, y: 220, w: 120, h: 20 }
    ],
    coins: [
      { x: 320, y: 270, r: 8, c: false },
      { x: 620, y: 220, r: 8, c: false },
      { x: 920, y: 190, r: 8, c: false }
    ],
    enemies: [
      { x: 500, y: 325, w: 25, h: 25, dir: 1 },
      { x: 800, y: 325, w: 25, h: 25, dir: -1 }
    ],
    flag: { x: 1100, y: 300, w: 20, h: 50 }
  }
};

// =====================
// 🔄 GET LEVEL
// =====================
function L() {
  return levels[level];
}

// =====================
// 🎮 CONTROLS
// =====================
document.addEventListener("keydown", (e) => {

  if (e.key === "ArrowLeft") player.dx = -player.speed;
  if (e.key === "ArrowRight") player.dx = player.speed;

  if (e.key === "ArrowUp" && player.onGround) {
    player.dy = player.jump;
    player.onGround = false;
  }

  if (e.key === "r") reset();
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
});

// =====================
// 💥 COLLISION
// =====================
function hit(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// =====================
// 🔄 RESET LEVEL
// =====================
function reset() {
  player.x = 50;
  player.y = 300;
  player.dx = 0;
  player.dy = 0;
  cameraX = 0;
  levelComplete = false;

  L().coins.forEach(c => c.c = false);
}

// =====================
// 🏁 NEXT LEVEL (FIXED)
// =====================
function nextLevel() {
  if (levelComplete) return;

  levelComplete = true;

  setTimeout(() => {
    level++;

    if (level > 3) {
      alert("🏆 YOU COMPLETED ALL LEVELS!");
      level = 3;
    }

    reset();
  }, 700);
}

// =====================
// 🎮 GAME LOOP
// =====================
function update() {

  // 🌈 BACKGROUND
  ctx.fillStyle = "#6ec6ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let levelData = L();

  // =====================
  // 🧍 PLAYER PHYSICS
  // =====================
  player.x += player.dx;
  player.dy += gravity;
  player.y += player.dy;

  player.onGround = false;

  cameraX = player.x - 100;

  // =====================
  // 🧱 PLATFORMS
  // =====================
  for (let p of levelData.platforms) {

    ctx.fillStyle = "#8B4513";
    ctx.fillRect(p.x - cameraX, p.y, p.w, p.h);

    if (hit(player, p)) {
      if (player.dy > 0) {
        player.y = p.y - player.h;
        player.dy = 0;
        player.onGround = true;
      }
    }
  }

  // =====================
  // 🪙 COINS
  // =====================
  for (let c of levelData.coins) {
    if (!c.c) {

      ctx.fillStyle = "gold";
      ctx.beginPath();
      ctx.arc(c.x - cameraX, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      let dx = (player.x + player.w/2) - c.x;
      let dy = (player.y + player.h/2) - c.y;

      if (Math.sqrt(dx*dx + dy*dy) < 18) {
        c.c = true;
        score += 10;
      }
    }
  }

  // =====================
  // 👾 ENEMIES
  // =====================
  for (let e of levelData.enemies) {

    e.x += e.dir * 2;

    if (e.x < 150 || e.x > levelData.flag.x - 100) e.dir *= -1;

    ctx.fillStyle = "purple";
    ctx.fillRect(e.x - cameraX, e.y, e.w, e.h);

    if (hit(player, e)) player.alive = false;
  }

  // =====================
  // 🏁 FLAG
  // =====================
  ctx.fillStyle = "green";
  ctx.fillRect(levelData.flag.x - cameraX, levelData.flag.y, levelData.flag.w, levelData.flag.h);

  if (hit(player, levelData.flag) && !levelComplete) {
    nextLevel();
  }

  // =====================
  // 🧍 PLAYER
  // =====================
  ctx.fillStyle = "red";
  ctx.fillRect(player.x - cameraX, player.y, player.w, player.h);

  // =====================
  // 🏆 UI
  // =====================
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Level: " + level, 10, 20);
  ctx.fillText("Score: " + score, 10, 45);

  if (!player.alive) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("💀 Game Over - Press R", 100, 200);
  }

  requestAnimationFrame(update);
}

update();
