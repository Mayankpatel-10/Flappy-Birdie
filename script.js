document.addEventListener('DOMContentLoaded', () => {
    const bird = document.getElementById('bird');
    const pipeTop = document.getElementById('pipe-top');
    const pipeBottom = document.getElementById('pipe-bottom');
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const retryButton = document.getElementById('retry-button');
    const newGameButton = document.getElementById('new-game-button');

    let birdY = bird.offsetTop;
    let gravity = 2;
    let birdJump = -30;
    let gameOver = false;
    let pipeSpeed = 2;
    let score = 0;
    let highScore = 0;
    const gap = 120;

    function randomizePipeHeights() {
        const minPipeHeight = 50;
        const maxPipeHeight = 200;

        const pipeTopHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
        const pipeBottomHeight = gameContainer.offsetHeight - pipeTopHeight - gap;

        pipeTop.style.height = pipeTopHeight + 'px'; // Added quotes and + sign
        pipeBottom.style.height = pipeBottomHeight + 'px'; // Added quotes and + sign
    }

    function startGame() {
        document.addEventListener('keydown', fly);
        gameContainer.addEventListener('click', fly); // Added touch event listener

        const gameLoop = setInterval(() => {
            if (gameOver) {
                clearInterval(gameLoop);
                if (score > highScore) {
                    highScore = score;
                    highScoreDisplay.textContent = 'High Score: ' + highScore; // Updated concatenation
                }
                retryButton.style.display = 'block';
                newGameButton.style.display = 'none';
                return;
            }

            birdY += gravity;
            bird.style.top = birdY + 'px';

            pipeTop.style.left = pipeTop.offsetLeft - pipeSpeed + 'px';
            pipeBottom.style.left = pipeBottom.offsetLeft - pipeSpeed + 'px';

            if (pipeTop.offsetLeft <= -pipeTop.offsetWidth) {
                pipeTop.style.left = gameContainer.offsetWidth + 'px';
                pipeBottom.style.left = gameContainer.offsetWidth + 'px';
                randomizePipeHeights();
                score++;
                scoreDisplay.textContent = 'Score: ' + score; // Updated concatenation
                if (score === 10 || score === 20 || score === 30 || score === 40 || score === 50 || score === 60) {
                    increaseDifficulty();
                }
            }

            if (collisionDetection(bird, pipeTop) || collisionDetection(bird, pipeBottom) || birdY >= gameContainer.offsetHeight - bird.offsetHeight || birdY <= 0) {
                gameOver = true;
            }
        }, 20);
    }

    function increaseDifficulty() {
        pipeSpeed++;
    }

    function fly(event) {
        if (event.code === 'Space' || event.type === 'click') {
            birdY += birdJump;
            event.preventDefault(); // Prevent default behavior for touch events
        }
    }

    function collisionDetection(bird, pipe) {
        const birdRect = bird.getBoundingClientRect();
        const pipeRect = pipe.getBoundingClientRect();
        return !(
            birdRect.top > pipeRect.bottom ||
            birdRect.bottom < pipeRect.top ||
            birdRect.right < pipeRect.left ||
            birdRect.left > pipeRect.right
        );
    }

    randomizePipeHeights();
    startGame();

    retryButton.addEventListener('click', () => {
        score = 0;
        scoreDisplay.textContent = 'Score: ' + score; // Updated concatenation
        birdY = 200;
        bird.style.top = birdY + 'px';
        pipeTop.style.left = '300px';
        pipeBottom.style.left = '300px';
        gameOver = false;
        retryButton.style.display = 'none';
        newGameButton.style.display = 'none';
        startGame();
    });

    newGameButton.addEventListener('click', () => {
        location.reload();
    });
});
