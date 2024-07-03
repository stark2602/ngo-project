document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let fileInput = document.getElementById('wordFile');
    let formData = new FormData();
    formData.append('wordFile', fileInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        currentQuestionIndex = 0;
        displayQuestion();
    });
});

let questions = [];
let currentQuestionIndex = 0;
let answers = [];

function displayQuestion() {
    document.getElementById('questionnaire').style.display = 'block';
    document.getElementById('question').innerText = questions[currentQuestionIndex];
    document.getElementById('answer').value = answers[currentQuestionIndex] || '';
}

document.getElementById('nextBtn').addEventListener('click', function() {
    answers[currentQuestionIndex] = document.getElementById('answer').value;
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        displaySummary();
    }
});

document.getElementById('prevBtn').addEventListener('click', function() {
    answers[currentQuestionIndex] = document.getElementById('answer').value;
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
});

function displaySummary() {
    document.getElementById('questionnaire').style.display = 'none';
    let summaryContent = '';
    for (let i = 0; i < questions.length; i++) {
        summaryContent += `<p><strong>Q${i + 1}:</strong> ${questions[i]}</p>`;
        summaryContent += `<p><strong>A:</strong> ${answers[i]}</p>`;
    }
    document.getElementById('summaryContent').innerHTML = summaryContent;
    document.getElementById('summary').style.display = 'block';
}

document.getElementById('downloadBtn').addEventListener('click', function() {
    let content = 'Questions and Answers\n\n';
    for (let i = 0; i < questions.length; i++) {
        content += `Q${i + 1}: ${questions[i]}\nA: ${answers[i]}\n\n`;
    }
    let blob = new Blob([content], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'responses.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
