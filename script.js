/* script.js */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 500;

let bird = { x: 50, y: 150, radius: 15, velocity: 0, gravity: 0.5, lift: -10 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    });
}

function update() {
    if (gameOver) return;
    
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.radius >= canvas.height) {
        gameOver = true;
    }

    if (frame % 100 === 0) {
        let gap = 120;
        let topHeight = Math.floor(Math.random() * (canvas.height / 2));
        pipes.push({ x: canvas.width, width: 50, top: topHeight, bottom: topHeight + gap });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 2;
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
            score++;
        }
        if (
            bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipe.width &&
            (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom)
        ) {
            gameOver = true;
        }
    });
    
    frame++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
    if (gameOver) {
        ctx.fillText("Game Over! Refresh to Restart", 80, 250);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", () => {
    if (!gameOver) bird.velocity = bird.lift;
});

gameLoop();
