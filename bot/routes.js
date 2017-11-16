var express = require('express');
var request = require('request');
var fetch = require('node-fetch');
const fetchJson = require('node-fetch-json');

const TOKEN = process.env.tokenTelegramBot;
const url = process.env.telegramWebHookUrl;
const backButton = "Torna alle opzioni principali"
const apiUrl = process.env.apiUrl;
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');
const profEmoji = "\u{1f468}\u{200d}\u{1f3eb}"

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

function getJsonFromUrl(url, cb, chatId) {
    request({
        url: url,
        json: true
    }, function(err, res, json) {
        if (err) {
            throw err;
        } else {
            cb(json, chatId);
        }
    });
}

function parseJSON(url){
  return fetchJSON(url, {method : 'GET'}).then(r => {return r.json})
}

function parseProfessors(json, chatId) {
    console.log(json);
    var jsonobj = JSON.parse(JSON.stringify(json));

    var professorName_id = [];
    for (var i = 0; i < jsonobj.length; i++) {
      //Pair for callback_data in inline button
        professorName_id.push([profEmoji + " " + jsonobj[i].first_name + " " + jsonobj[i].last_name, jsonobj[i].id]);
    }

    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: professorName_id.map((x) => ([{
                text: x[0],
                callback_data: String("p"+x[1]),
            }])),
        }),
    };

    bot.sendMessage(chatId, "Seleziona il professore che più ti interessa e ti forniremo una lista delle tesi disponibili", options);
}



// Inline button callback queries
bot.on("callback_query", (callbackQuery) => {
  //JSON parsing
  const msg = callbackQuery.message;
  var jsonobj = JSON.parse(JSON.stringify(callbackQuery));

  console.log("ID numero"+jsonobj.data); // msg.data refers to the callback_data
  switch (jsonobj.data.charAt(0)) {
    case 'p':
      //professore
      bot.answerCallbackQuery(callbackQuery.id)
        .then(() => bot.sendMessage(msg.chat.id, "You clicked!"));
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
        case "Un argomento":
            bot.sendMessage(msg.chat.id, "Seleziona uno dei principali argomenti e ti forniremo una lista delle testi disponibili", {
                "reply_markup": {
                    "keyboard": [
                        ["Tesi1"],
                        ["Tesi2"],
                        ["Tesi3"],
                        ["Torna alle opzioni principali"]
                    ]
                }
            });
            break;

        case "Il professore che preferisci":
            var requrl = apiUrl + '/professors';
            console.log(parseJSON("http://echo.jsontest.com/key/value/one/two"));
            //getJsonFromUrl(requrl, parseProfessors, msg.chat.id);
            //fetchProfessors(requrl, msg.chat.id);

            break;

        case "L'ambito di studi che preferisci":
            bot.sendMessage(msg.chat.id, "Seleziona l'ambito di studi che preferisci e ti forniremo una lista di testi disponibili", {
                "reply_markup": {
                    "keyboard": [
                        ["Tesi1"],
                        ["Tesi2"],
                        ["Tesi3"],
                        ["Torna alle opzioni principali"]
                    ]
                }
            });
            break;
        default:
            bot.sendMessage(msg.chat.id, "Non ho capito "+msg.text.toString());
            if (msg.text.toString().length >= 5) {
                switch (msg.text.toString().substring(0, 5)) {
                    case profEmoji:
                        bot.sendMessage(msg.chat.id, "Professore");
                        break;
                    default:
                        bot.sendMessage(msg.chat.id, "Non ho capito");
                        break;
                }
            } else {
                bot.sendMessage(msg.chat.id, "Non ho capito");
            }

            break;
    }
});
