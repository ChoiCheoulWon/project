/*
 * 2019/3/24 Cheoulwon Choi
 */
var express = require('express');
var app = express();
var fs = require('fs');

mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})
connection.connect();


app.get("/data", function(req, res) {
  console.log("param=" + JSON.stringify(req.query));
  
  var qstr = 'select * from sensors';
  connection.query(qstr, function(err, rows, cols) {
   if (err) {
      throw err;
      res.send('query error: '+ qstr);
      return;
    }

    console.log("Got "+ rows.length +" records");
    var html = "['Time', 'Temperature']"
    for (var i=0; i< rows.length; i++) {
       html += ",['"+ rows[i].time +"', "+ rows[i].value +"]";
	   // html += JSON.stringify(rows[i]);
    }

    fs.readFile("graph.html", 'utf8', function(err, data) {
    if (err) console.log("file error"+err);
    data = data.replace("<%DATA%>", html);
    res.send(data);

    });
  });
  
})


var server = app.listen(9000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});
