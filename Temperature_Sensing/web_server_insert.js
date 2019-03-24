/*
 * 2019/3/24 Cheoulwon Choi
*/

var express = require('express');
var app = express();

mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})
connection.connect();

function insert_sensor(device, type, value, seq) {
  obj = {};
  obj.seq = seq;
  obj.device = device;
  obj.type = type;
  obj.value = value;

  var query = connection.query('insert into sensors set ?', obj, function(err, rows, cols) {
    if (err) throw err;
    console.log("database insertion ok= %j", obj);
  });
}

app.get('/', function(req, res) {
  res.end('Nice to meet you');
});

app.get('/data', function(req, res) {
  r = req.query;
  console.log("GET %j", r);

  insert_sensor(r.device, r.type, r.value, r.seq);
  res.end('OK:' + JSON.stringify(req.query));
});

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});
