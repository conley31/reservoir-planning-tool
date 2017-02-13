const PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();

app.use(express.static(__dirname + './public'));

app.get('*', (req, resp)=>{
	resp.send('Page not found you bafoon.', 404);
});

app.listen(PORT, function(){
	console.log('Running Server on Port:', PORT);
});
