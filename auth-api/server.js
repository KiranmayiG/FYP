var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
//var publicThings = require(__dirname + '/routes/publicThings.js');
//var protectedThings = require(__dirname + '/routes/protectedThings.js');
var users = require(__dirname + '/routes/users.js');
var app;
var router;
var port = 3000;
var path= require('path');

app = express();

app.use(morgan('combined')); //logger
app.use(bodyParser.json());

// router = express.Router();
// router.get('/public_things', publicThings.get);
// router.get('/protected_things', protectedThings.get);
// router.post('/users', users.post);
// app.use('/api', router);

app.use(express.static(__dirname + '/public'));

app.get('/index', function (req, res) {
res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/contact', function (req, res) {
res.sendFile(path.join(__dirname + '/public/contact.html'));
});

app.get('/blog', function (req, res) {
res.sendFile(path.join(__dirname + '/public/blog.html'));
});

app.listen(port, function() {
    console.log('Web server listening on localhost:' + port);
});
