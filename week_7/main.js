var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);


app.get('/', function(req, res) {
  let urlParams = [];

  console.log('req.query\n', req.query);

  // parse url query
  for (let param in req.query) {
    urlParams.push({name: param, value: req.query[param]});
  }

  console.log('url\n', urlParams);

  res.render('home', {method: 'GET', url: urlParams});
});


app.post('/', function(req, res) {
  let urlParams = [];
  let bodyParams = [];

  console.log('req.query\n', req.query);
  console.log('req.body\n', req.body);

  for (let param in req.query) {
    urlParams.push({name: param, value: req.query[param]});
  }

  // parse request body
  for (let param in req.body) {
    bodyParams.push({name: param, value: req.body[param]});
  }

  console.log('url\n', urlParams);
  console.log('body\n', bodyParams);

  res.render('home', {method: 'POST', url: urlParams, body: bodyParams});
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
