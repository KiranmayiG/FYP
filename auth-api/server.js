var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var users = require(__dirname + '/routes/users.js');
var logins = require(__dirname + '/routes/logins.js');
var uploads_assignment = require(__dirname + '/routes/uploads_assignment.js');
var uploads_notes = require(__dirname + '/routes/uploads_notes.js');
var uploads_videos = require(__dirname + '/routes/uploads_videos.js');
var check_token = require('./check_token.js');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '/config.js');
var app;
var router;
var port = 3000;
var path= require('path');
<<<<<<< HEAD
var oracledb = require('oracledb');
var config = require(__dirname + '/config.js');
var sess;
app = express();
||||||| merged common ancestors
var oracledb = require('oracledb');
var config = require(__dirname + '/config.js');
var sess;
app = express();

=======

app = express();
>>>>>>> 01d8cddfcb84869a470a545c438109844b4f9031
app.use(morgan('combined')); //logger
app.use(bodyParser.json());
<<<<<<< HEAD
app.use(session({secret: 'ssshhhhh'}));
// router = express.Router();
// router.get('/public_things', publicThings.get);
// router.get('/protected_things', protectedThings.get);
// router.post('/users', users.post);
// app.use('/api', router);

||||||| merged common ancestors


app.use(session({secret: 'ssshhhhh'}));
// router = express.Router();
// router.get('/public_things', publicThings.get);
// router.get('/protected_things', protectedThings.get);
// router.post('/users', users.post);
// app.use('/api', router);

=======
>>>>>>> 01d8cddfcb84869a470a545c438109844b4f9031
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

router = express.Router();
router.post('/users', users.post);
router.post('/logins', logins.post);

router.post('/upload_assignment', uploads_assignment.post);
router.post('/upload_notes', uploads_notes.post);
router.post('/upload_videos', uploads_videos.post);

const withAuthUserId = [
  cookieParser(),
  (req, res, next) => {
    const claims = jwt.verify(req.cookies['jwt'], config.jwtSecretKey)
    req['authUserId'] = claims['sub']
    next()
  }
];

router.get('/get_user', ...withAuthUserId, (req, res) => {
  console.log(req['authUserId'].username);

});
//app.get('/get_user', check_token.checkToken, logins.get);


// router.get('/get_token', function(req, res) {
//   //console.log('REQUEST PRINT --> ', req.body.token);
//   console.log(req.body.);
//   console.log(req.headers.authorization);
//
//   var token = req.headers['x-access-token'] || req.headers['authorization'];
//   if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
//
//   jwt.verify(token, config.secret, function(err, decoded) {
//     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//
//     res.status(200).send(decoded);
//   });
// });

// router.use((req, res, next)=>{
//         // check header or url parameters or post parameters for token
//         var token = req.body.token || req.query.token || req.headers['x-access-token'];
//         console.log('Token ', token);
//         if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
//
//           jwt.verify(token, config.secret, function(err, decoded) {
//             if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//
//             res.status(200).send(decoded);
//              });
//         // if(token){
//         //   //Decode the token
//         //   jwt.verify(token, config.secret,(err,decod)=>{
//         //     if(err){
//         //       res.status(403).json({
//         //         message:"Wrong Token"
//         //       });
//         //     }
//         //     else{
//         //       //If decoded then call next() so that respective route is called.
//         //       req.decoded=decod;
//         //       next();
//         //     }
//         //   });
//         // }
//
// });

// app.post('/getusers',(req,res)=>{
//     var user_list=[];
//     users.forEach((user)=>{
//         user_list.push({"name":user.name});
//     })
//     res.send(JSON.stringify({users:user_list}));
// });




app.use('/api', router);

// app.get('/get_user', function(res, req){
//     console.log(req.user);
//     if(req.user)
//        res.render('/index', {user: req.user.username});
//     else res.redirect('api/logins');
// });
//
// router.get('/logins', function(req, res) {
//     res.render('api/logins');
// });
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
