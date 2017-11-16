/**
 * This file contains the authenticaton API
 */

var express = require('express');
var router = express.Router();

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var loggedIn = require('connect-ensure-login').ensureLoggedIn('/google');

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.googleClientID,
    clientSecret: process.env.googleClientSecret,
    callbackURL: "/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v2/userinfo",
    proxy: true,
    passReqToCallback: true,
  },
  function(req, token, tokenSecret, profile, cb) {

    var db = req.app.get("db");

    // Check email
    if (profile._json.hd === 'unitn.it') {

      db.collection("users").findOne({
        googleId: profile._json.id
      }, function(err, user) {
        if (err || !user) {
          db.collection("users").insertOne({
              googleId: profile._json.id
            },
            function(err, user) {
              console.log("Inserted new user " + err);
              return cb(null, profile);
            });
        } else {
          console.log("Existing: " + user.googleId);
          return cb(null, profile);
        }
      });
    } else {
      console.log("Not authorized: " + profile._json.email);
      var err = new Error('Not authorized: ' + profile._json.email);
      return cb(null, false, err);
    }

    return cb(null, profile);
  }
));



// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
router.use(require('cookie-parser')());
router.use(require('body-parser').urlencoded({
  extended: true
}));
router.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());


// Define routes.
router
  /**
   * @api {get} /auth Welcome message
   * @apiName /auth
   * @apiGroup Authentication
   *
   * @apiSuccess {String} message message informing the service is working.
   */
  .get('/',
    function(req, res) {
      res.json({
        message: 'This is the authentication api'
      });
    })

  /**
   * @api {get} /auth/google Authenticate via Google service
   * @apiName Google authentication
   * @apiGroup Authentication
   */
  .get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'consent'
    })
  )


  /**
   * @api {get} /auth/google Authenticate via Google service
   * @apiName Google authentication
   * @apiGroup Authentication
   * @apiPrivate
   *
   * @apiSuccess {None} Redirect to token API
   */
  .get('/google/callback',
    passport.authenticate('google', {
      successRedirect: '/auth/token',
      failureRedirect: '/auth/not_authorized'
    }))

  /**
   * @api {get} /auth/login Login pa
   * @apiName Google authentication
   * @apiGroup Authentication
   *
   * @apiSuccess {None} Redirect ...
   */
  .get('/login', function(req, res) {
    res.send({
      message: "To login visit this URL",
      url: req.protocol + "://" + req.get('host') + "/auth/google"
    });
  })

  /**
   * @api {get} /auth/logout Logout
   * @apiName Logout
   * @apiGroup Authentication
   *
   * @apiSuccess {None} You are successfully logged out.
   */
  .get('/logout', function(req, res) {
    req.logout();
    req.session.destroy(() => {
      res.redirect("/auth/login");
    })
  })

  /**
   * @api {get} /auth/not_authorized You are not authorized to access the API
   * @apiPrivate
   * @apiName Not authorized
   * @apiGroup Authentication
   */
  .get('/not_authorized', function(req, res, next) {
    var err = new Error('You are not authorized to use this API; please try with an authorized account (' + req.protocol + "://" + req.get('host') + "/auth/google" + ').');
    err.status = 401;
    next(err);
  });


module.exports = router;
