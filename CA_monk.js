document.addEventListener('DOMContentLoaded', function() {
  let currentQuestion = 0;
  let score = 0;
  let timer = null;
  const questionContainer = document.getElementById('question-container');
  const optionsContainer = document.getElementById('options-container');
  const resultContainer = document.getElementById('result-container');
  const nextButton = document.getElementById('next-button');

  fetch('https://raw.githubusercontent.com/yghugardare/Sample/main/sample.json')
    .then(response => response.json())
    .then(data => {
      const quizData = data.data.questions;

      displayQuestion();

      function displayQuestion() {
        questionContainer.innerHTML = '';
        optionsContainer.innerHTML = '';
        if (nextButton) {
          nextButton.disabled = true;
        }
        const question = quizData[currentQuestion];
        const sentence = question.question;
        const blanks = sentence.split('_____________');
        const blankContainer = document.createElement('div');
        let blankIndex = 0;
        for (let i = 0; i < blanks.length - 1; i++) {
          const blank = document.createElement('select');
          blank.id = `blank-${blankIndex}`;
          const option = document.createElement('option');
          option.value = '';
          option.text = 'Select an option';
          blank.appendChild(option);
          question.options.forEach(opt => {
            const optionElement = document.createElement('option');
            optionElement.value = opt;
            optionElement.text = opt;
            blank.appendChild(optionElement);
          });
          blank.onchange = checkFilled;
          blankContainer.appendChild(document.createTextNode(blanks[i]));
          blankContainer.appendChild(blank);
          blankIndex++;
        }
        blankContainer.appendChild(document.createTextNode(blanks[blanks.length - 1]));
        questionContainer.appendChild(blankContainer);
        nextButton.onclick = checkAnswer;
        if (nextButton) {
          nextButton.disabled = true;
        }
      }

      function checkFilled() {
        const question = quizData[currentQuestion];
        let allFilled = true;
        for (let i = 0; i < question.correctAnswer.length; i++) {
          const blank = document.getElementById(`blank-${i}`);
          if (blank.value === '') {
            allFilled = false;
          }
        }
        if (nextButton) {
          nextButton.disabled = !allFilled;
        }
      }

      function checkAnswer() {
        const question = quizData[currentQuestion];
        const blanks = [];
        for (let i = 0; i < question.correctAnswer.length; i++) {
          const blank = document.getElementById(`blank-${i}`);
          blanks.push(blank.value);
        }
        if (JSON.stringify(blanks) === JSON.stringify(question.correctAnswer)) {
          score++;
        }
        currentQuestion++;
        if (currentQuestion >= quizData.length) {
          displayResult();
        } else {
          displayQuestion();
        }
      }

      function displayResult() {
        questionContainer.innerHTML = '';
        optionsContainer.innerHTML = '';
        nextButton.style.display = 'none';
        let resultHtml = '';
        quizData.forEach((question, index) => {
          resultHtml += `Question ${index + 1}: ${question.question}<br>`;
          resultHtml += `Correct answer: ${question.correctAnswer.join(', ')}<br>`;
        });
        resultHtml += `Your score: ${score} / ${quizData.length}`;
        resultContainer.innerHTML = resultHtml;
      }
      const crossButton = document.getElementById('cross-button');
      const quitModal = document.getElementById('quit-modal');
      const quitYes = document.getElementById('quit-yes');
      const quitNo = document.getElementById('quit-no');
    
      crossButton.onclick = function() {
        quitModal.style.display = 'block';
      };
    
      quitYes.onclick = function() {
        displayResult();
        quitModal.style.display = 'none';
      };
    
      quitNo.onclick = function() {
        quitModal.style.display = 'none';
      };
    
    
    })
    .catch(error => console.error('Error:', error));
});
 