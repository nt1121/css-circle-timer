let timeLimit = 0; // 制限時間（秒）
let elapsedTime = 0; // スタートボタンを押した時からの経過時間（ミリ秒）
let timeToAdd = 0; // 一度停止して再開した場合に加算する経過時間（ミリ秒）
let startTime; // スタートボタンを押した時のUNIX元期からの経過時間（ミリ秒）
let intervalID;
const timeLimitSet = document.getElementById('js-time-limit-set'); // 制限時間設定画面
const circleTimer = document.getElementById('js-circle-timer'); // タイマー画面
const timeLimitHourText = document.getElementById('js-time-limit-hour-text'); // 制限時間設定時の時間の表示
const timeLimitMinuteText = document.getElementById('js-time-limit-minute-text'); // 制限時間設定時の分の表示
const timeLimitSecondText = document.getElementById('js-time-limit-second-text'); // 制限時間設定時の秒の表示
const timeLimitChangeButtons = Array.from(document.getElementsByClassName('js-time-limit-change-button')); // 制限時間設定時の時間変更ボタン
const timeLimitResetButton = document.getElementById('js-time-limit-reset-button'); // 制限時間設定時のリセットボタン
const timeLimitSetButton = document.getElementById('js-time-limit-set-button'); // 制限時間設定時のタイマー開始ボタン
const remainingTimeCircle = document.getElementById('js-remaining-time'); // ターマーの残り時間のテキスト
const startButton = document.getElementById('js-start-button'); // タイマー開始ボタン
const stopButton = document.getElementById('js-stop-button'); // タイマー停止ボタン
const backButton = document.getElementById('js-back-button'); // 制限時間設定画面へ戻るボタン

// 制限時間の表示の更新
function updateTimeLimitText() {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (0 < timeLimit) {
        hours = Math.floor(timeLimit / (60 * 60));
        minutes = Math.floor(timeLimit / 60) - hours * 60;
        seconds = timeLimit - hours * 60 * 60 - minutes * 60;
    }
    timeLimitHourText.textContent = ('00' + hours).slice(-2);
    timeLimitMinuteText.textContent = ('00' + minutes).slice(-2);
    timeLimitSecondText.textContent = ('00' + seconds).slice(-2);
}

// 残り時間の表示の更新処理
function updateRemeiningTimeDisplay() {
    // 数字の更新
    let remainingTime = timeLimit * 1000 - elapsedTime;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;
    if (remainingTime < 0) {
        remainingTime = 0;
    } else if (0 < remainingTime) {
        hours = Math.floor(remainingTime / (60 * 60 * 1000));
        minutes = Math.floor(remainingTime / (60 * 1000)) - hours * 60;
        seconds = Math.floor(remainingTime / 1000) - hours * 60 * 60 - minutes * 60;
        milliseconds = remainingTime % 1000;
    }
    remainingTimeCircle.textContent = 
        ('00' + hours).slice(-2) + ' h ' + 
        ('00' + minutes).slice(-2) + ' m ' + 
        ('00' + seconds).slice(-2) + ' s ' + 
        ('000' + milliseconds).slice(-3);
    // 円グラフの更新
    if (remainingTime === 0) {
        remainingTimeCircle.style.backgroundImage = 'radial-gradient(#fff 0% 60%, transparent 60% 100%), conic-gradient(#E60012 0% 0%, #DCDDDD 0% 100%)';
    } else {
        const percentage1 = Math.floor(remainingTime / (timeLimit * 1000) * 1000) / 10;
        let percentage2 = percentage1 + 0.2;
        if (100 < percentage2) {
            percentage2 = 100;
        }
        remainingTimeCircle.style.backgroundImage = 'radial-gradient(#fff 0% 60%, transparent 60% 100%), conic-gradient(#E60012 0% ' + percentage1 + '%, #DCDDDD ' + percentage2 + '% 100%)';
    }
    // 残り時間がゼロになった場合はタイマーを終了する
    if (remainingTime === 0) {
        stopButton.style.display = 'none';
        clearInterval(intervalID);
    }
}

// タイマーの開始処理
function startTimer() {
    startTime = Date.now();
    startButton.style.display = 'none';
    stopButton.style.display = 'block';
    intervalID = setInterval(() => {
        elapsedTime = timeToAdd + Date.now() - startTime;
        updateRemeiningTimeDisplay();
    }, 10);
}

// 制限時間の変更ボタンを押した時の処理
timeLimitChangeButtons.forEach(element => {
    element.addEventListener('click', () => {
        timeLimit += Number(element.dataset.seconds);
        if (timeLimit < 0) {
            timeLimit = 0;
        } else if (99 * 3600 + 59 * 60 + 59 < timeLimit) {
            timeLimit = 99 * 3600 + 59 * 60 + 59;
        }
        updateTimeLimitText();
    });
});

// 制限時間設定画面でリセットボタンを押した時の処理
timeLimitResetButton.addEventListener('click', () => {
    timeLimit = 0;
    updateTimeLimitText();
});

// 制限時間設定画面でタイマー開始ボタンを押した時の処理
timeLimitSetButton.addEventListener('click', () => {
    if (timeLimit === 0) {
        alert('1秒以上の時間を設定してください。');
        return;
    }
    elapsedTime = 0;
    timeToAdd = 0;
    updateRemeiningTimeDisplay();
    startTimer();
    startButton.style.display = 'none';
    stopButton.style.display = 'block';
    timeLimitSet.style.display = 'none';
    circleTimer.style.display = 'block';
});

// スタートボタンを押した時の処理
startButton.addEventListener('click', () => {
    startTimer();
});

// ストップボタンを押した時の処理
stopButton.addEventListener('click', () => {
    startButton.style.display = 'block';
    stopButton.style.display = 'none';
    clearInterval(intervalID);
    timeToAdd = elapsedTime;
});

// 戻るボタンを押した時の処理
backButton.addEventListener('click', () => {
    clearInterval(intervalID);
    circleTimer.style.display = 'none'; 
    timeLimitSet.style.display = 'block';
});
