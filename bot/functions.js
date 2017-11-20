/*
 * Main module that contains the base function, made to clean the bot logic
 * implementation in routers.js
 */
/*
 * Required module for the Telegram bot
 */
var request = require('request');

/*
 * Const string
 */
const profEmoji = "\u{1f468}\u{200d}\u{1f3eb}";

exports.getJsonFromUrl = function(url, cb, chatId, bot) {
    request({
        url: url,
        json: true
    }, function(err, res, json) {
        if (err) {
            console.log("Json request error " + err);
            throw err;
        } else {
            //must check json
            var jsonobj = JSON.parse(JSON.stringify(json));
            if (jsonobj.hasOwnProperty('error')) {
                console.log("Json has error property");
                throw "Wrong url";
            } else
                cb(chatId, jsonobj, bot);
        }
    });
};


exports.showProfessors = function(chatId, jsonobj, bot) {
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
};

exports.showAllThesis = function(chatId, jsonobj, bot) {
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
};

exports.showProfessor_CategoryThesis = function(chatId, jsonobj, bot) {

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
};

exports.showCategories = function(chatId, jsonobj, bot) {

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
};



exports.showThesisInfo = function(chatId, jsonobj, bot) {

    var thesis = "Titolo:\t" + jsonobj.title +
        "\nAnteprima:\t" + jsonobj.short_abstract +
        "\nDescrizione:\t" + jsonobj.description +
        "\nUrl:\t" + jsonobj.resource;

    bot.sendMessage(chatId, thesis);
};
