var express = require('express'),
    hand = require('./routes/hands');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser());

app.get('/hands', hand.findAll);
app.get('/hands/:id', hand.findById);
app.get('/hands/:id/cards', hand.findById_cards);
app.post('/hands', hand.addHand);
app.put('/hands/:id', hand.updateHand);

app.listen(3000);
console.log('Listening on port 3000...');
