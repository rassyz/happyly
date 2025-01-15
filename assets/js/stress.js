import { saveTestResult } from './getdb.js';

const questions = [
    {
        question: "Apakah anda sering merasa gelisah atau tegang tanpa alasan yang jelas?",
        options: ["Tidak Pernah", "Beberapa Hari", "Sebagian Besar Hari", "Setiap Hari"],
        points: [0, 1, 2, 3]
    },
    {
        question: "Apakah anda merasa kesulitan tidur atau terbangun di malam hari?",
        options: ["Tidak Pernah", "Beberapa Hari", "Sebagian Besar Hari", "Setiap Hari"],
        points: [0, 1, 2, 3]
    },
    {
        question: "Apakah anda merasa perubahan berat badan yang signifikan dalam beberapa bulan terakhir?",
        options: ["Tidak Pernah", "Beberapa Hari", "Sebagian Besar Hari", "Setiap Hari"],
        points: [0, 1, 2, 3]
    },
    {
        question: "Apakah anda merasa kesulitan berkonsentrasi atau sering lupa hal-hal kecil?",
        options: ["Tidak Pernah", "Beberapa Hari", "Sebagian Besar Hari", "Setiap Hari"],
        points: [0, 1, 2, 3]
    },
    {
        question: "Apakah anda sering merasa lelah atau kehabisan energi, meskipun sudah istirahat cukup?",
        options: ["Tidak Pernah", "Beberapa Hari", "Sebagian Besar Hari", "Setiap Hari"],
        points: [0, 1, 2, 3]
    },
    {
        question: "Apakah anda sering mengalami sakit kepala atau gangguan pencernaan yang tidak biasa?",
        options: ["Tidak Pernah", "Beberapa Hari", "Sebagian Besar Hari", "Setiap Hari"],
        points: [0, 1, 2, 3]
    },
    {
        question: "Apakah anda sering merasa cemas atau takut tanpa alasan yang jelas?",
        options: ["Tidak Pernah", "Beberapa Hari", "Sebagian Besar Hari", "Setiap Hari"],
        points: [0, 1, 2, 3]
    },
    {
        question: "Apakah anda sering merasa kesulitan menghadapi masalah sehari-hari atau menangani situasi stress?",
        options: ["Tidak Pernah", "Beberapa Hari", "Sebagian Besar Hari", "Setiap Hari"],
        points: [0, 1, 2, 3]
    },
    {
        question: "Apakah anda sering merasa tertekan atau putus asa dalam situasi tertentu?",
        options: ["Tidak Pernah", "Beberapa Hari", "Sebagian Besar Hari", "Setiap Hari"],
        points: [0, 1, 2, 3]
    },
    {
        question: "Apakah anda sering merasa mudah tersinggung atau emosional dalam situasi sehari-hari?",
        options: ["Tidak Pernah", "Beberapa Hari", "Sebagian Besar Hari", "Setiap Hari"],
        points: [0, 1, 2, 3]
    }
];

let currentQuestion = 0;
const userAnswers = Array(questions.length).fill(null);
let timer = 600;

const questionContainer = document.getElementById("question-container");
const nextButton = document.getElementById("next-button");
const backButton = document.getElementById("back-button");
const progressBar = document.getElementById("progress-bar");
const questionProgress = document.getElementById("question-progress");
const resultContainer = document.getElementById("result-container");
const pointElement = document.getElementById("point");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const resultImageElement = document.getElementById("result-image");
const diagnosisElement = document.getElementById("diagnosis");


function loadQuestion(index) {
    const question = questions[index];
    questionContainer.innerHTML = `
        <h5 class="mb-3">Test ${index + 1}</h5>
        <p>${question.question}</p>
        ${question.options.map((option, i) => `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="question" id="q${index + 1}o${i}" value="${question.points[i]}" ${userAnswers[index] === question.points[i] ? 'checked' : ''}>
                <label class="form-check-label" for="q${index + 1}o${i}">${option}</label>
            </div>
        `).join("")}
    `;
    backButton.classList.toggle("d-none", index === 0);

    if (index === questions.length - 1) {
        nextButton.textContent = "Finish";
        nextButton.classList.replace("btn-next", "btn-finish");
    } else {
        nextButton.textContent = "Next →";
        nextButton.classList.replace("btn-finish", "btn-next");
    }
}

function updateProgress() {
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    questionProgress.textContent = `Test ${currentQuestion + 1} out of ${questions.length}`;
}

function updateTimer() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    if (timer > 0) {
        timer--;
    } else {
        finishQuiz();
    }
}

function calculateScore() {
    return userAnswers.reduce((total, points) => total + (points || 0), 0);
}

function finishQuiz() {
    const points = calculateScore();
    const percentage = Math.round((points / (questions.length * 3)) * 100);

    pointElement.textContent = `${points}`;
    scoreElement.textContent = `${percentage}%`;

    let diagnosis = "";
    let imageUrl = "";
    
    if (points <= 10) {
        diagnosis = "Tingkat Stress Rendah.";
        imageUrl = "assets/img/low.png";
    } else if (points <= 20) {
        diagnosis = "Tingkat Stress Sedang. Segerea klik informasi penanganan stress untuk mengetahui lebih lanjut.";
        imageUrl = "assets/img/medium.png";
    } else if (points <= 30) {
        diagnosis = "Tingkat Stress Tinggi. Segerea klik informasi penanganan stress untuk mengetahui lebih lanjut.";
        imageUrl = "assets/img/high.png";
    }

    diagnosisElement.textContent = diagnosis;
    resultImageElement.src = imageUrl;

    questionContainer.parentElement.classList.add("d-none");
    resultContainer.classList.remove("d-none");

    // Panggil fungsi saveTestResult untuk menyimpan hasil quiz ke database
    saveTestResult(points, percentage, userAnswers);
}

nextButton.addEventListener("click", () => {
    const selectedOption = document.querySelector("input[name='question']:checked");
    if (selectedOption) {
        userAnswers[currentQuestion] = parseInt(selectedOption.value);
    }
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion(currentQuestion);
        updateProgress();
    } else {
        finishQuiz();
    }
});

backButton.addEventListener("click", () => {
    const selectedOption = document.querySelector("input[name='question']:checked");
    if (selectedOption) {
        userAnswers[currentQuestion] = parseInt(selectedOption.value);
    }
    currentQuestion--;
    loadQuestion(currentQuestion);
    updateProgress();
});

window.restartTest = function() {
    currentQuestion = 0;
    userAnswers.fill(null);
    resultContainer.classList.add("d-none");
    questionContainer.parentElement.classList.remove("d-none");
    progressBar.style.width = `20%`;
    questionProgress.textContent = `Test 1 out of ${questions.length}`;
    loadQuestion(currentQuestion);
    timer = 600;
}

loadQuestion(currentQuestion);
updateProgress();
setInterval(updateTimer, 1000);