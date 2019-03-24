var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '../../config.js');


const cookieParser = require('cookie-parser');


async function get(req, res, next) {

    var user = req['authUserId'];

    var user_view = user;

    delete user_view.password;
    if(user_view.role == "PARENT"){
      delete user_view.parent_id;
      res.json({user: user_view});
    }
    else if (user_view.role == "STUDENT"){
      delete user_view.student_id;

      try{
        parent_details = await get_parent_details(user_view);
      } catch (err){
        console.error(err);
      }

      user_view.parent_fname = parent_details.parent_fname;
      user_view.parent_lname = parent_details.parent_lname;
      user_view.parent_dob = parent_details.parent_dob;
      user_view.parent_phone = parent_details.parent_phone;
      //console.log('user_view after parent contents ', user_view);

      try{
        department_details = await get_department_details(user_view);
      } catch (err){
        console.error(err);
      }

      user_view.department_name = department_details.department_name;
      user_view.department_description = department_details.department_description;
      //console.log('user_view after department contents ', user_view);

      delete user_view.parent_id;
      delete user_view.department_id;

      //console.log(user_view);

      res.json({user_view_details: user_view});
    }

}

module.exports.get = get;

async function get_parent_details(user_view){
  var query_parent = '';
  query_parent = 'select FNAME as "parent_fname", LNAME as "parent_lname", '+
  'DOB as "parent_dob", PHONE_NO as "parent_phone" from PARENT where PARENT_ID = :parent_id';

  let connection;

  try {
    connection = await oracledb.getConnection(config.database);

    let result = await connection.execute(
      query_parent,
      {
          parent_id: user_view.parent_id
      },
      {
          outFormat: oracledb.OBJECT
      },
    );
    //console.log(result.rows);
    let parent_details = result.rows[0];
    return parent_details;

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

async function get_department_details(user_view){
  var query_department = '';
  query_department = 'select DEPARTMENT_NAME as "department_name", '+
  'DESCRIPTION as "department_description" from DEPARTMENT where DEPARTMENT_ID = :department_id';

  let connection;

  try {
    connection = await oracledb.getConnection(config.database);

    let result = await connection.execute(
      query_department,
      {
          department_id: user_view.department_id
      },
      {
          outFormat: oracledb.OBJECT
      },
    );
    //console.log(result.rows);
    let department_details = result.rows[0];
    return department_details;

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
