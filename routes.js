/**
Add here the routes for the root of the application (i.e. error message (wrong url))
*/

var express = require('express'),
    router = express.Router();


router
  .get('/', function(req,res){

    var hostname = req.headers.host;
    res.json({ message: 'hooray! Benvenuto nelle nostre API. Usa '+hostname+'/api/ per chiamare una qualsiasi API!' });


  })

module.exports = router;
