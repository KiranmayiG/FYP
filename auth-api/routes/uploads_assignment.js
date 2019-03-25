var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require(__dirname + '../../config.js');
var multer = require('multer');

async function post(req, res, next) {
    var user = req['authUserId'];
    var faculty_id = user.faculty_id;

    try{
      let file_name = await store_the_file();
    } catch (err){
      console.error(err);
    }

    console.log('filename ', file_name);
    var course_name = req.body.course_name;
    console.log('course_name ', course_name);

     try{
       let query = 'select COURSE_ID as "course_id" '+
                  'from COURSE where COURSE_NAME = :course_name';
       let course_id = await get_course_id(course_name, query);
     } catch (err){
       console.error(err);
     }

     try{
       let insert_query = 'insert into ASSIGNMENT (NAME, FACULTY_ID, COURSE_ID) '+
       'values (:filename, :faculty_id, :course_id)';
       let result_insert = await insert_assignment(file_name, faculty_id, course_id, insert_query);
     } catch (err){
       console.error(err);
     }
     console.log('Done!');
}

module.exports.post = post;

async function store_the_file(){
  let file_name;
  var StorageAssignment = multer.diskStorage({
      destination: function(req, file, callback) {
          callback(null, "./public/assignments");
      },
      filename: function(req, file, callback) {
          //callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
          file_name = file.originalname;
          callback(null, file.originalname);
      }
  });

  var upload_assignment = multer({
       storage: StorageAssignment
   }).array("assignmentFileUploader", 3); //Field name and max count

   upload_assignment(req, res, function(err) {
       if (err) {
           return "Something went wrong!";
       }
          return file_name;
          //return res.end("Assignment uploaded sucessfully!.");
   });

}

async function get_course_id(course_name, query){
  let connection;

  try {
    connection = await oracledb.getConnection(config.database);

    let result = await connection.execute(
      query,
      {
          course_name: course_name
      },
      {
          outFormat: oracledb.OBJECT
      },
    );
    console.log('course_id ', result.rows);
    let course_id = result.rows[0];
    return course_id;

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

async function insert_assignment(filename, faculty_id, course_id, insert_query){
  let connection;

  try {
    connection = await oracledb.getConnection(config.database);

    let result = await connection.execute(
      insert_query,
      {
          filename: filename,
          faculty_id: faculty_id,
          course_id: course_id
      },
      {
          outFormat: oracledb.OBJECT
      },
    );
    console.log(result);
    // let course_id = result.rows[0];
    // return course_id;

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
