const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const session = require('express-session');

const profiles = require('./profiles.json').profiles;

const app = express();

let questions = [];
let attempts = 0;
let score = 0;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false
}));

// initialize session
app.use(function(req, res, next) {
  if (!req.session.chat) {
    req.session.chat = {};
  }

  next();
})

app.set('view engine', 'pug');
app.locals.basedir = path.join(__dirname, 'views');
app.set('port', process.argv[2]);
app.use(express.static('static'));

// disable cache
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});


app.get('/', function(req, res) {
  res.render('home', { title: 'puggy!', message: 'taste like pug!', js: 'home'});
});


app.get('/chat', function(req, res) {
  const { user } = req.query;

  if (!user) {
    // redirect to a random user
    const randIndex = Math.floor(Math.random() * profiles.length);
    const randProfile = profiles[randIndex];
    res.redirect(`/chat?user=${randProfile.name}`);
  } else {
    // try to get the user's chat logs
    const profile = profiles.find( p => p.name === user );
    if (profile) {
      if (req.session.chat[user]) {
        res.render('chat', {
          title: 'chat',
          js: 'chat',
          user: user,
          messages: req.session.chat[user]
        });

      } else {
        req.session.chat[user] = [];
        res.render('chat', {
          title: 'chat',
          js: 'chat',
          user: user,
          messages: req.session.chat[user]
        });
      }
    } else {
      res.sendStatus(404);
    }
  }
});


app.get('/browse', function(req, res) {
  res.render('browse', { title: 'browse', profiles });
});


app.get('/profile', function(req, res) {
  const { user } = req.query;

  if (!user) {
    // go to a random user
    const randIndex = Math.floor(Math.random() * profiles.length);
    const randProfile = profiles[randIndex];
    res.redirect(`/profile?user=${randProfile.name}`);
  } else {
    const profile = profiles.find( p => p.name == user );
    if (profile) {
      res.render('profile', { title: 'profile', profile });
    } else {
      res.sendStatus(404);
    }
  }
});


app.post('/send', function(req, res) {
  const { text, user, sender } = req.body;
  req.session.chat[user].push({ sender, text });
  res.json({ chat: req.session.chat[user] });
});


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