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
  onGround: false
};

// 🌍 Gravity
let gravity = 0.5;

// 🧱 Platforms
let platforms = [
  { x: 0, y: 350, width: 800, height: 50 },
  { x: 200, y: 280, width: 120, height: 20 },
  { x: 400, y: 220, width: 120, height: 20 }
];

// 🪙 Coins
let coins = [
  { x: 220, y: 250, size: 10, collected: false },
  { x: 450, y: 190, size: 10, collected: false },
  { x: 600, y: 320, size: 10, collected: false }
];

// 🏆 Score
let score = 0;

// 🎮 Controls
document.addEventListener("keydown", move);
document.addEventListener("keyup", stop);

function move(e) {
  if (e.key === "ArrowRight") player.dx = player.speed;
  if (e.key === "ArrowLeft") player.dx = -player.speed;

  if (e.key === "ArrowUp" && player.onGround) {
    player.dy = player.jumpPower;
    player.onGround = false;
  }
}

function stop(e) {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    player.dx = 0;
  }
}

// 💥 Collision
function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// 🎮 GAME LOOP
function update() {

  // 🌍 Background (MUST BE FIRST)
  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🧍 Player movement
  player.x += player.dx;
  player.dy += gravity;
  player.y += player.dy;

  player.onGround = false;

  // 🧱 Platforms
  for (let p of platforms) {
    ctx.fillStyle = "brown";
    ctx.fillRect(p.x, p.y, p.width, p.height);

    if (collision(player, p)) {
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
      ctx.arc(coin.x, coin.y, coin.size, 0, Math.PI * 2);
      ctx.fill();

      let distX = (player.x + player.width / 2) - coin.x;
      let distY = (player.y + player.height / 2) - coin.y;
      let distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < 20) {
        coin.collected = true;
        score += 10;
      }
    }
  }

  // 🧍 Player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 🏆 Score UI (LAST - IMPORTANT)
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("🏆 Score: " + score, 20, 30);

  // 🚧 Boundaries
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;

  requestAnimationFrame(update);
}

update();      
