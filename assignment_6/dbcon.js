var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_coxjoshu',
  password        : '8873',
  database        : 'cs290_coxjoshu'
});

module.exports.pool = pool;