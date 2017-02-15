const PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

//VB TESTING
app.get("/vb", function(req, res) {
  res.render("index.ejs");
});
//VB TESTING

app.get('*', (req, resp)=>{
	resp.send('Page not found you bafoon.', 404);
});

app.listen(PORT, function(){
	console.log('Running Server on Port:', PORT);
});
