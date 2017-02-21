const PORT = process.env.PORT || 3000;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//var TDPAlg = require('./TDPAlg.js');

app.use(express.static(__dirname + '/public'));

app.route("/")
.get(function(req, res) {
  res.render("index.ejs");
})
.post(bodyParser.urlencoded({ extended: false }), function(req, res){
	console.log(req.body);
	//call TDPAlg.js here
	res.end();
});

app.get('*', (req, resp)=>{
	resp.status(404).send('Page not found you bafoon.');
});

app.listen(PORT, function(){
	console.log('Running Server on Port: ', PORT);
});
