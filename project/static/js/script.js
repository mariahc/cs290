/*
  Second answer to server
 */
function onAnswer(e) {
  const { answer, correct } = e.target.dataset;
  console.log(answer + ' answered');
  postRequest('http://localhost:3000/answer', {correct: correct == answer})
    .then(res => {
      showAnswer(answer);
  });
}


/*
  Setup new question and answers
 */
function newRound() {
  resetAnswer();
  setQuestions();
}


/*
  Get new question from server and assign
 */
function setQuestions() {
  getRequest('http://localhost:3000/next').then(res => {
    // set recent score
    const scoreElem = document.getElementById('score');
    scoreElem.innerHTML = `Score: ${res.score}/${res.attempts}`;

    // assign question
    const questionElem = document.getElementById('question');
    questionElem.innerHTML = res.question;

    // assign answers
    const answers = [res.correct_answer].concat(res.incorrect_answers);
    answers.sort();
    const answerBtns = document.getElementsByClassName('answer');
    for (let i = 0 ; i < 4 ; i++) {
      answerBtns[i].dataset.correct = res.correct_answer;
      answerBtns[i].dataset.answer = answers[i];
      answerBtns[i].innerHTML = answers[i];
      answerBtns[i].onclick = onAnswer;
    }
  });
}


/*
  Highlist correct answer
 */
function showAnswer(guess) {
  const answerBtns = document.getElementsByClassName('answer');
  for (let btn of answerBtns) {
    const { answer, correct } = btn.dataset;
    if (answer == guess && answer != correct) {
      btn.classList.add('wrong');
    }

    if (answer == correct) {
      btn.classList.add('correct');
    }
  }
}


/*
  Reset answer buttons
 */
function resetAnswer() {
  const answerBtns = document.getElementsByClassName('answer');
  for (let btn of answerBtns) {
    btn.classList.remove('correct');
    btn.classList.remove('wrong');
  }
}


function getRequest(url) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open('get', url, true);
    req.addEventListener('load', () => {
      let res = JSON.parse(req.responseText);
      resolve(res);
    });
    req.send(null);
  })
}


function postRequest(url, payload) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
      let res = JSON.parse(req.responseText);
      resolve(res);
    })
    req.send(JSON.stringify(payload));
  })
}


/*
  Bind buttons' onclick event
 */
function bindButtons() {
  const nextBtn = document.getElementById('next');
  nextBtn.onclick = newRound;

  const answerBtns = document.getElementsByClassName('answer');
  for (let btn of answerBtns) {
    btn.onclick = onAnswer;
  }
}


function main() {
  bindButtons();
  newRound();
}


document.addEventListener('DOMContentLoaded', main);