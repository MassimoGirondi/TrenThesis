const request = require('supertest');
const app = require('../router');

beforeAll((done) => {
  app.DBConnect(() => {
    done()
  })

})

/*Wait the DB connection, then do the tests*/
/*describe("Test root path", () => {
  test('It should response the GET method', () => {
    return request(app).get("/api/professors").then(response => {
      expect(response.statusCode).toBe(200)
    })
  })
})*/