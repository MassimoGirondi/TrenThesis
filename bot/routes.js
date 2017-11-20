/*
 * Required module for the Telegram bot
 */
var express = require('express');
var functions = require('./functions.js');

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
 * Const string
 */
const backButton = "Torna alle opzioni principali"
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

    console.log("ID numero: " + requrl); // msg.data refers to the callback_data
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
                .then(() => bot.sendMessage(msg.chat.id, "Error!"));
            break;

    }
});

//Message
bot.on('message', msg => {
    switch (msg.text.toString()) {
        case "/start":
        case "Torna alle opzioni principali":
            bot.sendMessage(msg.chat.id, "Seleziona una delle opzioni dalla tastiera in basso", {
                "reply_markup": {
                    "keyboard": [
                        ["Un argomento"],
                        ["Il professore che preferisci"],
                        ["L'ambito di studi che preferisci"]
                    ]
                }
            });
            break;
        case "Il professore che preferisci":
            var requrl = apiUrl + "/professors";
            functions.getJsonFromUrl(requrl, functions.showProfessors, msg.chat.id, bot);

            break;
        case "Un argomento":
            var requrl = apiUrl + "/topics";
            functions.getJsonFromUrl(requrl, functions.showAllThesis, msg.chat.id, bot);
            break;

        case "L'ambito di studi che preferisci":
            var requrl = apiUrl + "/categories";
            functions.getJsonFromUrl(requrl, functions.showCategories, msg.chat.id, bot);
            break;
        default:
            bot.sendMessage(msg.chat.id, "Non ho capito");
            break;
    }
});
