/* step 1 */
const step1 = document.getElementById('step1');
const startBtn = document.getElementById('startBtn');
const firstnameInput = document.getElementById('firstname');
const message = document.getElementById('message');
/* step 2 */
const step2 = document.getElementById('step2');
const greeting = document.getElementById('greeting');
const guessBtn = document.getElementById('guessBtn');
const userNumber = document.getElementById('userNumber');
const result = document.getElementById('result');
/* step 3 */
const step3 = document.getElementById('step3');
const great = document.getElementById('great');
const surprisBtn = document.getElementById('surprisBtn');
const captchaInClass = document.getElementById('captchaInClass');
const captchaInput = document.getElementById('captchaInput');
const captchaBtn = document.getElementById('captchaCheckBtn');
const captchaContainer = document.getElementById('captchaInClass');
const cinkText = document.getElementById('cink');
/* step 4 */
const step4 = document.getElementById('step4');
const leaderboardTable = document.getElementById('leaderboardTable');

let randomNumber = null;
let currentUser = '';
let startTimer = null;
let timerRunning = false;

let mouseOverTimeOut;


//Game
let nameList = JSON.parse(localStorage.getItem('nameList')) || [];

function startHiddenTimer() {
    if (!timerRunning) {
        startTimer = Date.now();
        timerRunning = true;
    }
}

function stopHiddenTimer() {
    if (timerRunning) {
        timerRunning = false;
        return Math.floor((Date.now() - startTimer) / 1000);
    }
    return 0;
}

startBtn.addEventListener('click', () => {
    const userName = firstnameInput.value.trim();
    message.textContent = '';

    if (userName.length === 0) {
        message.textContent = 'Пожалуйста, введите имя!';
        return;
    }

    if (nameList.some(n => n.toLowerCase() === userName.toLowerCase())) {
        message.textContent = 'Это имя уже занято, введите другое!';
        return;
    }

    nameList.push(userName);
    localStorage.setItem('nameList', JSON.stringify(nameList));
    localStorage.setItem('currentUser', userName);

    startHiddenTimer();

    currentUser = userName;
    step1.style.display = 'none';
    step2.style.display = 'block';
    step3.style.display = 'none';
    step4.style.display = 'none';
    captchaInClass.style.display = 'none';


    randomNumber = Math.floor(Math.random() * 100) + 1;
    greeting.textContent = currentUser;
    result.textContent = `${currentUser}, попробуй угадать число!`;

    userNumber.value = '';
    userNumber.focus();
});

guessBtn.addEventListener('click', () => {
    const guess = Number(userNumber.value);

    if (isNaN(guess) || guess < 1 || guess > 100) {
        alert('Введите число от 1 до 100');
        userNumber.value = '';
        userNumber.focus();
        return;
    }

    if (guess === randomNumber) {
        step1.style.display = 'none';
        step2.style.display = 'none';
        step3.style.display = 'block';
        step4.style.display = 'none';
        captchaInClass.style.display = 'none';
        userNumber.disabled = true;
        guessBtn.disabled = true;

    } else if (guess < randomNumber) {
        result.textContent = 'Загаданное число больше.';
    } else {
        result.textContent = 'Загаданное число меньше.';
    }

    userNumber.value = '';
    userNumber.focus();
});

// Поддержка нажатия Enter для удобства
firstnameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startBtn.click();
});

userNumber.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') guessBtn.click();
});

surprisBtn.addEventListener('mouseenter', () => {
    // Задержка 20 мс перед убеганием
    mouseOverTimeout = setTimeout(() => {
        const parent = surprisBtn.parentElement;
        const maxX = parent.clientWidth - surprisBtn.offsetWidth;
        const maxY = parent.clientHeight - surprisBtn.offsetHeight;

        // Случайные новые координаты в пределах родителя
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;

        surprisBtn.style.position = 'absolute';
        surprisBtn.style.left = newX + 'px';
        surprisBtn.style.top = newY + 'px';
        cinkText.style.display = 'block';
    }, 20);
});

surprisBtn.addEventListener('mouseleave', () => {
    // Если курсор ушел раньше 20 мс — не убегать
    clearTimeout(mouseOverTimeout);
});

surprisBtn.addEventListener('click', () => {
    step1.style.display = 'none';
    step3.style.display = 'none';
    step2.style.display = 'none';
    step4.style.display = 'none';
    captchaInClass.style.display = 'block';
    renderCaptcha('captchaSVG');
    captchaInput.value = '';
    captchaInput.focus();
});


//Captcha

function generateCaptchaText(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let textCaptcha = '';
    for (let i = 0; i < length; i++) {
        textCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return textCaptcha;
}

// Функция создания SVG с текстом капчи
function generateCaptchaSVG(text) {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="50">
      <rect width="150" height="50" fill="#eef3f7"></rect>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial" font-size="30" fill="#333">${text}</text>
    </svg>
  `;
}

// Вставляет SVG капчи в контейнер по id
function renderCaptcha(id) {
    const text = generateCaptchaText();  // генерируем новый текст
    window.captchaText = text;            // сохраняем глобально для проверки
    const svg = generateCaptchaSVG(text);
    document.getElementById(id).innerHTML = svg;
}

// Обработчик проверки капчи при нажатии кнопки
captchaBtn.addEventListener('click', () => {
    const userInput = captchaInput.value.trim().toLowerCase();
    if (userInput === window.captchaText.toLowerCase()) {
        captchaContainer.style.display = 'none';
        step4.style.display = 'block';
        const elapsedTime = stopHiddenTimer();
        addToLeaderboard(currentUser, elapsedTime);
        captchaMessage.style.color = 'green';
        captchaMessage.textContent = `Поздравляем, ${currentUser}! Вы прошли игру за ${elapsedTime} сек.`;
    } else {
        alert('Неверная капча, попробуйте снова');
        captchaInput.value = '';
        captchaInput.focus();
        // Генерируем и показываем новую капчу
        renderCaptcha('captchaSVG');
    }

});

//Leaderboard

let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

function addToLeaderboard(name, time) {
    leaderboard.push({ name, time });
    leaderboard.sort((a, b) => a.time - b.time);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    renderLeaderboard();
}

function renderLeaderboard() {
    const tbody = document.querySelector('#leaderboardTable tbody');
    tbody.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.time}</td>
    `;
        tbody.appendChild(row);
    });
}

renderLeaderboard();

