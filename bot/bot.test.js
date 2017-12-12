//Set debug and mongoDBUrl environment variables for test purposes
process.env.mongoDBUrl = 'mongodb://localhost:27017/trenthesis';
process.env.debug = 'true';

/*Mockup bot*/
const TOKEN = process.env.tokenTelegramBot;
const EventEmitter = require('eventemitter3');

jest.mock('node-telegram-bot-api');
let telegramBotApi = require('node-telegram-bot-api');
class TelegramBot extends EventEmitter {
  constructor(token) {
    super()
    this.setWebHook = (url) => {}
    this.processUpdate = (update) => {
      const message = update.message;
      const data = update.data;
      if (message) {
        this.emit(message, data)
      } else {
        console.error('no message provided')
      }
    }
    this.answerCallbackQuery = (callbackQueryId) => {
      return new Promise(function(resolve, reject) {
        resolve()
      })
    }
    this.sendMessage = () => {}
  }
}
telegramBotApi.mockImplementation(
  (token) => new TelegramBot(TOKEN)
);

/* Mockup getJsonFromUrl function */
jest.mock('./functions');
const functionsModule = require('./functions');
const getJsonFromUrl = functionsModule.getJsonFromUrl;

functionsModule.getJsonFromUrl.mockImplementation(
  (url, cb, chatid, bot) => {}
);

const request = require('supertest');
const app = require('../router');
const constants = require('../bot/constants')
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



describe('Test bot', () => {

  /*author: Riccardo Capraro*/
  test('Test POST on bot root url, /bot', async () => {
    return request(app)
      .post('/bot/bot' + TOKEN)
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  });

  /*author: Riccardo Capraro*/
  test('Test POST on callback_query with invalid callback_query', async () => {
    return request(app)
      .post('/bot/bot' + TOKEN)
      .send({
        message: 'callback_query'
      })
      .then(response => {
        expect(response.statusCode).toBe(500)
      })
  });

  /*author: Riccardo Capraro*/
  test('Test POST on callback_query with valid callback_query and target = p(professor)', async () => {
    return request(app)
      .post('/bot/bot' + TOKEN)
      .send({
        message: 'callback_query',
        data: {
          data: 'p1',
          message: {
            chat: {
              id: 0
            }
          }
        }
      })
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  });

  /*author: Riccardo Capraro*/
  test('Test POST on callback_query with valid callback_query and target = t(topic)', async () => {
    return request(app)
      .post('/bot/bot' + TOKEN)
      .send({
        message: 'callback_query',
        data: {
          data: 't1',
          message: {
            chat: {
              id: 0
            }
          }
        }
      })
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  });

  /*author: Riccardo Capraro*/
  test('Test POST on callback_query with valid callback_query and target = c(category)', async () => {
    return request(app)
      .post('/bot/bot' + TOKEN)
      .send({
        message: 'callback_query',
        data: {
          data: 'c1',
          message: {
            chat: {
              id: 0
            }
          }
        }
      })
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  });

  /*author: Riccardo Capraro*/
  test('Test POST on callback_query with valid callback_query and target = u(unmatched character)', async () => {
    return request(app)
      .post('/bot/bot' + TOKEN)
      .send({
        message: 'callback_query',
        data: {
          data: 'u',
          message: {
            chat: {
              id: 0
            }
          }
        }
      })
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  });

  /* IN ORDER FOR THESE TESTS TO RUN NOMINALLY WE NEED TO PROVIDE A MOCK IMPLEMENTATION OF
   * FUNCTIONS.GETJSONFROMURL OR PASS VALID DATA IN THE BODY OF THE REQUESTS*/

  /*author: Riccardo Capraro*/
  test('Test POST on message with valid body and action = START', async () => {
    return request(app)
      .post('/bot/bot' + TOKEN)
      .send({
        message: 'message',
        data: {
          text: constants.START,
          chat: {
            id: 0
          }
        }
      })
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  });

  /*author: Riccardo Capraro*/
  test('Test POST on message with valid body and action = PROFEMOJ + PREFEREDPROFESSOR', async () => {
    return request(app)
      .post('/bot/bot' + TOKEN)
      .send({
        message: 'message',
        data: {
          text: constants.PROFEMOJI + constants.PREFEREDPROFESSOR,
          chat: {
            id: 0
          }
        }
      })
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  });

  /*author: Riccardo Capraro*/
  test('Test POST on message with valid body and action = ARGEMOJI + ANARGUMENT', async () => {
    return request(app)
      .post('/bot/bot' + TOKEN)
      .send({
        message: 'message',
        data: {
          text: constants.ARGEMOJI + constants.ANARGUMENT,
          chat: {
            id: 0
          }
        }
      })
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  });

  /*author: Riccardo Capraro*/
  test('Test POST on message with valid body and action = CATEGEMOJI + PREFEREDCATEGORY', async () => {
    return request(app)
      .post('/bot/bot' + TOKEN)
      .send({
        message: 'message',
        data: {
          text: constants.CATEGEMOJI + constants.PREFEREDCATEGORY,
          chat: {
            id: 0
          }
        }
      })
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  });

  /*author: Riccardo Capraro*/
  test('Test POST on message with valid body and action = u(unmatched action)', async () => {
    return request(app)
      .post('/bot/bot' + TOKEN)
      .send({
        message: 'message',
        data: {
          text: 'u',
          chat: {
            id: 0
          }
        }
      })
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  });
})