var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '../../config.js');

function post(req, res, next) {
  



            insertUser(user, function(err, user) {
                var payload;

                if (err) {
                    return next(err);
                }

                payload = {
                    sub: user.username,
                    pass: user.hashedPassword,
                    //role: user.role
                };

                res.status(200).json({
                    user: user,
                    token: jwt.sign(payload, config.jwtSecretKey, {expiresInMinutes: 60})
                  });
                });
            });
        });
    }

module.exports.post = post;

function insertUser(user, cb) {
    oracledb.getConnection(
        config.database,
        function(err, connection){
            if (err) {
                return cb(err);
            }

            connection.execute(
                'insert into PARENT ( ' +
                '   USERNAME, ' +
                '   PASSWORD, ' +
                '   FNAME, ' +
                '   LNAME, ' +
                '   DOB, ' +
                //'   role ' +
                ') ' +
                'values (' +
                '    "salu" , ' +
                '    "abc" , ' +
                '    "kiru", ' +
                '    "G", ' +
                '    "22-10-97", ' +
                //'    \'BASE\' ' +
                ') ' +

                {




                },
                {
                    autoCommit: true

                },
                function(err, results){
                    if (err) {
                        connection.release(function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                        });
                      return cb(err);
                    }

                    cb(null, {

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
