const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const session = require('express-session');

const profiles = require('./profiles.json').profiles;

const app = express();

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
});

app.set('view engine', 'pug');
app.locals.basedir = path.join(__dirname, 'views');
app.set('port', process.argv[2]);
app.use(express.static('static'));


/*
  Displays homepage
 */
app.get('/', function(req, res) {
  res.render('home', { title: 'hay love', js: 'home'});
});


/*
  Displays provided user's chat, otherwise random chat
 */
app.get('/chat', function(req, res) {
  const { name } = req.query;

  if (!name) {
    // redirect to a random user
    const randIndex = Math.floor(Math.random() * profiles.length);
    const randProfile = profiles[randIndex];
    res.redirect(`/chat?name=${randProfile.name}`);
  } else {
    // try to get the user's chat logs
    const profile = profiles.find( p => p.name === name );
    if (profile) {
      if (req.session.chat[name]) { // get previous chat messages
        res.render('chat', {
          title: 'hay love - chat',
          js: 'chat',
          profile,
          messages: req.session.chat[name]
        });
      } else { // create new chat array
        req.session.chat[name] = [];
        res.render('chat', {
          title: 'hay love - chat',
          js: 'chat',
          profile,
          messages: req.session.chat[name]
        });
      }
    } else {
      res.sendStatus(404);
    }
  }
});


/*
  Displays browse
 */
app.get('/browse', function(req, res) {
  res.render('browse', { title: 'hay love - browse', profiles });
});


/*
  Displays provided user's profile, otherwise random profile
 */
app.get('/profile', function(req, res) {
  const { name } = req.query;

  if (!name) {
    // redirect to a random user
    const randIndex = Math.floor(Math.random() * profiles.length);
    const randProfile = profiles[randIndex];
    res.redirect(`/profile?name=${randProfile.name}`);
  } else {
    const profile = profiles.find( p => p.name == name );
    if (profile) {
      res.render('profile', { title: `hay love - ${name}`, profile });
    } else {
      res.sendStatus(404);
    }
  }
});


/*
  Displays signup page
 */
app.get('/signup', function(req, res) {
  res.render('signup', { title: 'hay love - sign up' });
});


/*
  Returns the profile after the current provided profile
 */
app.get('/nextprofile', function(req, res) {
  const { name } = req.query;

  if (name) {
    // redirect to next profile
    const profile = profiles.find(p => p.name == name);
    const currIndex = profiles.indexOf(profile);
    const nextIndex = currIndex + 1 >= profiles.length ? 0 : currIndex + 1;
    res.redirect(`/profile?name=${profiles[nextIndex].name}`);
  } else {
    res.sendStatus(404);
  }
});


/*
  Chat message handler
 */
app.post('/send', function(req, res) {
  const { text, user, sender } = req.body;
  req.session.chat[user].push({ sender, text });
  res.json({ chat: req.session.chat[user] });
});


/*
  File download
 */
app.get('/download', function(req, res) {
  res.attachment('legal_release.pdf');
  res.send();
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