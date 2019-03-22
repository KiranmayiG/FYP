var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//var oracleDbStore = require('express-oracle-session')(session);
//var publicThings = require(__dirname + '/routes/publicThings.js');
//var protectedThings = require(__dirname + '/routes/protectedThings.js');
var users = require(__dirname + '/routes/users.js');
var app;
var router;
var port = 3000;
var path= require('path');
var oracledb = require('oracledb');
var config = require(__dirname + '/config.js');
var sess;
app = express();
app.use(morgan('combined')); //logger
app.use(bodyParser.json());
app.use(session({secret: 'ssshhhhh'}));
// router = express.Router();
// router.get('/public_things', publicThings.get);
// router.get('/protected_things', protectedThings.get);
// router.post('/users', users.post);
// app.use('/api', router);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());

app.get('/index', function (req, res) {
res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/contact', function (req, res) {
res.sendFile(path.join(__dirname + '/public/contact.html'));
});

app.get('/blog', function (req, res) {
res.sendFile(path.join(__dirname + '/public/blog.html'));
});



app.post('/login', function(req, res) {

  oracledb.getConnection(
      config.database,
      function(err, connection){
          if (err) {
              return next(err);
          }

          connection.execute(
            `SELECT * FROM PARENT where USERNAME= :1 and PASSWORD= :2`,
            [req.body.username, req.body.password],


              function(err, result) {
                    if (err) {
                      console.error(err.message);
                      return;
                    }

                    if(result.rows.length == 1)
                    {

                      var user_sid= result.rows[0][0];

                      sess = req.session;
                      sess.username = req.body.username;
                      res.redirect('/index');

                    //  res.end('done ' + sess.username );
               }

               else res.send("Invalid Credentials. try again");
                 });
      }
  )
});



app.listen(port, function() {
    console.log('Web server listening on localhost:' + port);
});
