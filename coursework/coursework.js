let playerName = "";
let score = 0;
let currentLevel = 0;
let timer;
let timeLeft = 60;
let isSequentialGame = false;

// Трижды повторяем каждый уровень
let subLevelAttempt = 1;
const MAX_SUB_ATTEMPTS = 3;

// Запоминаем, какие индексы уже использовали для 1 и 3 уровня, чтобы не повторять варианты
const usedFirstLevelIndices = [];
const usedThirdLevelIndices = [];

let currentSequence = [];
let correctIndex = 0;

let currentExpression = null;
let builtExpression = [];
let mathElementsContainer = null;
let expressionArea = null;
let resultBlock = null;

/* ---------- Наборы данных для уровней ---------- */
const levels = {
    1: {
        instructions: "Продолжите следующую последовательность, выбрав 6 чисел (двойной клик):",
        sequences: [
            [-2, 4, -8, 16, -32, 64, -128, 256, -512, 1024],
            [3, 5, 9, 17, 33, 65, 129, 257, 513, 1025],
            [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
            [5, 7, 11, 13, 17, 19, 23, 29, 31, 37],
            [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
        ]
    },
    2: {
        instructions: "Перетащите все 6 последовательностей в соответствующие зоны. Когда все будут размещены — уровень завершится.",
        sequences: [
            { type: "арифметическая", numbers: [7, 14, 21, 28, 35] },
            { type: "арифметическая", numbers: [2, 5, 8, 11, 14] },
            { type: "арифметическая", numbers: [10, 15, 20, 25, 30] },
            { type: "арифметическая", numbers: [3, 6, 9, 12, 15] },
            { type: "арифметическая", numbers: [-15, -8, -1, 6, 13] },
            { type: "арифметическая", numbers: [-1, 0, 1, 2, 3] },
            { type: "геометрическая", numbers: [3, 6, 12, 24, 48] },
            { type: "геометрическая", numbers: [1, 2, 4, 8, 16] },
            { type: "геометрическая", numbers: [-5, -10, -20, -40, -80] },
            { type: "геометрическая", numbers: [2, 6, 18, 54, 162] },
            { type: "геометрическая", numbers: [128, 64, 32, 16, 8] },
            { type: "геометрическая", numbers: [100, 10, 1, 0.1, 0.01] }
        ]
    },
    3: {
        instructions: "Соберите арифметическое выражение, последовательно выбирая элементы (одинарный клик).",
        expressions: [
            { left: ["12", "/", "4", "+", "7"], right: "10" },
            { left: ["6", "+", "3"], right: "9" },
            { left: ["15", "/", "5", "-", "7", "*", "2"], right: "-11" },
            { left: ["10", "*", "2", "-", "4"], right: "16" },
            { left: ["63", "/", "9"], right: "7" }
        ]
    }
};

/* ---------- Старт игры (последовательный режим) ---------- */
function startGame() {
    playerName = document.getElementById("player-name").value.trim();
    if (!playerName) {
        alert("Введите имя!");
        return;
    }
    isSequentialGame = true;
    currentLevel = 1;
    score = 0;
    timeLeft = 60;
    subLevelAttempt = 1;
    usedFirstLevelIndices.length = 0;
    usedThirdLevelIndices.length = 0;

    document.getElementById("start-screen").classList.remove("active");
    document.getElementById("level-selection-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");

    document.getElementById("level-title").textContent = `Уровень ${currentLevel}`;
    document.getElementById("game-instructions").textContent = levels[currentLevel].instructions;

    startTimer();
    loadSubLevel();
}

/* ---------- Экран выбора уровня (одиночный режим) ---------- */
function goToLevelSelection() {
    playerName = document.getElementById("player-name").value.trim();
    if (!playerName) {
        alert("Введите имя!");
        return;
    }
    document.getElementById("start-screen").classList.remove("active");
    document.getElementById("level-selection-screen").classList.add("active");
}

/* ---------- Выбор уровня (одиночный режим) ---------- */
function selectLevel(level) {
    playerName = document.getElementById("player-name").value.trim();
    if (!playerName) {
        alert("Введите имя!");
        return;
    }
    isSequentialGame = false;
    currentLevel = level;
    score = 0;
    timeLeft = 60;
    subLevelAttempt = 1;
    usedFirstLevelIndices.length = 0;
    usedThirdLevelIndices.length = 0;

    document.getElementById("level-selection-screen").classList.remove("active");
    document.getElementById("start-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");

    document.getElementById("level-title").textContent = `Уровень ${level}`;
    document.getElementById("game-instructions").textContent = levels[level].instructions;

    startTimer();
    loadSubLevel();
}

/* ---------- Таймер ---------- */
function startTimer() {
    document.getElementById("time-left").textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

/* ---------- Загрузка подуровня ---------- */
function loadSubLevel() {
    const gameArea = document.getElementById("game-area");
    gameArea.innerHTML = "";

    document.getElementById("level-title").textContent =
        `Уровень ${currentLevel} (${subLevelAttempt} из 3)`;
    document.getElementById("game-instructions").textContent = levels[currentLevel].instructions;

    if (currentLevel === 1) {
        loadSequenceGame();
    } else if (currentLevel === 2) {
        loadSortingGame();
    } else if (currentLevel === 3) {
        loadMathGame();
    }
}

/* ---------- Уровень 1: продолжение последовательности ---------- */
function loadSequenceGame() {
    const seqs = levels[1].sequences;
    let seqIndex;
    do {
        seqIndex = Math.floor(Math.random() * seqs.length);
    } while (usedFirstLevelIndices.includes(seqIndex) && usedFirstLevelIndices.length < seqs.length);

    usedFirstLevelIndices.push(seqIndex);
    currentSequence = seqs[seqIndex];
    correctIndex = 4;

    const instr = `${levels[1].instructions} ${currentSequence.slice(0,4).join(", ")} ...`;
    document.getElementById("game-instructions").textContent = instr;

    const correctPart = currentSequence.slice(4);
    const distractors = generateRandomNumbers(correctPart);
    const choices = [...correctPart, ...distractors];
    shuffleArray(choices);

    const gameArea = document.getElementById("game-area");
    choices.forEach(num => {
        const div = document.createElement("div");
        div.className = "number";
        div.textContent = num;
        // Двойной клик
        div.ondblclick = () => checkSequenceAnswer(div);
        gameArea.appendChild(div);
    });
}

function checkSequenceAnswer(element) {
    const needed = currentSequence[correctIndex];
    const chosen = parseInt(element.textContent);

    if (chosen === needed) {
        element.classList.add("correct");
        score += 10;
        correctIndex++;
        document.getElementById("score").textContent = score;
        if (correctIndex === 10) {
            setTimeout(finishSubLevel, 500);
        }
    } else {
        element.classList.add("incorrect");
        score -= 5;
        document.getElementById("score").textContent = score;
        setTimeout(() => element.classList.remove("incorrect"), 300);
    }
}

/* ---------- Уровень 2: распределить последовательности ---------- */
let placedCount = 0;
let totalSequences = 0;

function loadSortingGame() {
    const gameArea = document.getElementById("game-area");
    gameArea.innerHTML = "";

    // Верхний контейнер
    const topRow = document.createElement("div");
    topRow.id = "sequence-pool";
    topRow.style.minHeight = "70px";
    topRow.style.minWidth = "400px";
    topRow.style.display = "flex";
    topRow.style.flexWrap = "wrap";
    topRow.style.justifyContent = "center";
    gameArea.appendChild(topRow);

    // Зоны
    const zonesRow = document.createElement("div");
    zonesRow.id = "drop-zone-container";
    zonesRow.style.display = "flex";
    zonesRow.style.justifyContent = "space-around";
    zonesRow.style.width = "80%";
    zonesRow.style.margin = "10%";
    gameArea.appendChild(zonesRow);

    const arithmeticZone = createDropZone("арифметическая");
    const geometricZone = createDropZone("геометрическая");
    zonesRow.appendChild(arithmeticZone);
    zonesRow.appendChild(geometricZone);

    const allSeq = [...levels[2].sequences];
    shuffleArray(allSeq);
    const chosen = allSeq.slice(0, 6);
    totalSequences = chosen.length;
    placedCount = 0;

    chosen.forEach((item, idx) => {
        const div = document.createElement("div");
        div.className = "sequence";
        div.textContent = item.numbers.join(", ");
        div.dataset.type = item.type;
        div.dataset.originalIndex = idx.toString();
        div.draggable = true;

        div.ondragstart = (e) => {
            e.dataTransfer.setData("dragged-type", item.type);
            e.dataTransfer.setData("dragged-index", idx.toString());
        };
        topRow.appendChild(div);
    });
}

function createDropZone(type) {
    const zone = document.createElement("div");
    zone.className = "drop-zone";
    zone.dataset.type = type;
    zone.style.display = "flex";
    zone.style.flexDirection = "column";
    zone.style.alignItems = "center";
    zone.style.minWidth = "250px";

    if (type === "арифметическая") {
        zone.textContent = "Арифметическая прогрессия";
    } else {
        zone.textContent = "Геометрическая прогрессия";
    }

    zone.ondragover = (e) => e.preventDefault();
    zone.ondrop = (e) => dropSequence(e, zone);

    return zone;
}

function dropSequence(event, zone) {
    event.preventDefault();
    const draggedType = event.dataTransfer.getData("dragged-type");
    const draggedIndex = event.dataTransfer.getData("dragged-index");

    const sequencePool = document.getElementById("sequence-pool");
    const zonesRow = document.getElementById("drop-zone-container");
    const allSeq = [
        ...sequencePool.querySelectorAll(".sequence"),
        ...zonesRow.querySelectorAll(".sequence")
    ];
    const draggedElem = allSeq.find(seq => seq.dataset.originalIndex === draggedIndex);

    if (draggedElem) {
        // Передвигаем карточку
        const oldParent = draggedElem.parentNode;
        zone.appendChild(draggedElem);

        // Если блок не был в зоне, значит это первый раз
        if (oldParent.id === "sequence-pool") {
            placedCount++;
        }

        if (placedCount === totalSequences) {
            finalizeSortingLevel();
        }
    }
}

function finalizeSortingLevel() {
    clearInterval(timer);

    const sequencePool = document.getElementById("sequence-pool");
    const zonesRow = document.getElementById("drop-zone-container");
    const allSeq = [
        ...sequencePool.querySelectorAll(".sequence"),
        ...zonesRow.querySelectorAll(".sequence")
    ];

    // Подсвечиваем
    allSeq.forEach(seq => {
        seq.classList.remove("correct", "incorrect");
    });

    allSeq.forEach(seq => {
        if (seq.parentNode.classList.contains("drop-zone")) {
            const zoneType = seq.parentNode.dataset.type;
            if (zoneType === seq.dataset.type) {
                seq.classList.add("correct");
                score += 10;
            } else {
                seq.classList.add("incorrect");
                score -= 5;
            }
        } else {
            seq.classList.add("incorrect");
            score -= 5;
        }
    });
    document.getElementById("score").textContent = score;

    setTimeout(() => {
        finishSubLevel();
    }, 700);
}

/* ---------- Уровень 3: собрать арифм. выражение ---------- */
function loadMathGame() {
    const gameArea = document.getElementById("game-area");
    gameArea.innerHTML = "";

    const mathContainer = document.createElement("div");
    mathContainer.className = "math-area";
    gameArea.appendChild(mathContainer);

    // Выбираем выражение, не повторяя
    const exprs = levels[3].expressions;
    let exprIndex;
    do {
        exprIndex = Math.floor(Math.random() * exprs.length);
    } while (usedThirdLevelIndices.includes(exprIndex) && usedThirdLevelIndices.length < exprs.length);

    usedThirdLevelIndices.push(exprIndex);
    currentExpression = exprs[exprIndex];
    builtExpression = [];

    // Создаем контейнеры
    mathElementsContainer = document.createElement("div");
    mathElementsContainer.className = "math-elements-container";
    mathContainer.appendChild(mathElementsContainer);

    const exprZoneContainer = document.createElement("div");
    exprZoneContainer.className = "expression-zone";
    mathContainer.appendChild(exprZoneContainer);

    expressionArea = document.createElement("div");
    expressionArea.id = "expression-area";
    expressionArea.className = "drop-zone";
    exprZoneContainer.appendChild(expressionArea);

    resultBlock = document.createElement("div");
    resultBlock.id = "result-block";
    resultBlock.textContent = `= ${currentExpression.right}`;
    exprZoneContainer.appendChild(resultBlock);

    // Создаем элементы
    const elements = [...currentExpression.left];
    shuffleArray(elements);

    elements.forEach(elem => {
        const div = createAnimatedElement(elem);
        mathElementsContainer.appendChild(div);
    });
}

function createAnimatedElement(textValue) {
    const div = document.createElement("div");
    div.className = "math-element";

    // Генерируем случайные параметры
    const animNames = ["floatAround1", "floatAround2", "floatAround3"];
    const randomAnim = animNames[Math.floor(Math.random() * animNames.length)];

    const randDuration = (Math.random() * 2 + 2).toFixed(1); // 2..4 c
    const randDelay = (Math.random() * 2).toFixed(1);        // 0..2 c
    const randDir = Math.random() > 0.5 ? "alternate-reverse" : "alternate";

    // Сохраняем их в dataset, чтобы потом можно было восстановить
    div.dataset.animName = randomAnim;
    div.dataset.animDuration = randDuration;
    div.dataset.animDelay = randDelay;
    div.dataset.animDirection = randDir;

    // Применяем
    applyFloatAnimation(div);

    // Одинарный клик
    div.onclick = () => selectMathElement(div);

    div.textContent = textValue;
    return div;
}

function applyFloatAnimation(el) {
    el.style.animationName = el.dataset.animName;
    el.style.animationDuration = el.dataset.animDuration + "s";
    el.style.animationDelay = el.dataset.animDelay + "s";
    el.style.animationDirection = el.dataset.animDirection;
    el.style.animationIterationCount = "infinite";
    el.style.animationTimingFunction = "ease-in-out";
}

function removeAnimation(el) {
    el.style.animationName = "";
    el.style.animationDuration = "";
    el.style.animationDelay = "";
    el.style.animationDirection = "";
    el.style.animationIterationCount = "";
    el.style.animationTimingFunction = "";
}

function selectMathElement(element) {
    // Снимаем анимацию перед переносом в expressionArea
    removeAnimation(element);

    expressionArea.appendChild(element);
    builtExpression.push(element.textContent);

    if (builtExpression.length === currentExpression.left.length) {
        checkMathExpression();
    }
}

function checkMathExpression() {
    if (!builtExpression.length) return;
    let expressionString = builtExpression.join(" ");
    let userResult;
    try {
        userResult = eval(expressionString);
    } catch {
        userResult = null;
    }
    let needed = parseFloat(currentExpression.right);

    if (userResult === needed) {
        score += 20;
        document.getElementById("score").textContent = score;
        setTimeout(finishSubLevel, 700);
    } else {
        // Ошибка: подсвечиваем и возвращаем наверх
        score -= 10;
        document.getElementById("score").textContent = score;
        [...expressionArea.children].forEach(el => el.classList.add("incorrect"));

        setTimeout(() => {
            [...expressionArea.children].forEach(el => {
                el.classList.remove("incorrect");
                // Возвращаем в mathElementsContainer
                mathElementsContainer.appendChild(el);
                // Снова даем анимацию, чтобы элемент опять двигался
                applyFloatAnimation(el);
            });
            builtExpression = [];
        }, 500);
    }
}

/* ---------- Завершение подуровня ---------- */
function finishSubLevel() {
    clearInterval(timer);

    subLevelAttempt++;
    if (subLevelAttempt > MAX_SUB_ATTEMPTS) {
        nextLevel();
    } else {
        timeLeft = 60;
        startTimer();
        loadSubLevel();
    }
}

/* ---------- Переход к следующему уровню ---------- */
function nextLevel() {
    setTimeout(() => {
        if (isSequentialGame) {
            if (currentLevel < 3) {
                currentLevel++;
                subLevelAttempt = 1;
                timeLeft = 60;
                document.getElementById("level-title").textContent = `Уровень ${currentLevel}`;
                document.getElementById("game-instructions").textContent = levels[currentLevel].instructions;
                startTimer();
                loadSubLevel();
            } else {
                endGame();
            }
        } else {
            endGame();
        }
    }, 500);
}

/* ---------- Завершение игры ---------- */
function endGame() {
    clearInterval(timer);
    saveScore();
    document.getElementById("game-screen").classList.remove("active");
    document.getElementById("end-screen").classList.add("active");
    document.getElementById("final-score").textContent = `Ваш счет: ${score}`;
}

function restartGame() {
    location.reload();
}

/* ---------- Рейтинг ---------- */
function saveScore() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    leaderboard.push({ name: playerName, score });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function viewLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    if (!leaderboard.length) {
        alert("Пока нет результатов.");
        return;
    }
    let results = "Топ 10 игроков:\n";
    leaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .forEach((entry, index) => {
            results += `${index + 1}. ${entry.name}: ${entry.score}\n`;
        });
    alert(results);
}

function clearLeaderboard() {
    localStorage.removeItem("leaderboard");
    alert("Лидерборд успешно очищен!");
}

/* ---------- Вспомогательные функции ---------- */
function shuffleArray(arr) {
    arr.sort(() => Math.random() - 0.5);
}

function generateRandomNumbers(exclude) {
    let numbers = [];
    while (numbers.length < 10) {
        let rand = Math.floor(Math.random() * 100) - 50;
        if (!exclude.includes(rand) && !numbers.includes(rand)) {
            numbers.push(rand);
        }
    }
    return numbers;
}
