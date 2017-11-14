var express = require('express');
var request = require('request');

const TOKEN = process.env.tokenTelegramBot;
const url = process.env.telegramWebHookUrl;
const apiUrl = process.env.apiUrl;
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');

var router = express.Router();

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN);
// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`);

function getJsonFromUrl(url) {
  var jsonRet = "";
  request({url: url, json: true}, function(err, res, json) {
    if (err) {
      throw err;
    }
    //Return the json
    jsonRet = json;
    console.log("jsonRet: "+ jsonRet);
  });
  return jsonRet;
}

function parseProfessors(json){
  console.log(json);
  var jsonobj = JSON.parse(JSON.json);
    //var tablename = arr[i].tablename;
    console.log(jsonobj[0]["first_name"].toString());
}

router
  .post(`/bot${TOKEN}`, function(req, res) {
    bot.processUpdate(req.body);
    res.status(200).send();
  });

module.exports = router;

bot.on('message', msg => {
    switch(msg.text.toString()){
        case "/start":
        case "Torna alle opzioni principali":
            bot.sendMessage(msg.chat.id, "Seleziona una delle opzioni dalla tastiera in basso", {
            "reply_markup": {
                "keyboard": [["Un argomento"], ["Il professore che preferisci"],   ["L'ambito di studi che preferisci"]]
                }
            });
        break;
        case "Un argomento":
            bot.sendMessage(msg.chat.id, "Seleziona uno dei principali argomenti e ti forniremo una lista delle testi disponibili", {
            "reply_markup": {
                "keyboard": [["Tesi1"], ["Tesi2"],   ["Tesi3"], ["Torna alle opzioni principali"]]
                }
            });
        break;

        case "Il professore che preferisci":
            var requrl = apiUrl+'/professors';
            console.log(getJsonFromUrl(requrl));
            bot.sendMessage(msg.chat.id, "Seleziona il professore che più ti interessa e ti forniremo una lista delle tesi disponibili", {
            "reply_markup": {
                "keyboard": [["Prof1"], ["Prof2"], ["Prof3"], ["Torna alle opzioni principali"]]
                }
            });
        break;

        case "L'ambito di studi che preferisci":
            bot.sendMessage(msg.chat.id, "Seleziona l'ambito di studi che preferisci e ti forniremo una lista di testi disponibili", {
            "reply_markup": {
                "keyboard": [["Tesi1"], ["Tesi2"],   ["Tesi3"], ["Torna alle opzioni principali"]]
                }
            });
        break;
        default:
            bot.sendMessage(msg.chat.id, "Non ho capito");
        break;
                                            }
});
