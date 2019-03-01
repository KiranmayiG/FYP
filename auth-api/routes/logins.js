var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '../../config.js');


function post(req, res, next) {
    oracledb.getConnection(
        config.database,
        function(err, connection){
            if (err) {
                return next(err);
            }

            connection.execute(
                //role = req.body.role;
                //if(role == "")
                'select USERNAME as "username", PASSWORD as "password" from PARENT where username = :username',
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
                            sub: user.username //,
                            //role: user.role
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
