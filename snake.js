const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{x: 10, y: 10}];
let dx = 0;
let dy = 0;
let food = getRandomFood();
let score = 0;
let level = 1;
let speed = 300;                 // Initial speed in milliseconds
let gameOver = false;
let levelComplete = false;

const tryAgainBtn = document.getElementById('tryAgainBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');

tryAgainBtn.addEventListener('click', resetGame);
nextLevelBtn.addEventListener('click', startNextLevel);

document.addEventListener('keydown', changeDirection);

function changeDirection(e) {
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
    if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
    if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
    if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }        
}

function getRandomFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function gameLoop() {
    if (gameOver) {
        showGameOver();
        return;
    }
    if (levelComplete) {
        showLevelComplete();
        return;
    }
    setTimeout(() => {
        clearCanvas();
        moveSnake();
        drawFood();
        drawSnake();
        checkCollision();
        gameLoop();
    }, speed);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').textContent = `Score: ${score}`;
        food = getRandomFood();
        if (snake.length === 10) {
            levelComplete = true;
        }
    } else {
        snake.pop();
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.strokeStyle = 'darkred';
    ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function drawSnake() {
    ctx.fillStyle = 'black';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        ctx.strokeStyle = 'darkgray';
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    food = getRandomFood();
    score = 0;
    level = 1;
    speed = 300;
    gameOver = false;
    levelComplete = false;
    document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
    document.getElementById('levelDisplay').textContent = `Level: ${level}`;
    tryAgainBtn.style.display = 'none';
    nextLevelBtn.style.display = 'none';
    gameLoop();
}

function startNextLevel() {
    level++;
    speed *= 0.75; // Increase speed by 25%
    document.getElementById('levelDisplay').textContent = `Level: ${level}`;
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    food = getRandomFood();
    levelComplete = false;
    nextLevelBtn.style.display = 'none';
    gameLoop();
}

function showGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    
    ctx.shadowBlur = 0;  // Reset shadow for future drawing
    
    tryAgainBtn.style.display = 'block';
}

function showLevelComplete() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${level} Complete!`, canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    
    ctx.shadowBlur = 0;  // Reset shadow for future drawing
    
    nextLevelBtn.style.display = 'block';
}
// Update score during the game
function updateScore() {
    document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
}
// Call this function whenever the score changes
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        food = getRandomFood();
        if (snake.length === 10) {
            levelComplete = true;
        }
    } else {
        snake.pop();
    }
}
gameLoop();
