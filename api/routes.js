/**
 * Add here the routes for the API
 * Each API call should have a different call (to have a CRUD API service)
 */

/**
 * @apiDefine AuthenticatedProfessor Any authenticated Professor
 * Restrict access to write, update and delete options
 */

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    console.log(e.message);
    return false;
  }
  return true;
}


var express = require('express');
var router = express.Router();




router
  .get('/', function(req, res) {
    /**
     * @api {get} /api/ Welcome message
     * @apiName /api/
     * @apiGroup General
     *
     * @apiSuccess {String} message message informing the service is working.
     */

    res.json({
      message: 'hooray! Benvenuto nelle nostre API!'
    });

  })
  .get('/professors', function(req, res) {
    /**
     * @api {get} /api/professors/ Get all professors in DB
     * @apiName Get professors list
     * @apiGroup Professors
     *
     * @apiSuccess {Object[]} JSON array with all professors in DB.
     */

    var db = req.app.get("db");
    db.collection("professors").find({}, {
      "_id": 0
    }).toArray(function(err, profs) {
      if (err) {
        console.error("Failed to get professors." + err.message);
        //Create the error and pass it to the handler
        var err = new Error('Something is broken!');
        next(err);
      } else {
        res.status(200).json(profs);
      }
    });
  })

  .get('/professors/:id', function(req, res, next) {
    /**
     * @api {get} /api/professors/:id Get  professor with specified ID
     * @apiName  Get professor by id
     * @apiGroup Professors
     *
     * @apiSuccess {Object} JSON object reppresenting the professor.
     * @apiError ProfessorNotFound An information message (encapsulated in a JSON Object named error).
     */

    var db = req.app.get("db");
    var id = req.params.id;
    db.collection("professors").findOne({
      "id": parseInt(id)
    }, {
      "_id": 0
    }, function(err, prof) {
      if (err) {
        console.error("Failed to get professor with id=" + id + " : " + err.message);
        var err = new Error('Something is broken!');
        next(err);
      } else if (!prof) {
        console.error("Failed to get professor with id=" + id);
        var err = new Error('No professor found with given id!');
        err.status = 404;
        next(err);
      } else {
        res.status(200).json(prof);
      }
    });
  })

  .put('/professors/:id', function(req, res, next) {
    /**
     * @api {put} /api/professors/:id Update professor with specified ID
     * @apiName Update professor by  id
     * @apiGroup Professors
     *
     * @apiSuccess {status} Boolean value, true if the update was successful.
     * @apiParam {Object} JSON object with all the fields of the professor (modified).
     * @apiError ProfessorNotUpdated An information message (encapsulated in a JSON Object named error).
     * @apiPermission AuthenticatedProfessor
     */
    var db = req.app.get("db");

    /*
    Check if the AuthenticatedProfessor is the same of :id
    */
    var id = req.params.id;
    db.collection("professors").updateOne({
      "id": parseInt(id)
    }, req.body, function(err, status) {

      if (err) {
        console.error("Failed to update professor with id=" + id + " : " + err.message);
        var err = new Error('Something is broken!');
        next(err);
      } else {
        if (status.modifiedCount === 1)
          res.status(200).json({
            modify: true
          });
        else {
          var err = new Error('Professor not updated!');
          err.status = 400;
          next(err);
        }
      }
    })
  })

  .delete('/professors/:id', function(req, res, next) {
    /**
     * @api {delete} /api/professors/:id Delete professor with specified ID
     * @apiName Delete professor
     * @apiGroup Professors
     *
     * @apiSuccess {status} Boolean value, true if the deletion was successful.
     * @apiError ProfessorNotDeleted An information message (encapsulated in a JSON Object named error).
     * @apiPermission AuthenticatedProfessor
     */
    var db = req.app.get("db");

    /*
    Check if the AuthenticatedProfessor is the same of :id
    */
    var id = req.params.id;
    db.collection("professors").deleteOne({
      "id": parseInt(id)
    }, req.body, function(err, status) {

      if (err) {
        console.error("Failed to delete professor with id=" + id + " : " + err.message);
        var err = new Error('Something is broken!');
        next(err);
      } else {

        if (status.deletedCount === 1)
          // The professor was registered => delete all related topics
          db.collection("topics").deleteMany({
            "professor_id": parseInt(id)
          }, req.body, function(err, status) {

            if (err) {
              console.error("Failed to delete professor's topics; professor_id=" + id + " : " + err.message);
              var err = new Error('Something is broken!');
              next(err); // Should check here for inconsistency
            } else {
              res.status(200).json(true);
            }
          });
        else {
          var err = new Error('Professor not deleted!');
          err.status = 400;
          next(err);
        }
      }
    });
  })
  .get('/topics/:id', function(req, res, next) {
    /**
     * @api {get} /api/topics/:id Get topics for specified professor_id
     * @apiName  Get topics by professor_id
     * @apiGroup Topics
     *
     * @apiSuccess {Object} JSON object contain a list of objects (topics).
     * @apiError TopicNotFound An information message (encapsulated in a JSON Object named error).
     */

    var db = req.app.get("db");
    var id = req.params.id;
    db.collection("topics").find({
      "professor_id": parseInt(id)
    }, {
      "_id": 0
    }).toArray(function(err, topics) {
      if (err) {
        console.error("Failed to get topic with id=" + id + " : " + err.message);
        var err = new Error('Something is broken!');
        next(err);
      } else if (!topics || topics.length === 0) {
        console.error("Failed to get topic with id=" + id);
        var err = new Error('No topic found with given id!');
        err.status = 404;
        next(err);
      } else {
        res.status(200).json(topics);
      }
    });
  });



module.exports = router;
