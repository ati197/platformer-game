const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 🧍 Player
let player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  dx: 0,
  dy: 0,
  speed: 3,
  jumpPower: -10,
  onGround: false,
  alive: true
};

// 🌍 Physics
let gravity = 0.5;

// 🏆 Score
let score = 0;

// 🧱 Platforms
let platforms = [
  { x: 0, y: 350, width: 800, height: 50 },
  { x: 180, y: 280, width: 120, height: 20 },
  { x: 360, y: 230, width: 120, height: 20 },
  { x: 550, y: 180, width: 120, height: 20 }
];

// 🪙 Coins
let coins = [
  { x: 200, y: 250, r: 8, collected: false },
  { x: 400, y: 200, r: 8, collected: false },
  { x: 600, y: 150, r: 8, collected: false }
];

// 👾 Enemies
let enemies = [
  { x: 300, y: 320, width: 25, height: 25, dir: 1 },
  { x: 500, y: 320, width: 25, height: 25, dir: -1 }
];

// 🏁 Goal Flag
let goal = { x: 750, y: 300, width: 20, height: 50 };

// 🎮 Controls
document.addEventListener("keydown", (e) => {
  if (!player.alive) return;

  if (e.key === "ArrowRight") player.dx = player.speed;
  if (e.key === "ArrowLeft") player.dx = -player.speed;

  if (e.key === "ArrowUp" && player.onGround) {
    player.dy = player.jumpPower;
    player.onGround = false;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    player.dx = 0;
  }
});

// 💥 Collision
function collide(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// 🔄 Reset Game
function reset() {
  player.x = 50;
  player.y = 300;
  player.dx = 0;
  player.dy = 0;
  player.alive = true;
  score = 0;

  coins.forEach(c => c.collected = false);
}

// 🎮 GAME LOOP
function update() {

  // 🌍 Background
  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!player.alive) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("💀 Game Over - Press R", 200, 200);
    requestAnimationFrame(update);
    return;
  }

  // 🧍 Player physics
  player.x += player.dx;
  player.dy += gravity;
  player.y += player.dy;

  player.onGround = false;

  // 🧱 Platforms
  for (let p of platforms) {
    ctx.fillStyle = "brown";
    ctx.fillRect(p.x, p.y, p.width, p.height);

    if (collide(player, p)) {
      if (player.dy > 0) {
        player.y = p.y - player.height;
        player.dy = 0;
        player.onGround = true;
      }
    }
  }

  // 🪙 Coins
  for (let coin of coins) {
    if (!coin.collected) {
      ctx.fillStyle = "gold";
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, coin.r, 0, Math.PI * 2);
      ctx.fill();

      let dx = (player.x + player.width / 2) - coin.x;
      let dy = (player.y + player.height / 2) - coin.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 20) {
        coin.collected = true;
        score += 10;
      }
    }
  }

  // 👾 Enemies
  for (let e of enemies) {
    e.x += e.dir * 2;

    if (e.x < 200 || e.x > 650) e.dir *= -1;

    ctx.fillStyle = "purple";
    ctx.fillRect(e.x, e.y, e.width, e.height);

    if (collide(player, e)) {
      player.alive = false;
    }
  }

  // 🏁 Goal
  ctx.fillStyle = "green";
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

  if (collide(player, goal)) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("🏁 YOU WIN!", 250, 200);
    return;
  }

  // 🧍 Player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 🏆 Score UI
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("🏆 Score: " + score, 20, 30);

  // 🚧 Boundaries
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;

  requestAnimationFrame(update);
}

// 🔁 Restart key
document.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") {
    reset();
  }
});

update();
