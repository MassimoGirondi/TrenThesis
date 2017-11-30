var jwt = require('jsonwebtoken');

/**
 * Check if the id contained in the parameters of the request is authorized
 */
module.exports.isAuthorized = (req, res, next, id) => {
  if (id === undefined) {
    res.status(400).send({
      message: 'Malformed request: missing authentication id.'
    })
  }
  if ((!req.decodedToken) || (req.decodedToken.professor_id != parseInt(id))) {
    res.status(403).send({
      message: 'Id mismatch: you are not authorized to modify other people data'
    });
  } else {
    next()
  }
}

/**
 * Check if the request is authenticated and the token is valid
 */
if (process.env.debug && process.env.debug == 'true') {
  var jwtAuth = (req, res, next) => {
    req.decodedToken = {
      'professor_id': 1,
      'profileData': {
        "id": 1,
        "first_name": "Riccardo",
        "last_name": "Capraro",
        "email": "trenthesis@unitn.it",
        "department": "DISI",
        "website": "https://github.com/MassimoGirondi/TrenThesis",
        "further_info": {
          "office hours": "Mon-Tue 7AM-7PM",
          "career": "This is my career. This is my career. This is my career. This is my career. This is my career. This is my career. This is my career. This is my career."
        }
      }
    };
    next();
  }
} else {
  var jwtAuth = (req, res, next) => {

    var token = req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, process.env.AuthSecret, function(err, decoded) {
        if (err) {
          return res.status(403).send({
            message: 'The token is not valid. Try to Login again.'
          });
        } else {
          // if everything is good, find the professor id and save it into the request for use in other routes
          if (decoded.googleId != undefined) {
            let db = req.app.get('db');
            db.collection('users').find({
              'googleId': decoded.googleId
            }, {
              '_id': 0
            }, function(err, data) {
              if (err) {
                res.status(505).send({
                  message: 'Id mismatch in token recognition: please contact the support team.'
                });
              } else {
                req.decodedToken = decoded;
                req.decodedToken.profileData = data;
                next();
              }
            })
          }
        }
      });

    } else {

      // if there is no token send an error
      res.status(403).send({
        message: 'No token provided. Check the documentation to know how to send it in your requests.'
      });

    }
  }
}
module.exports.isAuthenticated = jwtAuth;

/**
 * Check if the request is not trying to modify the id of the target (through a body that contains a id:maliciousId);
 * This behaviour can potentially corrupt data in the database.
 */
module.exports.isUpdateSafe = (req, res, next) => {
  if (req.body.id && (parseInt(req.body.id) != parseInt(req.params.id))) {
    res.status(403).send({
      message: 'Malicious update detected: you are not allowed to put a different id in the body of the request.'
    });
  } else {
    next()
  }
}

/**
 * Return a token to test authenticated API
 */
module.exports.getTestToken = () => {
  var token = jwt.sign({
    googleId: '116652383299820429186',
    professor_id: 1
  }, process.env.AuthSecret, {
    expiresIn: '1d'
  });
  return token;
}