let score = 0;
let targetDonuts = 0;
let timerInterval;
const scoreDisplay = document.getElementById('score');
const targetDisplay = document.getElementById('total');
const timerDisplay = document.getElementById('timer');
const donutContainer = document.getElementById('donutContainer');
const audio = document.getElementById('myAudio');

function createDonut() {
    const donut = document.createElement('img');
    donut.src = 'resources/donut.png';
    donut.alt = 'Donut';
    donut.classList.add('donut');
    return donut;
}

function fillScreenWithDonuts() {
    const containerWidth = donutContainer.clientWidth;
    const containerHeight = donutContainer.clientHeight;
    const donutSize = 200;
    const minMargin = -20;
    const maxMargin = 30;

    let x = 0, y = 120;
    while (y + donutSize <= containerHeight) {
        let randomMargin = Math.floor(Math.random() * (maxMargin - minMargin + 1)) + minMargin;
        if (x + donutSize + randomMargin > containerWidth) {
            randomMargin = containerWidth - x - donutSize;
            if (randomMargin < 0) randomMargin = 0;
        }

        if (x + donutSize <= containerWidth) {
            const donut = document.createElement('img');
            donut.src = 'resources/donut.png';
            donut.alt = 'Donut';
            donut.classList.add('donut');
            donut.style.position = 'absolute';
            donut.style.left = `${x}px`;
            donut.style.top = `${y}px`;
            donut.style.margin = `${randomMargin}px`;
            donutContainer.appendChild(donut);
            targetDonuts++;
        }

        x += donutSize + randomMargin;
        if (x + donutSize > containerWidth) {
            x = 0;
            y += donutSize + minMargin;
        }
    }
    targetDisplay.textContent = `Target: ${targetDonuts}`;
    timerDisplay.textContent = `Time: ${targetDonuts}`;
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
            disableAllDonuts();
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

function disableAllDonuts() {
    document.querySelectorAll('.donut').forEach(button => {
        button.disabled = true;
    });
}

function checkScoreAndTarget() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    if (score === targetDonuts) {
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

fillScreenWithDonuts();
InitializeTimer(targetDonuts);

let timerStarted = false;
document.querySelectorAll('.donut').forEach(button => {
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
                button.src = 'resources/eaten-donut.png';
                // button.style.opacity = '0.5';
            }, 450);

            if (!timerStarted) {
                startTimer(targetDonuts);
                timerStarted = true;
            }
        }
    });
});

audio.addEventListener('ended', function() {
    audio.currentTime = 0;
});
