const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mysql = require('./dbcon.js');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.locals.basedir = path.join(__dirname, 'views');
app.set('port', process.argv[2]);
app.use(express.static('static'));


/*
  Renders home
  With load query, returns all rows
 */
app.get('/', function(req, res) {
  const { load } = req.query;

  // return all rows if load query found, else show home page
  if (load) {
    mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
      if (err) {
        res.json({ err });
        return;
      }

      res.json({ rows });
    });
  } else {
    res.render('home');
  }
});


/*
  Insert route
 */
app.post('/', function(req, res) {
  const { name, weight, reps, unit, date } = req.body;

  // create new row
  mysql.pool.query(
    "INSERT INTO workouts (`name`, `weight`, `reps`, `lbs`, `date`) VALUES (?, ?, ?, ?, ?)",
    [name, weight, reps, unit, date],
    function(err, result) {
      if (err) {
        res.json({ err });
        return;
      }

      // get new inserted row
      mysql.pool.query(
        "SELECT * FROM workouts WHERE id=?",
        [result.insertId],
        function(err, rows) {
          if (err) {
            res.json({ err });
            return;
          }

          // return new row
          res.json({ row: rows[0] });
        });
  });
});


/*
  Delete route
  Deletes single row with id
 */
app.delete('/', function(req, res) {
  const { id } = req.body

  mysql.pool.query("DELETE FROM workouts WHERE id=?", [id], function(err, result){
    if (err) {
      res.json({ err });
      return;
    }

    // signal query finished
    res.json({ success: true });
  });
});


/*
  Update route
  Updates single row with id
 */
app.put('/', function(req, res) {
  const { id, name, weight, reps, unit, date } = req.body;

  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [id], function(err, result){
    if (err) {
      res.json({ err });
      return;
    }

    if (result.length == 1) {
      const def = result[0];
      mysql.pool.query("UPDATE workouts SET name=?, weight=?, reps=?, lbs=?, date=? WHERE id=? ",
        [name || def.name, weight || def.weight, reps || def.reps, unit || def.lbs, date || def.date, id],
        function(err, result) {
        if (err) {
          res.json({ err });
          return;
        }

        // signal query finished
        res.json({ success: true });
      });
    } else {
      res.json({ err: 'could not find row to update' });
    }
  });
});


// 404
app.use(function(req,res){
  res.status(404);
  res.render('404');
});


// 500
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
