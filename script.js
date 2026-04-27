const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// =====================
// 🌍 CAMERA SYSTEM
// =====================
let cameraX = 0;

// =====================
// 🧍 PLAYER
// =====================
let player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  dx: 0,
  dy: 0,
  speed: 3,
  jumpPower: -11,
  onGround: false,
  alive: true
};

// =====================
// 🌍 PHYSICS
// =====================
let gravity = 0.6;

// =====================
// 🏆 SCORE
// =====================
let score = 0;

// =====================
// 🧱 LEVEL MAP (LONG WORLD)
// =====================
let platforms = [
  { x: 0, y: 350, width: 2000, height: 50 },

  { x: 200, y: 280, width: 120, height: 20 },
  { x: 400, y: 250, width: 120, height: 20 },
  { x: 650, y: 220, width: 120, height: 20 },
  { x: 900, y: 260, width: 120, height: 20 },
  { x: 1200, y: 240, width: 120, height: 20 },
];

// =====================
// 🪙 COINS
// =====================
let coins = [
  { x: 220, y: 250, r: 8, collected: false },
  { x: 420, y: 220, r: 8, collected: false },
  { x: 680, y: 190, r: 8, collected: false },
  { x: 920, y: 230, r: 8, collected: false },
  { x: 1220, y: 210, r: 8, collected: false }
];

// =====================
// 👾 ENEMIES
// =====================
let enemies = [
  { x: 300, y: 320, w: 25, h: 25, dir: 1 },
  { x: 700, y: 320, w: 25, h: 25, dir: -1 },
  { x: 1100, y: 320, w: 25, h: 25, dir: 1 }
];

// =====================
// 🏁 FLAG (WIN)
// =====================
let flag = { x: 1500, y: 300, w: 20, h: 50 };

// =====================
// 🎮 CONTROLS
// =====================
document.addEventListener("keydown", (e) => {
  if (!player.alive) return;

  if (e.key === "ArrowRight") player.dx = player.speed;
  if (e.key === "ArrowLeft") player.dx = -player.speed;

  if (e.key === "ArrowUp" && player.onGround) {
    player.dy = player.jumpPower;
    player.onGround = false;
  }

  if (e.key === "r" || e.key === "R") reset();
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    player.dx = 0;
  }
});

// =====================
// 💥 COLLISION
// =====================
function collide(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.width > b.x &&
    a.y < b.y + b.h &&
    a.y + a.height > b.y
  );
}

// =====================
// 🔄 RESET
// =====================
function reset() {
  player.x = 50;
  player.y = 300;
  player.dx = 0;
  player.dy = 0;
  player.alive = true;
  score = 0;
  cameraX = 0;

  coins.forEach(c => c.collected = false);
}

// =====================
// 🎮 GAME LOOP
// =====================
function update() {

  // 🌍 BACKGROUND
  ctx.fillStyle = "#6ec6ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!player.alive) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("💀 Game Over - Press R", 150, 200);
    requestAnimationFrame(update);
    return;
  }

  // =====================
  // 🧍 PLAYER PHYSICS
  // =====================
  player.x += player.dx;
  player.dy += gravity;
  player.y += player.dy;

  player.onGround = false;

  // =====================
  // 📷 CAMERA FOLLOW
  // =====================
  cameraX = player.x - 100;

  // =====================
  // 🧱 PLATFORMS
  // =====================
  for (let p of platforms) {

    ctx.fillStyle = "#8B4513";
    ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);

    if (collide(player, { x: p.x, y: p.y, w: p.width, h: p.height })) {
      if (player.dy > 0) {
        player.y = p.y - player.height;
        player.dy = 0;
        player.onGround = true;
      }
    }
  }

  // =====================
  // 🪙 COINS
  // =====================
  for (let c of coins) {
    if (!c.collected) {

      ctx.fillStyle = "gold";
      ctx.beginPath();
      ctx.arc(c.x - cameraX, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      let dx = (player.x + player.width / 2) - c.x;
      let dy = (player.y + player.height / 2) - c.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 20) {
        c.collected = true;
        score += 10;
      }
    }
  }

  // =====================
  // 👾 ENEMIES
  // =====================
  for (let e of enemies) {

    e.x += e.dir * 2;

    if (e.x < 200 || e.x > 1300) e.dir *= -1;

    ctx.fillStyle = "purple";
    ctx.fillRect(e.x - cameraX, e.y, e.w, e.h);

    // eyes
    ctx.fillStyle = "white";
    ctx.fillRect(e.x - cameraX + 5, e.y + 5, 5, 5);
    ctx.fillRect(e.x - cameraX + 15, e.y + 5, 5, 5);

    if (collide(player, { x: e.x, y: e.y, w: e.w, h: e.h })) {
      player.alive = false;
    }
  }

  // =====================
  // 🏁 FLAG (WIN)
  // =====================
  ctx.fillStyle = "green";
  ctx.fillRect(flag.x - cameraX, flag.y, flag.w, flag.h);

  if (collide(player, { x: flag.x, y: flag.y, w: flag.w, h: flag.h })) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("🏁 LEVEL COMPLETE!", 150, 200);
    return;
  }

  // =====================
  // 🧍 PLAYER
  // =====================
  ctx.fillStyle = "red";
  ctx.fillRect(player.x - cameraX, player.y, player.width, player.height);

  // =====================
  // 🏆 SCORE UI
  // =====================
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("🏆 Score: " + score, 20, 30);

  requestAnimationFrame(update);
}

update();
