const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Player
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

// Gravity
let gravity = 0.5;

// Platforms
let platforms = [
  { x: 0, y: 350, width: 800, height: 50 },
  { x: 200, y: 280, width: 120, height: 20 },
  { x: 400, y: 220, width: 120, height: 20 }
];

// Controls
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

// Collision detection
function collision(obj, platform) {
  return (
    obj.x < platform.x + platform.width &&
    obj.x + obj.width > platform.x &&
    obj.y < platform.y + platform.height &&
    obj.y + obj.height > platform.y
  );
}

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Movement
  player.x += player.dx;
  player.dy += gravity;
  player.y += player.dy;

  player.onGround = false;

  // Platform collision
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

  // Draw player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Boundaries
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;

  requestAnimationFrame(update);
}

update();