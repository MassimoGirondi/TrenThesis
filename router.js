/**
* This is the main router of the application
* It routes all the request through bot or api sub-modules
*
*/

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');    // define our app is using body-parser
var port = process.env.PORT || 8080;        // set our port

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Import routes
var apiRoutes = require('./api/routes');
var botRoutes = require('./bot/routes');
var rootRoutes = require('./routes');

//Add routes from files
app.use('/api', apiRoutes);
app.use('/bot', botRoutes);
app.use('/', rootRoutes);



var port = process.env.PORT || 8080;        // set our port

//Connect to DB
var mongoose   = require('mongoose');
var mongodbUrl = process.env.mongoDBUrl || 'mongodb://localhost:27017/';


// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + mongodbUrl);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + mongodbUrl);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

mongoose.connect(mongodbUrl,{ useMongoClient: true }); // connect to our database

app.listen(port);
console.log("App started at port " + port);
