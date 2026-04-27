const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let box = 20;
let snake = [{x: 9 * box, y: 9 * box}];
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};

let direction = "RIGHT";

// control snake
document.addEventListener("keydown", changeDir);

function changeDir(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = "lime";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // snake head
  let head = {x: snake[0].x, y: snake[0].y};

  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // eat food
  if (head.x === food.x && head.y === food.y) {
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }

  // game over
  if (
    head.x < 0 || head.x >= 400 ||
    head.y < 0 || head.y >= 400
  ) {
    alert("💥 Game Over!");
    document.location.reload();
  }

  snake.unshift(head);
}

setInterval(draw, 100);
