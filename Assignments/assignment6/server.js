var express = require('express'),
    users = require('./routes/users');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.get('/users/:id/reminders', users.findReminders);
app.get('/users/:id/reminders/:rid', users.findremindersbyID);
app.post('/users', users.adduser);
app.post('/users/:id/reminders', users.addreminders);
app.delete('/users/:id', users.deleteuser);
app.delete('/users/:id/reminders', users.deletereminders);
app.delete('/users/:id/reminders/:rid', users.deleteremindersbyID)

app.listen(3000);
console.log('Listening on port 3000...');
