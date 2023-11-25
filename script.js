let playerName = document.getElementById("playerName").value;
let currentScreen = 'registration';

// Display main menu initially
document.getElementById(currentScreen).style.display = 'block';

const fullscreenButton = document.getElementById('fullscreen-button');
const gameContainer = document.getElementById('game-container');
const gameTitle = document.querySelector('h1');


fullscreenButton.addEventListener('click', toggleFullScreen);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen()
            .catch(err => {
                alert(`Error when switching to full screen mode: ${err.message}`);
            });
        gameTitle.classList.add('large');
    } else {
        document.exitFullscreen();
        gameTitle.classList.remove('large');
    }
}

// Full screen status change handler
document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement) {
        gameTitle.classList.remove('large');
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            gameTitle.classList.remove('large');
        }
    }
});


function choiceColor() {
    switchScreen('choiceColorScreen');
}

function start() {
    switchScreen('mainMenuScreen');
}

function mainMenu() {
    switchScreen('mainMenuScreen');
}

function startGame() {
    switchScreen('gameplayScreen');
}

function switchScreen(screenId) {
    document.getElementById(currentScreen).style.display = 'none';
    document.getElementById(screenId).style.display = 'block';
    currentScreen = screenId;
}


// Active color
let colorBlocks = document.querySelectorAll('.colorBlock');
  
colorBlocks.forEach(function(block) {
    block.addEventListener('click', function() {
        toggleActiveClass(block);
     });
});
  
function toggleActiveClass(clickedBlock) {
    colorBlocks.forEach(function(block) {
        block.classList.remove('active');
    });
  
    clickedBlock.classList.add('active');
};