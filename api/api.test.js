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

  //Set DB to local instance
  process.env.mongoDBUrl = 'mongodb://localhost:27017/trenthesis';
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
beforeAll(importAll);

/*Restore the DB*/
afterAll((done) => {
  app.get('db').close(() => {
    importAll(() => {
      done();
    });
  });
})



describe('Test Get professors', async () => {
  /*put tests here*/
});


describe('Test Professor Update', () => {
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