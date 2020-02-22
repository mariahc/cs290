const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

let questions = [];
let attempts = 0;
let score = 0;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('port', process.argv[2]);
app.use(express.static('static'));


app.get('/', function(req, res) {
  res.render('index', { title: 'puggy!', message: 'taste like pug!'});
});


app.get('/trivia', function(req, res) {
  res.render('trivia', { title: 'trivia' });
});


/*
  Get next trivia question
 */
app.get('/next', function(req, res, next) {
  getQuestion().then(question => {
    res.json({ attempts, score, ...questions.pop() });
  })
});


/*
  Submit an answer
 */
app.post('/answer', function(req, res) {
  const correct = req.body['correct'];
  if (correct) {
    score++;
  }
  attempts++;

  res.json({correct})
});


app.use(function(req,res) {
  res.status(404);
  res.render('404');
});


app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});


app.listen(app.get('port'), function() {
  console.log('Server started on port' + app.get('port'));
});


function getQuestion() {
  return new Promise((resolve, reject) => {
    // check if there are enough questions, otherwise get more
    if (questions.length == 0) {
      const url = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple';
      axios.get(url).then(res => {
        questions = res.data.results;
        resolve(questions.pop());
      })
    } else {
      resolve(questions.pop());
    }
  })
}
