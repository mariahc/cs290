const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const profiles = require('./profiles.json').profiles;

const app = express();

let questions = [];
let attempts = 0;
let score = 0;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.locals.basedir = path.join(__dirname, 'views');
app.set('port', process.argv[2]);
app.use(express.static('static'));

// disable cache
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next()
})


app.get('/', function(req, res) {
  res.render('home', { title: 'puggy!', message: 'taste like pug!', js: 'home'});
});


app.get('/chat', function(req, res) {
  res.render('chat', { title: 'chat', js: 'chat'});
})


app.get('/browse', function(req, res) {
  res.render('browse', { title: 'browse', profiles });
})


app.get('/profile', function(req, res) {
  res.render('profile', { title: 'profile' });
})


// 404
app.use(function(req,res) {
  res.status(404);
  res.render('404');
});


// 500
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});


app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});