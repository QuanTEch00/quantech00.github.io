let score = 0;
let targeteggs = 0;
let timerInterval;
const scoreDisplay = document.getElementById('score');
const targetDisplay = document.getElementById('total');
const timerDisplay = document.getElementById('timer');
const eggContainer = document.getElementById('eggContainer');
const audio = document.getElementById('myAudio');

function createegg() {
    const egg = document.createElement('img');
    egg.src = 'resources/egg-1.png';
    egg.alt = 'egg';
    egg.classList.add('egg');
    return egg;
}

function fillScreenWitheggs() {
    const containerWidth = eggContainer.clientWidth;
    const containerHeight = eggContainer.clientHeight;
    const eggSizeWidth = 160; // Split width
    const eggSizeHeight = 160; // Split height
    const minMargin = -10;
    const maxMargin = 50;

    let x = 0, y = 120;
    while (y + eggSizeHeight <= containerHeight) {
        let randomMargin = Math.floor(Math.random() * (maxMargin - minMargin + 1)) + minMargin;
        if (x + eggSizeWidth + randomMargin > containerWidth) {
            randomMargin = containerWidth - x - eggSizeWidth;
            if (randomMargin < 0) randomMargin = 0;
        }

        if (x + eggSizeWidth <= containerWidth) {
            const egg = document.createElement('img');
            egg.src = 'resources/egg-1.png';
            egg.alt = 'egg';
            egg.classList.add('egg');
            egg.style.position = 'absolute';
            egg.style.left = `${x}px`;
            egg.style.top = `${y}px`;
            egg.style.margin = `${randomMargin}px`;
            eggContainer.appendChild(egg);
            targeteggs++;
        }

        x += eggSizeWidth + randomMargin;
        if (x + eggSizeWidth > containerWidth) {
            x = 0;
            y += eggSizeHeight + minMargin;
        }
    }
    targetDisplay.textContent = `Target: ${targeteggs}`;
}

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    timer--;
    timerInterval = setInterval(() => {
        seconds = parseInt(timer, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerDisplay.textContent = `Time: ${seconds}`;

        if (--timer < 0) {
            clearInterval(timerInterval);
            disableAlleggs();
            checkScoreAndTarget();
        }
    }, 1000);
}

function InitializeTimer(duration) {
    let timer = duration, minutes, seconds;
    seconds = parseInt(timer, 10);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timerDisplay.textContent = `Time: ${seconds}`;
}

function disableAlleggs() {
    document.querySelectorAll('.egg').forEach(button => {
        button.disabled = true;
    });
}

function checkScoreAndTarget() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    if (score === targeteggs) {
        overlay.textContent = "Congratulations!";
    } else {
        overlay.textContent = `Game Over!`;
    }

    document.body.appendChild(overlay);

    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 3000);
}

async function playAudio() {
    try {
        audio.pause();
        audio.currentTime = 0;
        await audio.play();
    } catch (error) {
        console.error("Audio playback failed:", error);
    }
}

fillScreenWitheggs();
targetTime = targeteggs*.75
InitializeTimer(targetTime);

let timerStarted = false;
document.querySelectorAll('.egg').forEach(button => {
    button.addEventListener('click', async () => {
        if (!button.disabled) {
            button.disabled = true;
            await playAudio();

            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            button.style.animation = 'shake 0.22s linear infinite';
            setTimeout(() => {
                button.style.animation = 'none';
                const randomAngle = Math.floor(Math.random() * 360);
                button.style.transform = `rotate(${randomAngle}deg)`;
                button.src = 'resources/cracked-egg-1.png';
                // button.style.opacity = '0.5';
            }, 450);

            if (!timerStarted) {
                startTimer(targetTime);
                timerStarted = true;
            }
        }
    });
});

audio.addEventListener('ended', function() {
    audio.currentTime = 0;
});
