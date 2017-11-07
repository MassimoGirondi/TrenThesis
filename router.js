/**
 * This is the main router of the application
 * It routes all the request through bot or api sub-modules
 *
 */

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser'); // define our app is using body-parser
var port = process.env.PORT || 8080; // set our port

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//Import routes
var apiRoutes = require('./api/routes');
var botRoutes = require('./bot/routes');
var rootRoutes = require('./routes');

// middleware route to support CORS and preflighted requests
app.use(function(req, res, next) {
  //Enabling CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Content-Type', 'application/json');
  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,PUT, POST, DELETE');
    return res.status(200).json({});
  }
  // make sure we go to the next routes
  next();
});



//Add routes from files
app.use('/api', apiRoutes);
app.use('/bot', botRoutes);
app.use('/', rootRoutes);


// handle invalid requests and internal error
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});



var port = process.env.PORT || 8080; // set our port

//Connect to DB
var mongodbUrl = process.env.mongoDBUrl || 'mongodb://localhost:27017/trenthesis';
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(mongodbUrl, (err, db) => {

  app.set('db', db);
  app.listen(port);
  console.log("App started at port " + port);

});
