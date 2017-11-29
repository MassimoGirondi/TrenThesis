const request = require('supertest');
const app = require('../router');
const getTestToken = require('./utils').getTestToken;
/*Wait the DB connection, then do the tests*/
beforeAll((done) => {
  app.DBConnect(() => {
    done()
  })

})



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
        return app.get('db').collection('professors').findOne({
          'id': 1
        })

      })
      .then(professor => {
        expect(professor.first_name).toBe('Guido');
        expect(professor.last_name).toBe('La Barca')

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