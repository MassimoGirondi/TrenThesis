/*
* Required module for the Telegram bot
*/
var express = require('express');
var fetch = require('node-fetch');
const fetchJson = require('node-fetch-json');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');
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
const profEmoji = "\u{1f468}\u{200d}\u{1f3eb}"

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


function parseProfessors(chatId, jsonobj) {
    console.log("Entrato");
    var professorName_id = [];
    for (var i = 0; i < jsonobj.length; i++) {
        //Pair for callback_data in inline button
        //Check also if jsonobj has the right properties
        if (jsonobj[i].hasOwnProperty('first_name') && jsonobj[i].hasOwnProperty('last_name') && jsonobj[i].hasOwnProperty('id'))
            professorName_id.push([profEmoji + " " + jsonobj[i].first_name + " " + jsonobj[i].last_name, jsonobj[i].id]);
    }

    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: professorName_id.map((x) => ([{
                text: x[0],
                callback_data: String("p" + x[1]),
            }])),
        }),
    };

    bot.sendMessage(chatId, jsonobj.length > 0 ? "Seleziona il professore che più ti interessa e ti forniremo una lista delle tesi disponibili" : "Non ci sono professori", options);
}

function showAllThesis(chatId, jsonobj) {
    var thesisName_id = [];
    for (var i = 0; i < jsonobj.length; i++) {
        if (jsonobj[i].hasOwnProperty('title'))
            thesisName_id.push([jsonobj[i].title, jsonobj[i].id]);
    }

    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: thesisName_id.map((x) => ([{
                text: x[0],
                callback_data: String("t" + x[1]),
            }])),
        }),
    };

    bot.sendMessage(chatId, jsonobj.length > 0 ? "Seleziona la tesi che più ti interessa e ti forniremo i suoi dati" : "Non ci sono tesi", options);
}

function showProfessor_CategoryThesis(chatId, jsonobj) {

    var thesisName_id = [];
    for (var i = 0; i < jsonobj.length; i++) {
        //if (jsonobj[i].hasOwnProperty('title'))
            thesisName_id.push([jsonobj[i].title, jsonobj[i].id]);
    }

    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: thesisName_id.map((x) => ([{
                text: x[0],
                callback_data: String("t" + x[1]),
            }])),
        }),
    };

    bot.sendMessage(chatId, jsonobj.length > 0 ? "Seleziona la tesi che più ti interessa e ti forniremo i suoi dati" : "Non ci sono tesi", options);
}

function parseCategories(chatId, jsonobj) {

    var categoriesName_id = [];
    for (var i = 0; i < jsonobj.length; i++) {
        //Pair for callback_data in inline button
        categoriesName_id.push([jsonobj[i], jsonobj[i]]);
    }

    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: categoriesName_id.map((x) => ([{
                text: x[0],
                callback_data: String("c" + x[1]),
            }])),
        }),
    };

    bot.sendMessage(chatId, jsonobj.length > 0 ? "Seleziona la categoria che più ti interessa e ti forniremo una lista delle tesi disponibili" : "Non ci sono categorie", options);
}



function showThesisInfo(chatId, jsonobj) {

    var thesis = "Titolo:\t" + jsonobj.title +
        "\nAnteprima:\t" + jsonobj.short_abstract +
        "\nDescrizione:\t" + jsonobj.description +
        "\nUrl:\t" + jsonobj.resource;

    bot.sendMessage(chatId, thesis);
}

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
                .then(() => functions.getsonFromUrl(requrl, showProfessor_CategoryThesis, msg.chat.id));
            break;
        case 't':
            requrl = String(apiUrl + "/topics/" + jsonobj.data.substring(1));
            //clicked on topic
            bot.answerCallbackQuery(callbackQuery.id)
                .then(() => functions.getJsonFromUrl(requrl, showThesisInfo, msg.chat.id));
            break;
        case 'c':
            requrl = String(apiUrl + "/topics?category=" + jsonobj.data.substring(1));
            //clicked on topic
            bot.answerCallbackQuery(callbackQuery.id)
                .then(() => functions.getJsonFromUrl(requrl, showProfessor_CategoryThesis, msg.chat.id));
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
            functions.getsonFromUrl(requrl, parseProfessors, msg.chat.id);

            break;
        case "Un argomento":
            var requrl = apiUrl + "/topics";
            functions.getJsonFromUrl(requrl, showAllThesis, msg.chat.id);
            break;



        case "L'ambito di studi che preferisci":
            var requrl = apiUrl + "/categories";
            functions.getsonFromUrl(requrl, parseCategories, msg.chat.id);
            break;
        default:
            bot.sendMessage(msg.chat.id, "Non ho capito");
            break;
    }
});
