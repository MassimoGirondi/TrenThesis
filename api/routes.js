/**
* Add here the routes for the API
* Each API call should have a different call (to have a CRUD API service) 
*/

var express = require('express'),
    router = express.Router();


router
  .get('/', function(req,res){
    res.json({ message: 'hooray! welcome to our api!' });

  })

module.exports = router;
