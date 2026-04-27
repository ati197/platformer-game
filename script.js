const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// =====================
// 🎮 GAME STATE ENGINE
// =====================
let state = "menu"; // menu | play | win | over
let score = 0;

// =====================
// 📷 CAMERA (SMOOTH + DEADZONE)
// =====================
let cameraX = 0;
let targetCam = 0;

// =====================
// 🧍 PLAYER (CONSOLE FEEL)
// =====================
let player = {
  x: 60,
  y: 300,
  w: 30,
  h: 30,
  dx: 0,
  dy: 0,
  speed: 0.6,
  maxSpeed: 4,
  friction: 0.88,
  jump: -12,
  onGround: false,
  hurt: 0
};

// =====================
// 🌍 PHYSICS
// =====================
let gravity = 0.65;

// =====================
// 🎮 LEVEL DATA (ENGINE STYLE)
// =====================
let level = {
  platforms: [
    { x: 0, y: 350, w: 2000, h: 50 },
    { x: 250, y: 290, w: 120, h: 20 },
    { x: 500, y: 240, w: 120, h: 20 },
    { x: 750, y: 200, w: 120, h: 20 },
    { x: 1000, y: 260, w: 120, h: 20 }
  ],
  coins: [
    { x: 270, y: 260, r: 8, c: false },
    { x: 520, y: 210, r: 8, c: false },
    { x: 770, y: 170, r: 8, c: false }
  ],
  enemies: [
    { x: 400, y: 325, w: 25, h: 25, dir: 1, min: 300, max: 700 },
    { x: 850, y: 325, w: 25, h: 25, dir: -1, min: 750, max: 1100 }
  ],
  flag: { x: 1200, y: 300, w: 20, h: 50 }
};

// =====================
// 🎮 INPUT SYSTEM
// =====================
let keys = { left: false, right: false, up: false };

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowUp") keys.up = true;

  if (e.key === "Enter" && state === "menu") state = "play";
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
  player.x = 60;
  player.y = 300;
  player.dx = 0;
  player.dy = 0;
  score = 0;
  state = "play";
  level.coins.forEach(c => c.c = false);
}

// =====================
// 🎮 MAIN LOOP
// =====================
function update() {

  // =====================
  // 🌈 BACKGROUND
  // =====================
  ctx.fillStyle = "#6ec6ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // =====================
  // 🎮 MENU
  // =====================
  if (state === "menu") {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("🎮 PRESS ENTER", 120, 200);
    requestAnimationFrame(update);
    return;
  }

  // =====================
  // 💀 GAME OVER
  // =====================
  if (state === "over") {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("💀 GAME OVER", 120, 200);
    return;
  }

  // =====================
  // 🏆 WIN
  // =====================
  if (state === "win") {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("🏆 YOU WIN!", 140, 200);
    return;
  }

  // =====================
  // 🧍 PLAYER MOVEMENT (AAA FEEL)
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
  // 📷 CAMERA SMOOTH + DEADZONE
  // =====================
  targetCam = player.x - 120;
  cameraX += (targetCam - cameraX) * 0.08;

  // =====================
  // 🧱 PLATFORMS
  // =====================
  for (let p of level.platforms) {

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
  // 🪙 COINS + PARTICLE FEEL
  // =====================
  for (let c of level.coins) {
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
  // 👾 ENEMIES (PATROL AI)
  // =====================
  for (let e of level.enemies) {

    e.x += e.dir * 1.8;

    if (e.x < e.min || e.x > e.max) e.dir *= -1;

    ctx.fillStyle = "#7a2cff";
    ctx.fillRect(e.x - cameraX, e.y, e.w, e.h);

    if (hit(player, e)) {
      state = "over";
    }
  }

  // =====================
  // 🏁 FLAG
  // =====================
  ctx.fillStyle = "green";
  ctx.fillRect(level.flag.x - cameraX, level.flag.y, level.flag.w, level.flag.h);

  if (hit(player, level.flag)) {
    state = "win";
  }

  // =====================
  // 🧍 PLAYER (HURT EFFECT)
  // =====================
  if (player.hurt > 0) {
    ctx.globalAlpha = 0.5;
    player.hurt--;
  }

  ctx.fillStyle = "red";
  ctx.fillRect(player.x - cameraX, player.y, player.w, player.h);

  ctx.globalAlpha = 1;

  // =====================
  // 🏆 UI
  // =====================
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  requestAnimationFrame(update);
}

update();
