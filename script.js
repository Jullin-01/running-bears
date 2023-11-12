let playerName = document.getElementById("playerName").value;
let currentScreen = 'mainMenu';
let score = 0;

// Display main menu initially
document.getElementById(currentScreen).style.display = 'block';

const fullscreenButton = document.getElementById('fullscreen-button');
const gameContainer = document.getElementById('game-container');

fullscreenButton.addEventListener('click', toggleFullScreen);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen()
            .catch(err => {
                alert(`Error when switching to full screen mode: ${err.message}`);
            });
    } else {
        document.exitFullscreen();
    }
}

function startGame() {
    switchScreen('gameplayScreen');
    score = 0;
    document.getElementById('score').textContent = score;
}

function incrementScore() {
    score++;
    document.getElementById('score').textContent = score;
}

function endGame() {
    switchScreen('gameOverScreen');
    document.getElementById('finalScore').textContent = score;
}

function restartGame() {
    switchScreen('mainMenu');
}

function switchScreen(screenId) {
    document.getElementById(currentScreen).style.display = 'none';
    document.getElementById(screenId).style.display = 'block';
    currentScreen = screenId;
}
