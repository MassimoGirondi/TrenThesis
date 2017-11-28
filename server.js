/*
 * This is the main application file
 * It is invoked to start the application
 * By its own, it only make the app available,
 * All the basic logic is contened into
 */

var app = require('./router');
var port = process.env.PORT || 8080; // set our port

app.DBConnect(() => {
  app.listen(port);
  console.log("App started at port " + port);
  console.log('Debug: ' + process.env.debug);
})