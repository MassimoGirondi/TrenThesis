//Set debug and mongoDBUrl environment variables for test purposes
process.env.mongoDBUrl = 'mongodb://localhost:27017/trenthesis';
process.env.debug = 'true';

const request = require('supertest');
const app = require('../router');
const getTestToken = require('./utils').getTestToken;
const exec = require('child_process').exec;

/*
  Function to call mongoimport
*/
function importTable(name, cb) {
  var options = '--host localhost --port 27017 --db trenthesis';
  options += ' --collection ' + name;
  options += ' --drop --maintainInsertionOrder';
  options += ' --file tools/test_populations/' + name + '.json';

  exec('mongoimport ' + options, {
    cwd: '.'
  }, (err, stdout, stderr) => {
    //console.log("Imported " + name); // + ": " + stderr);
    cb();
  })
}

function importAll(cb) {

  //Import the DB
  importTable('users', () => {
    importTable('categories', () => {
      importTable('professors', () => {
        importTable('topics', () => {
          //console.log("Test Database Loaded!");

          //Connect to DB
          app.DBConnect(() => {
            cb()
          })
        });
      });
    });
  });
}



/*Wait the DB population and connection, then do the tests*/
beforeAll((done) => {
  //Set DB to local instance
  importAll(done)
});

/*Restore the DB*/
afterAll((done) => {
  app.get('db').close(() => {
    importAll(() => {
      done();
    });
  });
})
test('Test if there is a DB connection', () => {
  var status = app.get('db').serverConfig.isConnected()
  expect(status).toBe(true);
})


describe('Test Get professors', () => {
  /*author: Matteo Battilana*/
  test('Get all Professors correct', async () => {
    return request(app)
      .get('/api/professors')
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body[0]).toEqual({
          "id": 0,
          "first_name": "Daniele",
          "last_name": "Isoni",
          "email": "trenthesis@unitn.it",
          "department": "DISI",
          "website": "https://github.com/MassimoGirondi/TrenThesis",
          "further_info": {
            "office hours": "Mon-Tue 7AM-7PM",
            "career": "This is my career. This is my career. This is my career. This is my career. This is my career. This is my career. This is my career. This is my career."
          }
        })

        expect(response.body[2].first_name).toEqual('Matteo')
        expect(response.body[2].last_name).toEqual('Battilana')

        expect(response.body[4].first_name).toEqual('Valentina')
        expect(response.body[4].last_name).toEqual('Odorizzi')
      })
  })

  /*author: Matteo Battilana*/
  test('Get Professor by correct id', async () => {
    return request(app)
      .get('/api/professors/1')
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
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
        })
      })
  })

  /*author: Matteo Battilana*/
  test('Get Professor by wrong id', async () => {
    return request(app)
      .get('/api/professors/6')
      .then(response => {
        expect(response.statusCode).toBe(404)
      })
  })
});

describe('Test Get Topics', () => {
  /*author: Matteo Battilana*/
  test('Get all Topics correct', async () => {
    return request(app)
      .get('/api/topics')
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body[0]).toEqual({
          "id": 0,
          "professor_id": 0,
          "title": "Machine learning web micro-services",
          "short_abstract": "Machine learning micro-services with Node.js",
          "description": "Empty description",
          "resource": "folder/rewritten_url",
          "assigned": false,
          "categories": ["web", "machine_learning"]
        })

        expect(response.body[2].id).toEqual(2)
        expect(response.body[2].title).toEqual('Web frameworks analysis')

        expect(response.body[3].id).toEqual(3)
        expect(response.body[3].title).toEqual('Jsp Tag library development')

      })
  })

  /*author: Daniele Isoni*/
  test('Get Topics by correct id', async () => {
    return request(app)
      .get('/api/topics/1')
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
          "id": 1,
          "professor_id": 1,
          "title": "Clustering algorithms with sklearn",
          "short_abstract": "Add a clustering algorithm to the scikit-learn library",
          "description": "Empty description",
          "resource": "folder/rewritten_url",
          "assigned": false,
          "categories": ["machine_learning"]
        })
      })
  })

  /*author: Daniele Isoni*/
  test('Get Topics by wrong id', async () => {
    return request(app)
      .get('/api/topics/5')
      .then(response => {
        expect(response.statusCode).toBe(404)
      })
  })
  //Must add the same as 'Test Professor Update' cases
});


describe('Test Professor Update', () => {
  /*author: Massimo Girondi*/
  test('Update correct Professor', async () => {
    return request(app)
      .put('/api/professors/1')
      .send({
        id: 1,
        first_name: 'Guido',
        last_name: 'La Barca'
      })
      .set('x-access-token', getTestToken())
      .then(response => {
        expect(response.statusCode).toBe(200)
        return request(app)
          .get('/api/professors/1')
      }).then((response) => {
        expect(response.body.first_name).toEqual('Guido')
        expect(response.body.last_name).toEqual('La Barca')
      })
  })

  /*author: Massimo Girondi*/
  test('Update wrong Professor', async () => {
    return request(app)
      .put('/api/professors/2')
      .send({
        id: 2,
        first_name: 'Guido',
        last_name: 'La Barca'
      })
      .set('x-access-token', getTestToken())
      .then(response => {
        expect(response.statusCode).toBe(403)
      })
  })
})

describe('Test Topic Update', () => {
  /*author: Daniele Isoni*/
  test('Update correct Topic', async () => {
    return request(app)
      .put('/api/topics/1')
      .send({
        id: 1,
        professor_id: 1,
        title: 'Clustering algorithms with sklearn modified',
        description: 'Empty description empty description'
      })
      .set('x-access-token', getTestToken())
      .then(response => {
        expect(response.statusCode).toBe(200)
        return request(app)
          .get('/api/topics/1')
      }).then((response) => {
        expect(response.body.title).toEqual('Clustering algorithms with sklearn modified')
        expect(response.body.description).toEqual('Empty description empty description')
      })
  })

  /*author: Daniele Isoni*/
  test('Update wrong Topic', async () => {
    return request(app)
      .put('/api/topics/2')
      .send({
        id: 2,
        professor_id: 2,
        title: 'Clustering algorithms with sklearn modified',
        description: 'Empty description empty description'
      })
      .set('x-access-token', getTestToken())
      .then(response => {
        expect(response.statusCode).toBe(403)
      })
  })
})

describe('Test Professor Remove', () => {
  /*author: Matteo Battilana*/
  test('Remove correct Professor without authentication', async () => {
    return request(app)
      .delete('/api/professors/2')
      .then(response => {
        expect(response.statusCode).toBe(403)
      })
  })

  /*author: Matteo Battilana*/
  test('Remove correct Professor', async () => {
    return request(app)
      .delete('/api/professors/1')
      .set('x-access-token', getTestToken())
      .then(response => {
        expect(response.statusCode).toBe(200)
        return request(app)
          .get('/api/professors/1')
      }).then((response) => {
        expect(response.statusCode).toBe(404)
      })
  })

  /*author: Matteo Battilana*/
  test('Remove wrong Professor, wrong id', async () => {
    return request(app)
      .put('/api/professors/8')
      .set('x-access-token', getTestToken())
      .then(response => {
        expect(response.statusCode).toBe(403)
      })
  })

  /*author: Matteo Battilana*/
  test('Remove wrong Professor, other professor', async () => {
    return request(app)
      .put('/api/professors/0')
      .set('x-access-token', getTestToken())
      .then(response => {
        expect(response.statusCode).toBe(403)
      })
  })

})