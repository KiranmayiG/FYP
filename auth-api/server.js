var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var oracleDbStore = require('express-oracle-session')(session);
//var publicThings = require(__dirname + '/routes/publicThings.js');
//var protectedThings = require(__dirname + '/routes/protectedThings.js');
var users = require(__dirname + '/routes/users.js');
var app;
var router;
var port = 3000;
var path= require('path');
var oracledb = require('oracledb');
var config = require(__dirname + '/config.js');

app = express();

app.use(morgan('combined')); //logger
app.use(bodyParser.json());

// router = express.Router();
// router.get('/public_things', publicThings.get);
// router.get('/protected_things', protectedThings.get);
// router.post('/users', users.post);
// app.use('/api', router);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
                          // initialize express-session to allow us track the logged-in user across sessions.
                        //  req.cookies.user_sid= result.rows[0][0]);
                        var options = {
                          user:"fyp",
                          password: 'qwertyui',
                          connectString: 'localhost:1521/orcl'
                      };

                      var sessionStore = new oracleDbStore(options);

                      app.use(session({
                          key: 'session_cookie_name',
                          secret: 'session_cookie_secret',
                          store: sessionStore,
                          resave: true,
                          saveUninitialized: true
                      }));

                      //     app.use((req, res, next) => {
                      //       if (req.cookies.user_sid && !req.session.user) {
                      //           res.clearCookie('user_sid');
                      //       }
                      //       next();
                      //   });
                      //
                      // //  middleware function to check for logged-in users
                      //   var sessionChecker = (req, res, next) => {
                      //       if (req.session.user && req.cookies.user_sid) {
                      //           res.redirect('/index');
                      //       } else {
                      //           next();
                      //       }
                      //     }
               }

                    //res.send("The length is " + result.rows.length);
                 });
      }
  )
});


app.listen(port, function() {
    console.log('Web server listening on localhost:' + port);
});
