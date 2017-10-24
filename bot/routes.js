/**
Add here the routes for the bot API
In example: the url called by Telegram

*/


var express = require('express'),
    router = express.Router();


router
  .get('/', function(req,res){
    res.json({ message: 'hooray! welcome to our bot api!' });

  })

module.exports = router;
