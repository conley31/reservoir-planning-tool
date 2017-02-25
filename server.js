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
	//handle and pass inputs into the TDPAlg
	//res.status(200).end();
  jason_data ={
    "graph": [
        {
          "line": {
                  "type": "number",
                  "axis": "Pond Volume"
                }
        },
        {
          "line": {
                  "type": "number",
                  "axis": "Bypass Volume"
                }
        },
        {
          "line": {
                  "type": "number",
                  "axis": "Storage Deficit"
                }
        },
        {
          "array": [
                  [1, 37.8, 80.8],
                  [2, 30.9, 69.5],
                  [3, 25.4, 57],
                  [4, 11.7, 18.8],
                  [5, 11.9, 17.6],
                  [6, 8.8, 13.6],
                  [7, 7.6, 12.3],
                  [8, 12.3, 29.2],
                  [9, 16.9, 42.9],
                  [10, 12.8, 30.9],
                  [11, 5.3, 7.9],
                  [12, 6.6, 8.4],
                  [13, 4.8, 6.3],
                  [14, 4.2, 6.2]
              ]
        }
    ]
};
  //res.status(400).json(jason_data);
  res.json(jason_data);
});

app.get('*', (req, resp)=>{
	resp.status(404).send('Page not found you bafoon.');
});

app.listen(PORT, function(){
	console.log('Running Server on Port: ', PORT);
});
