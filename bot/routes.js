/*
 * Required module for the Telegram bot
 */
var express = require('express');
var functions = require('./functions.js');
var constants = require('./constants.js');

/*
 * Const get from process.env (Heroku env variable)
 */
//Used to keep the telegram token secret
const TOKEN = process.env.tokenTelegramBot;
//WebHook telegram, made to allow the possibility to migrate to a new host
const url = process.env.telegramWebHookUrl;
//Api url,  made to allow the possibility to migrate to a new host
const apiUrl = process.env.apiUrl;

/*
 * Const
 */
const TelegramBot = require('node-telegram-bot-api');

/*
 * Telegram integrated with express
 * Initialization section
 */
var router = express.Router();
// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN);
// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`);
router
  .post(`/bot${TOKEN}`, function(req, res) {
    bot.processUpdate(req.body);
    res.status(200).send();
  });
module.exports = router;


// Inline button callback queries
bot.on("callback_query", (callbackQuery) => {
  //JSON parsing
  const msg = callbackQuery.message;
  var jsonobj = JSON.parse(JSON.stringify(callbackQuery));
  var requrl = "";
  if (typeof callbackQuery === 'undefined' || callbackQuery == null) {
    console.log("callbackQuery parameter not valid");
  } else if (jsonobj.data) {
    switch (jsonobj.data.charAt(0)) {
      case 'p':
        requrl = String(apiUrl + "/topics?professor_id=" + jsonobj.data.substring(1));
        //professore
        bot.answerCallbackQuery(callbackQuery.id)
          .then(() => functions.getJsonFromUrl(requrl, functions.showProfessor_CategoryThesis, msg.chat.id, bot));
        break;
      case 't':
        requrl = String(apiUrl + "/topics/" + jsonobj.data.substring(1));
        //clicked on topic
        bot.answerCallbackQuery(callbackQuery.id)
          .then(() => functions.getJsonFromUrl(requrl, functions.showThesisInfo, msg.chat.id, bot));
        break;
      case 'c':
        requrl = String(apiUrl + "/topics?category=" + jsonobj.data.substring(1));
        //clicked on topic
        bot.answerCallbackQuery(callbackQuery.id)
          .then(() => functions.getJsonFromUrl(requrl, functions.showProfessor_CategoryThesis, msg.chat.id, bot));
        break;
      default:
        bot.answerCallbackQuery(callbackQuery.id)
          .then(() => bot.sendMessage(msg.chat.id, constants.NOTUNDERSTOOD));
    }
  } else {
    console.log("jsonobj.data not valid");
  }
});

//Message
bot.on('message', msg => {
  var requrl = "";
  if (msg.text.toString()) {
    switch (msg.text.toString()) {
      case constants.START:
        bot.sendMessage(msg.chat.id, constants.STARTSENTENCE, {
          "reply_markup": {
            "keyboard": [
              [constants.ARGEMOJI + constants.ANARGUMENT],
              [constants.PROFEMOJI + constants.PREFEREDPROFESSOR],
              [constants.CATEGEMOJI + constants.PREFEREDCATEGORY]
            ]
          }
        });
        break;
      case constants.PROFEMOJI + constants.PREFEREDPROFESSOR:
        requrl = apiUrl + "/professors";
        functions.getJsonFromUrl(requrl, functions.showProfessors, msg.chat.id, bot);
        break;
      case constants.ARGEMOJI + constants.ANARGUMENT:
        requrl = apiUrl + "/topics";
        functions.getJsonFromUrl(requrl, functions.showAllThesis, msg.chat.id, bot);
        break;
      case constants.CATEGEMOJI + constants.PREFEREDCATEGORY:
        requrl = apiUrl + "/categories";
        functions.getJsonFromUrl(requrl, functions.showCategories, msg.chat.id, bot);
        break;
      default:
        bot.sendMessage(msg.chat.id, constants.NOTUNDERSTOOD);
    }
  } else {
    console.log("Empty bot message");
  }
});