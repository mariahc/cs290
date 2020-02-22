var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('port', process.argv[2]);
app.use(express.static('static'));

app.get('/', function(req, res) {
  res.render('index', { title: 'puggy!', message: 'taste like pug!'});
});


app.get('/trivia', function(req, res) {
  res.render('trivia')
})


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
