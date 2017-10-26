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

module.exports = router;
