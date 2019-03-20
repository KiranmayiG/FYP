var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var users = require(__dirname + '/routes/users.js');
var logins = require(__dirname + '/routes/logins.js');
var app;
var router;
var port = 3000;
var path= require('path');
var multer = require('multer');

app = express();
app.use(morgan('combined')); //logger
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

router = express.Router();
router.post('/users', users.post);
router.post('/logins', logins.post);

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/assignments");
    },
    filename: function(req, file, callback) {
        //callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        callback(null, file.originalname);
    }
});

var upload = multer({
     storage: Storage
 }).array("fileUploader", 3); //Field name and max count

 router.get("/", function(req, res) {
     res.sendFile(__dirname + "/public/upload_assignment.html");
 });
 router.post("/upload", function(req, res) {
     upload(req, res, function(err) {
         if (err) {
             return res.end("Something went wrong!");
         }
         return res.end("File uploaded sucessfully!.");
     });
 });


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
