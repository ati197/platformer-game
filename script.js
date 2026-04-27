const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// =====================
// 🎮 GAME STATE
// =====================
let level = 1;
let score = 0;
let gameState = "play"; // play | over | win

// =====================
// 📷 CAMERA (SMOOTH)
// =====================
let cameraX = 0;
let cameraTarget = 0;

// =====================
// 🧍 PLAYER (AAA FEEL)
// =====================
let player = {
  x: 50,
  y: 300,
  w: 30,
  h: 30,
  dx: 0,
  dy: 0,
  speed: 0.5,
  maxSpeed: 4,
  friction: 0.85,
  jump: -11,
  onGround: false
};

// =====================
// 🌍 PHYSICS
// =====================
let gravity = 0.6;

// =====================
// 🎮 LEVEL DATA (SIMPLE AAA WORLD)
// =====================
let L = {
  platforms: [
    { x: 0, y: 350, w: 2000, h: 50 },
    { x: 200, y: 280, w: 120, h: 20 },
    { x: 450, y: 240, w: 120, h: 20 },
    { x: 700, y: 200, w: 120, h: 20 },
    { x: 1000, y: 260, w: 120, h: 20 }
  ],
  coins: [
    { x: 220, y: 250, r: 8, c: false },
    { x: 470, y: 210, r: 8, c: false },
    { x: 720, y: 170, r: 8, c: false }
  ],
  enemies: [
    { x: 400, y: 325, w: 25, h: 25, dir: 1 },
    { x: 800, y: 325, w: 25, h: 25, dir: -1 }
  ],
  flag: { x: 1200, y: 300, w: 20, h: 50 }
};

// =====================
// 🎮 CONTROLS
// =====================
let keys = { left: false, right: false, up: false };

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowUp") keys.up = true;
  if (e.key === "r") reset();
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowUp") keys.up = false;
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
// 🔄 RESET
// =====================
function reset() {
  player.x = 50;
  player.y = 300;
  player.dx = 0;
  player.dy = 0;
  score = 0;
  gameState = "play";

  L.coins.forEach(c => c.c = false);
}

// =====================
// 🎮 UPDATE LOOP
// =====================
function update() {

  // 🌈 BACKGROUND
  ctx.fillStyle = "#5ec2ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState === "over") {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("💀 Game Over", 200, 200);
    requestAnimationFrame(update);
    return;
  }

  if (gameState === "win") {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("🏆 YOU WIN!", 200, 200);
    requestAnimationFrame(update);
    return;
  }

  // =====================
  // 🧍 PLAYER PHYSICS (AAA FEEL)
  // =====================
  if (keys.left) player.dx -= player.speed;
  if (keys.right) player.dx += player.speed;

  player.dx *= player.friction;
  player.dx = Math.max(-player.maxSpeed, Math.min(player.maxSpeed, player.dx));

  if (keys.up && player.onGround) {
    player.dy = player.jump;
    player.onGround = false;
  }

  player.dy += gravity;

  player.x += player.dx;
  player.y += player.dy;

  player.onGround = false;

  // =====================
  // 📷 SMOOTH CAMERA
  // =====================
  cameraTarget = player.x - 120;
  cameraX += (cameraTarget - cameraX) * 0.1;

  // =====================
  // 🧱 PLATFORMS
  // =====================
  for (let p of L.platforms) {
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
  // 🪙 COINS (POP EFFECT)
  // =====================
  for (let c of L.coins) {
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
  // 👾 ENEMIES (SMOOTH AI)
  // =====================
  for (let e of L.enemies) {

    e.x += e.dir * 1.5;

    if (e.x < 300 || e.x > 1100) e.dir *= -1;

    ctx.fillStyle = "#7a2cff";
    ctx.fillRect(e.x - cameraX, e.y, e.w, e.h);

    if (hit(player, e)) {
      gameState = "over";
    }
  }

  // =====================
  // 🏁 FLAG
  // =====================
  ctx.fillStyle = "green";
  ctx.fillRect(L.flag.x - cameraX, L.flag.y, L.flag.w, L.flag.h);

  if (hit(player, L.flag)) {
    gameState = "win";
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
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  requestAnimationFrame(update);
}

update();
