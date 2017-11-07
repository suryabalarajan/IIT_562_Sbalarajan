var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var cookieParser = require('cookie-parser');

var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser());
app.use(methodOverride('_method'));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.get('/users/:id/reminders', users.findReminders);
app.get('/users/:id/reminders/:rid', users.findremindersbyID);
app.get('/adduser', users.getnewuser);
app.post('/adduser', users.adduser)
app.get('/users/:id/deleteuser', users.deleteuser);
app.get('/users/:id/addnewreminders', users.getnewreminders);
app.post('/users/:id/addnewreminders', users.addreminders);

app.listen(3000);
console.log('Listening on port 3000...');

