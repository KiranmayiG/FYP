var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '../../config.js');


function post(req, res, next) {
    var role = req.body.role;
    var query = '';

    if(role == "FACULTY"){
      query = 'select USERNAME as "username", PASSWORD as "password" from FACULTY where username = :username';
    }
    else if(role == "STUDENT"){
      query = 'select USERNAME as "username", PASSWORD as "password" from STUDENT where username = :username';
    }
    else if(role == "PARENT"){
      query = 'select USERNAME as "username", PASSWORD as "password" from PARENT where username = :username';
    }
    else if(role == "ADMIN"){
      //add later
    }

    oracledb.getConnection(
        config.database,
        function(err, connection){
            if (err) {
                return next(err);
            }

            connection.execute(
                query,
                {
                    username: req.body.username
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(err, results){
                    var user;

                    if (err) {
                        connection.release(function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                        });

                        return next(err);
                    }

                    user = results.rows[0];

                    bcrypt.compare(req.body.password, user.password, function(err, pwMatch) {
                        var payload;

                        if (err) {
                            return next(err);
                        }

                        if (!pwMatch) {
                            res.status(401).send({message: 'Invalid email or password.'});
                            return;
                        }

                        payload = {
                            sub: user.username,
                            role: role
                        };

                        res.status(200).json({
                            user: user,
                            token: jwt.sign(payload, config.jwtSecretKey, {expiresInMinutes: 60})
                        });
                    });

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                    });
                });
        }
    );
}

module.exports.post = post;
