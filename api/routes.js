/**
 * Add here the routes for the API
 * Each API call should have a different call (to have a CRUD API service)
 */

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
     * @api {get} /professors/ Get all professors in DB
     * @apiName /professors/
     * @apiGroup Professors
     *
     * @apiSuccess {Object[]} JSON array with all professors in DB.
     */

    var db = req.app.get("db");
    db.collection("professors").find({}, {
      _id: 0
    }).toArray(function(err, docs) {
      if (err) {
        console.console.error("Failed to get professors." + err.message);
      } else {
        res.status(200).json(docs);
      }
    });



  })

module.exports = router;
