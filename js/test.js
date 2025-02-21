const questions = [
    {
        question: "Если человека назвали мордофиля, то это…",
        answers: [
            { text: "Значит, что он тщеславный", correct: true, explanation: "Мордофилей называют чванливого человека." },
            { text: "Значит, что у него лицо как у хряка", correct: false },
            { text: "Значит, что чумазый", correct: false }
        ],
        answered: false,
        correct: null
    },
    {
        question: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
        answers: [
            { text: "Он маленький и невзрачный", correct: true, explanation: "Фуфлыгой называют невзрачного малорослого человека." },
            { text: "Он тот еще алкоголик", correct: false },
            { text: "Он не держит свое слово", correct: false }
        ],
        answered: false,
        correct: null
    },
    {
        question: "Если человека прозвали пятигузом, значит, он…",
        answers: [
            { text: "Не держит слово", correct: true, explanation: "Пятигуз — это ненадежный человек, не держащий слово." },
            { text: "Изменяет жене", correct: false },
            { text: "Без гроша в кармане", correct: false }
        ],
        answered: false,
        correct: null
    },
    {
        question: "Кто такой шлындра?",
        answers: [
            { text: "Бродяга", correct: true, explanation: "Шлындра — это бродяга." },
            { text: "Обманщик", correct: false },
            { text: "Нытик", correct: false }
        ],
        answered: false,
        correct: null
    }
];

let shuffledQuestions = shuffleArray([...questions]);
let currentQuestionIndex = null;
let questionInProgress = false;
let correctAnswersCount = 0;
document.getElementById("startBtn").addEventListener("click", () => {
    if (currentQuestionIndex === null) {
        showQuestionList();
    } else {
        showQuestionList();
        currentQuestionIndex = null;
    }
});

function showQuestionList() {
    const questionContainer = document.getElementById("questionContainer");
    questionContainer.innerHTML = "";
    const answerContainer = document.getElementById("answerContainer");
    answerContainer.innerHTML = "";



    shuffledQuestions.forEach((question, index) => {
        const questionBlock = document.createElement("div");
        questionBlock.classList.add("question-block");


        if (question.answered) {
            const marker = document.createElement("span");
            marker.classList.add("result-marker");
            if (question.correct) {
                marker.classList.add("correct-marker");
                marker.textContent = " ✔";
            } else {
                marker.classList.add("incorrect-marker");
                marker.textContent = " ✘";
            }
            questionBlock.appendChild(marker);
        }

        const questionTitle = document.createElement("h2");
        questionTitle.textContent = `${index + 1}. ${question.question}`;
        questionBlock.appendChild(questionTitle);
        const allAnswered = shuffledQuestions.every(q => q.answered);


        if (!question.answered) {
            questionBlock.addEventListener("click", () => {
                currentQuestionIndex = index;
                showQuestionWithAnswers(index);
            });

        } else if(question.answered && allAnswered){
            questionBlock.addEventListener("click", () => {
                currentQuestionIndex = index;
                showQuestionAnswer(index);
            });

        }
        else {
            questionBlock.classList.add("disabled");
        }

        questionContainer.appendChild(questionBlock);


    });
    const allAnswered = shuffledQuestions.every(q => q.answered);
    if (allAnswered) {
        const completion = document.getElementById("completion");
        completion.textContent = "Вопросы закончились!";
        const statistics = document.getElementById("statistics");
        statistics.textContent = `Количество правильных ответов: ${correctAnswersCount} из ${shuffledQuestions.length}`;
    }
}

function showQuestionWithAnswers(index) {
    const questionData = shuffledQuestions[index];
    const questionContainer = document.getElementById("questionContainer");
    questionContainer.innerHTML = "";
    const answerContainer = document.getElementById("answerContainer");
    answerContainer.innerHTML = "";

    const questionBlock = document.createElement("div");
    questionBlock.classList.add("question-block");

    const questionTitle = document.createElement("h2");
    questionTitle.textContent =(index+1)+". "+questionData.question;
    questionBlock.appendChild(questionTitle);

    shuffleArray(questionData.answers).forEach(answer => {
        const answerBlock = document.createElement("div");
        answerBlock.classList.add("answer-block");
        answerBlock.textContent = answer.text;

        answerBlock.addEventListener("click", () => handleAnswerClick(answer, questionData, answerBlock, index));
        answerContainer.appendChild(answerBlock);
    });

    questionContainer.appendChild(questionBlock);
    questionInProgress = true;
    document.getElementById("startBtn").disabled = true;
}
function showQuestionAnswer(index) {
    const questionData = shuffledQuestions[index];
    const questionContainer = document.getElementById("questionContainer");
    questionContainer.innerHTML = "";
    const answerContainer = document.getElementById("answerContainer");
    answerContainer.innerHTML = "";

    const questionBlock = document.createElement("div");
    questionBlock.classList.add("question-block");

    const questionTitle = document.createElement("h2");
    questionTitle.textContent =(index+1)+". "+questionData.question;
    questionBlock.appendChild(questionTitle);

    shuffleArray(questionData.answers).forEach(answer => {
        if(answer.correct){
            const answerBlock = document.createElement("div");
            answerBlock.classList.add("correct");
            answerBlock.classList.add("answer-block");
            answerBlock.textContent = answer.text;
            answerBlock.textContent+="\nПояснение: " + answer.explanation;
            answerContainer.appendChild(answerBlock);

        }
    });
    questionContainer.appendChild(questionBlock);
}



function handleAnswerClick(answer, questionData, answerBlock, questionIndex) {
    const questionTitle = document.querySelector(".question-block h2");
    const marker = document.createElement("span");
    marker.classList.add("result-marker");
    answerBlock.classList.add("shake");

    const explanationBlock = document.createElement("div");
    explanationBlock.classList.add("explanation-block");

    if (answer.correct) {
        answerBlock.classList.add("correct");
        marker.classList.add("correct-marker");
        marker.textContent = "✔";

        questionData.correct = true;
        correctAnswersCount++;
        setTimeout(() => {

            document.querySelectorAll(".answer-block").forEach(block => {
                if (!block.classList.contains("correct")) {
                    block.classList.add("hidden");
                }
            });
            document.getElementById("startBtn").disabled = false;

            answerBlock.textContent+="\nПояснение: " + answer.explanation;

        }, 2500);

    } else {
        answerBlock.classList.add("incorrect");
        marker.classList.add("incorrect-marker");
        marker.textContent = "✘";
        questionData.correct = false;


        setTimeout(() => {
            document.querySelectorAll(".answer-block").forEach(block => {
                block.classList.add("hidden");
            });
            document.getElementById("startBtn").disabled = false;
        }, 2000);

    }
    setTimeout(() => {
        answerBlock.classList.remove("shake");
    }, 1000);

    questionData.answered = true;
    document.querySelectorAll(".answer-block").forEach(block => block.style.pointerEvents = "none");

    questionTitle.appendChild(marker);

}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

