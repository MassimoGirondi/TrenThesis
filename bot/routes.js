/**
 * Add here the routes for the bot API
 * In example: the url called by Telegram
 */

const TOKEN = '480161328:AAHT-yyzoOq5Qry1F45-WjqkTYcnP3xEkmg';
const url = 'https://telegrambottrenthesis.herokuapp.com/bot';
const TelegramBot = require('node-telegram-bot-api');
var express = require('express');
const bodyParser = require('body-parser');
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

bot.on('message', msg => {
    switch(msg.text.toString().toLowerCase()){
        case "/start":
            bot.sendMessage(msg.chat.id,"Seleziona una delle opzioni dalla tastiera in basso");
        break;
                                            }
});
