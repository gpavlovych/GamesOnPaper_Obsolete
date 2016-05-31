/**
 * Created by pavlheo on 5/30/2016.
 */
var express  = require('express');
var playService = require('./playService.js');
var bodyParser = require('body-parser');

var app = express();                               // create our app w/ express

app.use(express.static('app'));
app.use(bodyParser.json());

app.get('/api/dots', function (req, res){
    res.json(playService.getGameData());
});

app.post('/api/dots', function(req, res){
    var data = req.body.data;
    var result = playService.makeTurn(data, req.body.color, req.body.indexX, req.body.indexY);
    res.json({result:result, data:data });
});

app.listen(8080);
console.log("App listening on port 8080");
