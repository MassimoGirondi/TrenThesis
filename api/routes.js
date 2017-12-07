/**
 * Add here the routes for the API
 * Each API call should have a different call (to have a CRUD API service)
 */

/**
 * @apiDefine AuthenticatedProfessor Any authenticated Professor
 * Restrict access to write, update and delete options.
 * Read the Wiki to know how to include a token in your request
 */

var express = require('express');
var router = express.Router();

/*
Import utils for requst authentication and authorization
*/
var isAuthenticated = require('./utils.js').isAuthenticated;
var isAuthorized = require('./utils.js').isAuthorized;
var isUpdateSafe = require('./utils.js').isUpdateSafe;
var computeStatistic = require('./utils.js').computeStatistic;
var computeProfessorProfileStatistics = require('./utils.js').computeProfessorProfileStatistics;

router

  /**
   * @api {get} /api/ Welcome message
   * @apiName /api/
   * @apiGroup General
   *
   * @apiSuccess {String} message message informing the service is working.
   */
  .get('/', function(req, res) {
    res.status(200).json({
      message: 'hooray! Benvenuto nelle nostre API!'
    });
  })

  /**
   * @api {get} /api/professors/ Get all professors in DB
   * @apiName Get professors list
   * @apiGroup Professors
   *
   * @apiSuccess {Object[]} JSON array with all professors in DB.
   */
  .get('/professors', function(req, res, next) {

    var db = req.app.get("db");
    db.collection("professors").find({}, {
      "_id": 0
    }).toArray(function(err, profs) {
      if (err) {
        console.error("Failed to get professors." + err.message);
        //Create the error and pass it to the handler
        var err = new Error('Something is broken!');
        err.status = 505;
        next(err);
      } else {
        res.status(200).json(profs);
      }
    });
  })

  /**
   * @api {get} /api/professors/:id Get  professor with specified ID
   * @apiName  Get professor by id
   * @apiGroup Professors
   *
   * @apiSuccess {Object} JSON object reppresenting the professor.
   * @apiError {404} ProfessorNotFound An information message (encapsulated in a JSON Object named error).
   * @apiError {505} InternalError An information message (encapsulated in a JSON Object named error).
   */
  .get('/professors/:id', function(req, res, next) {

    var db = req.app.get("db");
    var id = parseInt(req.params.id);
    db.collection("professors").findOne({
      "id": id
    }, {
      "_id": 0
    }, function(err, prof) {
      if (err) {
        console.error("Failed to get professor with id=" + id + " : " + err.message);
        var err = new Error('Something is broken!');
        err.status = 505;
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

  /**
   * @api {put} /api/professors/:id Update professor with specified ID
   * @apiName Update professor by  id
   * @apiGroup Professors
   *
   * @apiSuccess {modified} Boolean value, true if the update was successful.
   * @apiParam {Object} JSON object with all the fields of the professor (modified).
   * @apiError {505} InternalError An information message (encapsulated in a JSON Object named error).
   * @apiPermission AuthenticatedProfessor
   */
  .put('/professors/:id', isAuthenticated, (req, res, next) => isAuthorized(req, res, next, req.params.id), isUpdateSafe,
    function(req, res, next) {
      var db = req.app.get("db");
      var id = parseInt(req.params.id);

      db.collection("professors").updateOne({
        "id": id
      }, {
        '$set': req.body
      }, function(err, status) {

        if (err) {
          console.error("Failed to update professor with id=" + id + " : " + err.message);
          var err = new Error('Something is broken!');
          err.status = 505;
          next(err);
        } else {
          if (status.modifiedCount === 1)
            res.status(200).json({
              modify: true
            });
          else {
            res.status(200).json({
              modify: false
            });
          }
        }
      })
    })

  /**
   * @api {delete} /api/professors/:id Delete professor with specified ID
   * @apiName Delete professor
   * @apiGroup Professors
   *
   * @apiSuccess {status} Boolean value, true if the deletion was successful.
   * @apiError {404} ProfessorNotDeleted An information message (encapsulated in a JSON Object named error).
   * @apiError {505} InternalError An information message (encapsulated in a JSON Object named error).
   * @apiPermission AuthenticatedProfessor
   */
  .delete('/professors/:id', isAuthenticated, (req, res, next) => isAuthorized(req, res, next, req.params.id),
    function(req, res, next) {
      var db = req.app.get("db");
      var id = parseInt(req.params.id);
      /*
      Check if the AuthenticatedProfessor is the same of topic professor_id
      */
      db.collection("professors").deleteOne({
        "id": id
      }, req.body, function(err, status) {

        if (err) {
          console.error("Failed to delete professor with id=" + id + " : " + err.message);
          var err = new Error('Something is broken!');
          err.status = 505;
          next(err);
        } else {

          if (status.deletedCount === 1) {

            // The professor was registered => delete all related topics
            db.collection("topics").deleteMany({
              "professor_id": parseInt(id)
            }, req.body, function(err, status) {

              if (err) {
                console.error("Failed to delete professor's topics; professor_id=" + id + " : " + err.message);
                var err = new Error('Something is broken!');
                next(err); // Should check here for inconsistency
              } else {
                db.collection("users").deleteOne({
                  "id": parseInt(id)
                }, req.body, function(err, status) {

                  if (err) {
                    console.error("Failed to delete professor's user; professor_id=" + id + " : " + err.message);
                    var err = new Error('Something is broken!');
                    next(err); // Should check here for inconsistency
                  } else {
                    res.status(200).json(true);

                  }
                })
              }
            });

          } else {
            var err = new Error('Professor not deleted!');
            err.status = 400;
            next(err);
          }
        }
      });
    })


  /**
   * @api {get} /api/topics/:id Get  topic with specified id
   * @apiName Get topic by id
   * @apiGroup Topics
   *
   * @apiSuccess {Object} JSON object reppresenting the topic.
   * @apiError {404} TopicNotFound An information message (encapsulated in a JSON Object named error).
   * @apiError {505} InternalError An information message (encapsulated in a JSON Object named error).
   */
  .get('/topics/:id', function(req, res, next) {
    var db = req.app.get("db");
    var id = parseInt(req.params.id);
    db.collection("topics").findOne({
      "id": id
    }, {
      "_id": 0
    }, function(err, topic) {
      if (err) {
        console.error("Failed to get topic with id=" + id + " : " + err.message);
        var err = new Error('Something is broken!');
        err.status = 505;
        next(err);
      } else if (!topic) {
        console.error("Failed to get topic  with id=" + id);
        var err = new Error('No topic found with given id!');
        err.status = 404;
        next(err);
      } else {
        res.status(200).json(topic);
      }
    });

  })

  /**
   * @api {post} /api/topics/ Insert a new topic
   * @apiName Insert topic
   * @apiGroup Topics
   *
   * @apiSuccess {id} The id of the inserted topic.
   * @apiError {403} NotAuthorized An information message (encapsulated in a JSON Object named error).
   * @apiError {505} InternalError An information message (encapsulated in a JSON Object named error).
   */
  .post('/topics', isAuthenticated, (req, res, next) => isAuthorized(req, res, next, req.body.professor_id), function(req, res, next) {
    var db = req.app.get("db");
    var body = req.body;

    db.collection("topics").find({}, {
        _id: 0,
        id: 1
      }).sort({
        id: -1
      }).limit(1)
      .toArray()
      .then((max_id) => {
        body.id = (max_id[0].id || -1) + 1;
        db.collection("topics").insert(body)
          .then((topic) => {

            res.status(200).json({
              "id": body.id
            });
          })

      }).catch((err) => {
        console.error("Failed to insert topic with id=" + id + " : " + err.message);
        var err = new Error('Something is broken!');
        err.status = 505;
        next(err);
      });

  })

  /**
   * @api {get} /api/topics Get topics by filters
   * @apiName  Get topics by filters
   * @apiGroup Topics
   *
   * @apiParam [professor_id] The professor_id whose topics we are looking for.
   * @apiParam [category] The category whose topics we are looking for.
   * @apiSuccess {Object} JSON object contain a list of objects (topics).
   * @apiError {505} InternalError An information message (encapsulated in a JSON Object named error).
   * @apiError {404} TopicNotFound An information message (encapsulated in a JSON Object named error).
   *
   */
  .get('/topics', function(req, res, next) {

    var db = req.app.get("db");

    var professor_id = req.query.professor_id;
    var category = req.query.category;

    var query = {}

    if (professor_id != undefined) {
      query["professor_id"] = parseInt(professor_id)
    }
    if (category != undefined) {
      query["categories"] = {
        '$in': [category]
      }
    }
    db.collection("topics").find(query, {
      "_id": 0
    }).toArray(function(err, topics) {
      if (err) {
        console.error("Failed to get topic with filters: " + "professor_id: " + professor_id + ", category: " + category);
        var err = new Error('Something is broken!');
        err.status = 505;
        next(err);
      } else if (!topics || Object.keys(topics).length === 0) {
        console.error("No topic found with filters: " + "professor_id: " + professor_id + ", category: " + category);
        var err = new Error('No topic found with given filters!');
        err.status = 404;
        next(err);
      } else {
        res.status(200).json(topics);
      }
    });
  })

  /**
   * @api {put} /api/topics/:id Update topic with specified id
   * @apiName Update topic by id
   * @apiGroup Topics
   *
   * @apiSuccess {modify} Boolean value, true if the update was successful.
   * @apiParam {Object} JSON object with all the fields of the topic (modified).
   * @apiError {505} InternalError An information message (encapsulated in a JSON Object named error).

   * @apiPermission AuthenticatedProfessor
   */
  .put('/topics/:id', isAuthenticated, (req, res, next) => isAuthorized(req, res, next, req.body.professor_id), isUpdateSafe,

    function(req, res, next) {
      var db = req.app.get("db");
      var id = parseInt(req.params.id);
      var professor_id = parseInt(req.body.professor_id);

      db.collection("topics").updateOne({
        "id": id,
        'professor_id': professor_id
      }, {
        '$set': req.body
      }, function(err, status) {

        if (err) {
          console.error("Failed to update topic with id=" + id + " : " + err.message);
          var err = new Error('Something is broken!');
          err.status = 505;
          next(err);
        } else {
          if (status.modifiedCount === 1)
            res.status(200).json({
              modify: true
            });
          else {
            res.status(200).json({
              modify: false
            });
          }
        }
      })
    })

  /**
   * @api {delete} /api/topics/:id Delete topic with specified ID
   * @apiName Delete topic
   * @apiGroup Topics
   *
   * @apiSuccess {status} Boolean value, true if the deletion was successful.
   * @apiError  {400} TopicNotDeleted An information message (encapsulated in a JSON Object named error).
   * @apiError  {505} InternalError An information message (encapsulated in a JSON Object named error).
   * @apiPermission AuthenticatedProfessor
   */
  .delete('/topics/:id', isAuthenticated,
    function(req, res, next) {
      var db = req.app.get("db");
      var id = parseInt(req.params.id);
      var professor_id = req.decodedToken.professor_id;

      db.collection("topics").deleteOne({
        "id": id,
        'professor_id': professor_id
      }, req.body, function(err, status) {
        if (err) {
          console.error("Failed to delete topic with id=" + id + " : " + err.message);
          var err = new Error('Something is broken!');
          err.status = 505;
          next(err);
        } else {
          if (status.deletedCount === 1) {
            res.status(200).json(true);
          } else {
            var err = new Error('Topic not found or not authorized!');
            err.status = 400;
            next(err);
          }
        }
      });
    })

  /**
   * @api {get} /api/categories Get topics categories
   * @apiName  Get topics categories
   * @apiGroup Topics
   *
   * @apiParam max The maximum number of categories returned (default 20).
   * @apiParam get_defaults Get defaults categories
   * @apiSuccess {Object} JSON object contain a list of topics categories.
   * @apiError {404} NoCategory An information message (encapsulated in a JSON Object named error).
   * @apiError {505} InternalError An information message (encapsulated in a JSON Object named error).
   *
   */
  .get('/categories', function(req, res, next) {

    var db = req.app.get("db");
    var max = req.query.max;
    var get_defaults = req.query.get_defaults

    var query = {}

    if (get_defaults != undefined) {
      // Get default categories
      if (get_defaults == "true") {
        db.collection("categories").find({}, {
          '_id': 0
        }).toArray(function(err, docs) {
          if (err) {
            console.error("Failed to get default categories");
            var err = new Error('Failed to get default categories!');
            err.status = 505;
            next(err);
          } else if (!docs || Object.keys(docs).length === 0) {
            console.error("No default categories found");
            var err = new Error("No default categories found");
            err.status = 404;
            next(err);
          } else {
            var result = []
            for (i = 0; i < Object.keys(docs).length; i++) {
              result.push(docs[i].id)
            }
            res.status(200).json(result);
          }
        });
      } else {
        console.error("Not well-formed parameter list");
        var err = new Error('Not well-formed parameter list');
        err.status = 400;
        next(err);
      }

    } else {
      // Get topics categories only

      if (max === undefined) {
        max = 20;
      }

      db.collection("topics").aggregate(
        [{
          '$project': {
            'categories': 1,
            '_id': 0
          }
        }, {
          '$unwind': '$categories'
        }, {
          '$group': {
            '_id': '$categories'
          }
        }]).toArray(function(err, categories) {
        if (err) {
          console.error("Failed to get categories");
          var err = new Error('Failed to get categories!');
          err.status = 505;
          next(err);
        } else {
          if (!categories || Object.keys(categories).length === 0) {
            console.error(" No category found");
            var err = new Error('No category found!');
            err.status = 404;
            next(err);
          } else {
            var result = []
            for (i = 0; i < Object.keys(categories).length; i++) {
              result.push(categories[i]._id)
            }
            res.status(200).json(result);
          }
        }
      });
    }
  })

  /**
   * @api {get} /profile Get your profile statistics
   * @apiName Get Profile statistics
   * @apiGroup Statistics
   */
  .get('/statistics/profile', isAuthenticated, function(req, res, next) {
    const professor_id = req.decodedToken.professor_id;
    computeProfessorProfileStatistics(req, res, professor_id).then((data) => {
      res.status(200).json(data);
    })
  })

  /**
   * @api {get} /api/statistics Get system statistics
   * @apiName  Get system statistics
   * @apiGroup Statistics
   *
   * @apiParam target Get a specific statistic
   * @apiSuccess {Object} JSON object contain a list of statistics.
   * @apiError {505} InternalError An information message (encapsulated in a JSON Object named error).
   */
  .get('/statistics', function(req, res, next) {

    const IMPLEMENTED_STATISTICS = ['top_categories', 'top_student_categories', 'top_categories_per_professor']


    let promise = new Promise(function(resolve, reject) {

      const target = req.query.target;
      let statistics = [];
      let promises = [];

      if (target) {
        if (IMPLEMENTED_STATISTICS.includes(target)) {
          promises.push(computeStatistic(req, res, target).then((result) => {
            statistics.push(result)
          }))
        }
      } else {
        for (statistic of IMPLEMENTED_STATISTICS) {
          promises.push(computeStatistic(req, res, statistic).then((result) => {
            statistics.push(result)
          }))
        }
      }

      Promise.all(promises).then(() => {
        resolve(statistics)
      })
    })

    promise.then((statistics) => {
      res.status(200).json(statistics);
    })
  });

module.exports = router;