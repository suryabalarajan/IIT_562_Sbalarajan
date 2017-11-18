var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var cookieParser = require('cookie-parser');

var users = require('./routes/users');

var app = express();

app.use(bodyParser());
app.use(methodOverride('_method'));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
