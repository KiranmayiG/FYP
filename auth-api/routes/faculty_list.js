var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '../../config.js');


const cookieParser = require('cookie-parser');


async function get(req, res, next) {
    var user = req['authUserId'];
    let query;
    let faculty_list;

    if(user.role == 'ADMIN'){
        query = 'select FNAME as "fname", LNAME as "lname" from FACULTY';
      try{
        faculty_list = await get_faculty_list(query);
      } catch (err){
        console.error(err);
      }
      console.log(faculty_list);
      res.json({faculty_list: faculty_list});
    }
}

module.exports.get = get;

async function get_faculty_list(query){
  let connection;

  try {
    connection = await oracledb.getConnection(config.database);

    let result = await connection.execute(
      query,
      {
      },
      {
          outFormat: oracledb.OBJECT
      },
    );
    //console.log(result.rows);
    let faculty_list = result.rows;
    return faculty_list;

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
