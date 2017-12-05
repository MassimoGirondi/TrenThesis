/**
 * This file contains the authenticaton API
 */

/**
 * @apiDefine GoogleAuthenticatedProfessor Any authenticated Professor, loggedIn with Google
 * Restrict access to token generation.
 */
var express = require('express');
var router = express.Router();

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var loggedIn = require('connect-ensure-login').ensureLoggedIn('/auth/not_authorized');

var jwt = require('jsonwebtoken');
var isAuthenticated = require('./utils.js').isAuthenticated;

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*Token should be accessToken and tokenSecret -> refreshToken
https://github.com/jaredhanson/passport-google-oauth2/blob/master/lib/strategy.js  */
const strategyCallback = function(req, token, tokenSecret, profile, cb) {

  var db = req.app.get("db");
  // Check email
  if ((process.env.debug && process.env.debug == 'true') || profile._json.hd === 'unitn.it') {

    db.collection("users").findOne({
      googleId: profile._json.id
    }, function(err, user) {
      if (err || !user) {
        db.collection("users").find({}, {
            _id: 0,
            id: 1
          }).sort({
            id: -1
          }).limit(1)
          .toArray()
          .then((max_id) => {
            var new_id = (max_id[0].id || -1) + 1;
            db.collection("users").insertOne({
              googleId: profile._json.id,
              id: new_id
            }).then(() => {
              console.log("Inserted new user, id:" + new_id);
              //console.log(user);
              db.collection("professors").insertOne({
                id: new_id,
                first_name: profile._json.given_name,
                last_name: profile._json.family_name,
                email: profile._json.email,
              }).then((professor) => {
                console.log("Inserted new professor, id:" + new_id);
                cb(null, profile);
              })
            })

          });
      } else {
        console.log("Existing: " + user.googleId);
        cb(null, profile);
      }
    });
  } else {
    console.log("Not authorized: " + profile._json.email);
    var err = new Error('Not authorized: ' + profile._json.email);
    cb(null, false, err);
  }
}

passport.use(new GoogleStrategy({
  clientID: process.env.googleClientID,
  clientSecret: process.env.googleClientSecret,
  callbackURL: "/auth/google/callback",
  userProfileURL: "https://www.googleapis.com/oauth2/v2/userinfo",
  proxy: true,
  passReqToCallback: true,
}, strategyCallback));



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
        message: 'This is the authentication api. See the documentation to use it.'
      });
    })

  /**
   * @api {get} /auth/google Authenticate via Google service
   * @apiDescription Authenticate through Google OAuth2 service, with some redirects.
   * If the callback parameter is set, at the end of the procedure you will be redirect
   * to that URL
   * @apiName Google authentication
   * @apiGroup Authentication
   * @apiParam  {String} [callback] The URL to redirect (encoded, i.e. with encodeURIComponent)
   */
  .get('/google',
    function(req, res, next) {

      if (req.query.callback)
        req.session.callback = req.query.callback;
      next();
    },
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
   * @apiPermission AuthenticatedProfessor
   * @apiSuccess {None} Should redirect to /token if success, /not_authorized in case of failure
   */
  .get('/google/callback',
    passport.authenticate('google', {
      successRedirect: '/auth/token',
      failureRedirect: '/auth/not_authorized'
    }))

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
   * @apiDescription The token is given only if the callback parameter in auth/google was not given,
   * otherwise a redirect is done to the URL, with token parameter set.
   * @apiSuccess {String} token The token generated
   * @apiPermission GoogleAuthenticatedProfessor
   */
  .get('/token', loggedIn, function(req, res, next) {
    req.app.get('db').collection('users').findOne({
      googleId: req.user._json.id
    }).then((data) => {
      if (!data) {
        console.error(data, req.user);
        var err = new Error('User not found');
        err.status = 404;
        next(err);
      } else {
          var token = jwt.sign({
            googleId: req.user._json.id,
            professor_id: data.id
          }, process.env.AuthSecret, {
            expiresIn: '1d'
          });
          if (req.session.callback) {
            try {
              var url = decodeURIComponent(req.session.callback);
              res.redirect(url + "?token=" + token);
            } catch (e) {
              console.log(e);
              var err = new Error('Malformed URL in callback parameter: ' + req.session.callback + ' (Maybe is not encoded through encodeURIComponent?)');
              err.status = 422;
              next(err);
            }

          } else {

            return res.json({
              "token": token
            });
          }
      }
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
  })

  /**
   * @api {get} /profile Get your profile informationZ
   * @apiName Get Profile
   * @apiGroup Authentication
   */
  .get('/profile', isAuthenticated, function(req, res, next) {
    res.status(200).json(req.decodedToken.profileData);
  });

module.exports = router;
if (process.env.debug && process.env.debug == 'true') {
  module.exports.strategyCallback = strategyCallback
}