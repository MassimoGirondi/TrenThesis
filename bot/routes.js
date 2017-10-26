/**
 * Add here the routes for the bot API
 * In example: the url called by Telegram
 */


var express = require('express');
var router = express.Router();


router
  .get('/', function(req, res) {
    res.json({
      message: 'hooray! Benvenuto nelle nostre API per Telegram!'
    });

  })

module.exports = router;
