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

/*
 * Compute statistics
 */

module.exports.computeProfessorProfileStatistics = (req, res, professor_id) => {
  return new Promise(function(resolve, reject) {
    var db = req.app.get("db");
    db.collection('topics').aggregate(
      [{
        '$match': {
          'professor_id': professor_id
        }
      }, {
        '$project': {
          'categories': 1,
          '_id': 0
        }
      }, {
        '$unwind': '$categories'
      }, {
        '$group': {
          '_id': '$categories',
          'count': {
            '$sum': 1
          }
        }
      }, {
        '$sort': {
          'count': -1
        }
      }, {
        '$limit': 5
      }],
      function(err, data) {
        if (err) {
          res.status(505).send({
            message: 'Error in computing top_categories statistic'
          });
        } else {
          resolve(data)
        }
      })
  })
}

module.exports.computeStatistic = (req, res, target) => {
  return new Promise(function(resolve, reject) {
    var db = req.app.get("db");

    switch (target) {
      case 'top_student_categories':
        db.collection('topics').aggregate(
          [{
            '$match': {
              'assigned': {
                '$ne': false
              }
            }
          }, {
            '$project': {
              'categories': 1,
              '_id': 0
            }
          }, {
            '$unwind': '$categories'
          }, {
            '$group': {
              '_id': '$categories',
              'count': {
                '$sum': 1
              }
            }
          }],
          function(err, data) {
            if (err) {
              res.status(505).send({
                message: 'Error in computing top_student_categories statistic'
              });
            } else {
              let json = {}
              json[target] = data
              resolve(json)
            }
          })
        break;

      case 'top_categories':
        db.collection('topics').aggregate(
          [{
            '$project': {
              'categories': 1,
              '_id': 0
            }
          }, {
            '$unwind': '$categories'
          }, {
            '$group': {
              '_id': '$categories',
              'count': {
                '$sum': 1
              }
            }
          }],
          function(err, data) {
            if (err) {
              res.status(505).send({
                message: 'Error in computing top_categories statistic'
              });
            } else {
              let json = {}
              json[target] = data
              resolve(json)
            }
          })
        break;

      case 'top_professors':
        db.collection('topics').aggregate(
          [{
            '$project': {
              'professor_id': 1,
              '_id': 0
            }
          }, {
            '$group': {
              '_id': '$professor_id',
              'count': {
                '$sum': 1
              }
            }
          }, {
            '$limit': 5
          }, {
            '$lookup': {
              'from': 'professors',
              'localField': '_id',
              'foreignField': 'id',
              'as': 'professor_details'
            }
          }, {
            '$unwind': '$professor_details'
          }, {
            '$project': {
              '_id': 0,
              'professor_details.id': 0,
              'professor_details._id': 0
            }
          }],
          function(err, data) {
            if (err) {
              res.status(505).send({
                message: 'Error in computing top_professors statistic'
              });
            } else {
              let json = {}
              json[target] = data
              resolve(json)
            }
          })
        break;

      case 'top_professor_categories':
        db.collection('topics').aggregate(
          [{
            '$project': {
              'professor_id': 1,
              'categories': 1,
              '_id': 0
            }
          }, {
            '$unwind': '$categories'
          }, {
            '$group': {
              '_id': {
                'professor_id': '$professor_id',
                'category': '$categories'
              },
              'count': {
                '$sum': 1
              },
            }
          }, {
            '$group': {
              '_id': {
                'professor_id': '$_id.professor_id',
                'category': '$_id.category'
              },
              'count': {
                '$max': '$count'
              }
            }
          }, {
            '$sort': {
              '_id.professor_id': 1,
              'count': 1
            }
          }, {
            '$group': {
              '_id': '$_id.professor_id',
              'count': {
                '$last': '$count'
              },
              'category': {
                '$last': '$_id.category'
              }
            }
          }, {
            '$group': {
              '_id': '$category',
              'count': {
                '$sum': 1
              }
            }
          }],
          function(err, data) {
            if (err) {
              res.status(505).send({
                message: 'Error in computing top_professor_categories statistic'
              });
            } else {
              let json = {}
              json[target] = data
              resolve(json)
            }
          })
        break;
    }
  })
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