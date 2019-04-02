var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '../../config.js');

async function post(req, res, next) {
    var event_val = {
        name: req.body.name,
        date:req.body.date,
        description: req.body.description,
    };


    var user = req['authUserId'];

    try{
      var checkEvent = await check_event(event_val);
      if(checkEvent){
        res.json({error: "Event already exists"});
      }else{

        if(user.role == "ADMIN"){
          try{
            insert_result = await insert_event(event_val);
            console.log("after insert event",insert_result);
            res.redirect('/index');
          } catch (err){
            console.error(err);
          }
        }
      }
    } catch (err){
      console.error(err);
    }


}

module.exports.post = post;

async function check_event(event_val){
  var query = '';
  query = 'select NAME as "e_name" from EVENTS where NAME = :e_name';

  let connection;

  try {
    connection = await oracledb.getConnection(config.database);

    let result = await connection.execute(
      query,
      {
          e_name: event_val.name
      },
      {
          outFormat: oracledb.OBJECT
      },
    );
    //console.log(result.rows);
    let e_name = result.rows[0];
    return e_name;

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function insert_event(event_val){
  var query = '';
  query = 'insert into EVENTS (NAME, DATE_OF_EVENT, DESCRIPTION) '+
  'values (:e_name, TO_DATE(:doe, \'YYYY-MM-DD\'), :description)';
  let connection;

  try {
    connection = await oracledb.getConnection(config.database);

    let result = await connection.execute(
      query,
      {
          e_name: event_val.name,
          doe: event_val.date,
          description: event_val.description,
      },
      {
          autoCommit: true
      },
    );

    console.log(result);
    return result;

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
