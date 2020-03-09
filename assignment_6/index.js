const express = require('express');
const mysql = require('./dbcon.js');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.locals.basedir = path.join(__dirname, 'views');
app.set('port', process.argv[2]);
app.use(express.static('static'));


app.get('/', function(req, res) {
  const { load } = req.query;
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

      console.log('added row ' + result.insertId);

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


app.delete('/', function(req, res) {
  const { id } = req.body
  if (!id) {
    res.json({ err: 'must include id of row to delete' });
    return;
  }

  mysql.pool.query("DELETE FROM workouts WHERE id=?", [id], function(err, result){
    if (err) {
      res.json({ err });
      return;
    }

    res.json({ success: true });
  });
});


app.put('/', function(req, res) {
  const { id, name, weight, reps, unit, date } = req.body;

  // update given id
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [id], function(err, result){
    if (err) {
      res.json({ err });
      return;
    }

    if (result.length == 1) {
      const def = result[0];
      mysql.pool.query("UPDATE workouts SET name=?, weight=?, reps=?, lbs=?, date=? WHERE id=? ",
        [name || def.name, weight || def.weight, reps || def.reps, unit || def.lbs, date || def.date, id],
        function(err, result){
        if (err){
          res.json({ err });
          return;
        }

        res.json({ success: true });
      });
    } else {
      res.json({ err: 'could not find row to update' });
    }
  });
});


app.get('/show',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('home', context);
  });
});


app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO workouts (`name`) VALUES (?)", [req.query.c], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('home',context);
  });
});

app.get('/delete',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.render('home',context);
  });
});


///simple-update?id=2&name=The+Task&done=false&due=2015-12-5
app.get('/simple-update',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE workouts SET name=?, done=?, due=? WHERE id=? ",
    [req.query.name, req.query.done, req.query.due, req.query.id],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.render('home',context);
  });
});

///safe-update?id=1&name=The+Task&done=false
app.get('/safe-update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE workouts SET name=?, done=?, due=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.done || curVals.done, req.query.due || curVals.due, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render('home',context);
      });
    }
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
