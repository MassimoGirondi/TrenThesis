/**
 * This file contains the authenticaton API
 */

var express = require('express');
var router = express.Router();

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var loggedIn = require('connect-ensure-login').ensureLoggedIn('/auth/not_authorized');
var jwt = require('jsonwebtoken');

var jwtAuth = (req, res, next) => {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.AuthSecret, function(err, decoded) {
      if (err) {
        return res.status(403).send({
          message: 'The token is not valid. Try to Login again.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decodedToken = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      message: 'No token provided. Check the documentation to know how to send it in your requests.'
    });

  }
}

// Export the function to allow other modules to use the Authentication
module.exports.authenticated = jwtAuth;

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
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, cb) {

    var db = req.app.get("db");

    // Check email
    if (true || profile._json.hd === 'unitn.it') { //JUST TO TEST

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
  secret: process.env.AuthSecret,
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
        message: '"This is the authentication api. See the documentation to use it.'
      });
    })

  /**
   * @api {get} /auth/google Authenticate via Google service
   * @apiName Google authentication
   * @apiGroup Authentication
   */
  .get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    }))

  /**
   * @api {get} /auth/google Authenticate via Google service
   * @apiName Google authentication
   * @apiGroup Authentication
   * @apiPrivate
   * @apiPermission AuthenticatedProfessor
   * @apiSuccess {None} Should redirect to /token if success, /not_authorized in case of failure
   */
  .get('/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/auth/not_authorized'
    }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/auth/token');
    })

  /**
   * @api {get} /auth/login Get informations on how to login
   * @apiName Google Login Instructions
   * @apiGroup Authentication
   *
   * @apiSuccess {String} message An instruction message
   * @apiSuccess {String} url The URL to visit to authenticate
   *
   */
  .get('/login', function(req, res) {

    var msg = "To login visit this URL:";
    if (req.user) {
      msg += " Note that you are already loggedIn."
    }
    res.send({
      message: msg,
      url: req.protocol + "://" + req.get('host') + "/auth/google"
    });

  })

  /**
   * @api {get} /auth/token Get the token to use APIs
   * @apiName Token generator
   * @apiGroup Authentication
   *
   * @apiSuccess {String} token The token generated
   * @apiPermission AuthenticatedProfessor
   */
  .get('/token', loggedIn, function(req, res) {

    return res.json({
      token: jwt.sign({
        googleId: req.user._json.id,
        googleJson: req.user._json
      }, process.env.AuthSecret, {
        expiresIn: '1d'
      })
    });
  })

  .get('/test', jwtAuth, (req, res) => {
    console.log("AUTHENTICATHED: " + JSON.stringify(req.decodedToken));
    res.send("OK");

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
    res.redirect('/');
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
