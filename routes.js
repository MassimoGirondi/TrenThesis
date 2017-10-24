/**
Add here the routes for the root of the application (i.e. error message (wrong url))
*/

var express = require('express'),
    router = express.Router();


router
  .get('/', function(req,res){

    var hostname = req.headers.host; // hostname = 'localhost:8080'
    res.json({ message: 'hooray! welcome to our api server. Please use '+hostname+'/api/ to call any API function!' });

  })

module.exports = router;
