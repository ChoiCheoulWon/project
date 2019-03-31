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
    console.log("type = " + rows[0].time);

    var html = "['Time', 'Temperature']"
    var i = 0;
    for (i = 0; i< rows.length; i++) {
       html += ",['"+ rows[i].time +"', "+ rows[i].value +"]";
	   // html += JSON.stringify(rows[i]);
    }
    var last = i;
    console.log(i);  
    fs.readFile("graph.html", 'utf8', function(err, data) {
    if (err) console.log("file error"+err);
    data = data.replace("<%DATA%>", html);
    var time = "측정 시작 시간 = " + rows[0].time + "<br>";
	time += "측정 종료시간 = " + rows[last-1].time + "<br>";
    data = data.replace("<%TIME%>",time); 
    var nodejsgiturl = "https://github.com/ChoiCheoulWon/project/blob/master/Temperature_Sensing/download_db.js";
    var arduinogiturl = "https://github.com/ChoiCheoulWon/project/blob/master/Temperature_Sensing/Temperature_Sensing.ino";
    data = data.replace("<%nodejsurl%>",nodejsgiturl);
    data = data.replace("<%arduinourl%>",arduinogiturl);
    res.send(data);
    });
    
  });	
  
})

var server = app.listen(9000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});
