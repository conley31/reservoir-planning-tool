const PORT = process.env.PORT || 3000;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var TDPAlg = require('./TDPAlg.js');

TDPAlg();
app.use(express.static(__dirname + '/public'));


app.get('*', (req, resp)=>{
	resp.status(404).send('Page not found you bafoon.');
});

app.listen(PORT, function(){
	console.log('Running Server on Port:', PORT);
});
