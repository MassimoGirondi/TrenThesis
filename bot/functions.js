/*
 * Main module that contains the base function, made to clean the bot logic
 * implementation in routers.js
 */
/*
 * Required module for the Telegram bot
 */
var request = require('request');
var constants = require('./constants.js');

// This should work both there and elsewhere.
function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

exports.getJsonFromUrl = function(url, cb, chatId, bot) {
    request({
        url: url,
        json: true
    }, function(err, res, json) {
        if (err) {
            console.log("Json request error " + err);
            throw err;
        } else {
            var jsonobj = JSON.parse(JSON.stringify(json));
            //must check json
            if (isEmptyObject(jsonobj)){
                cb(chatId, jsonobj, bot);
            }
            else {
              console.log("Not a valid Json object");
            }

        }
    });
};


exports.showProfessors = function(chatId, jsonobj, bot) {
    var professorName_id = [];
    for (var i = 0; i < jsonobj.length; i++) {
        //Pair for callback_data in inline button
        //Check also if jsonobj has the right properties
        if (jsonobj[i].hasOwnProperty('first_name') && jsonobj[i].hasOwnProperty('last_name') && jsonobj[i].hasOwnProperty('id'))
            professorName_id.push([constants.PROFEMOJI + " " + jsonobj[i].first_name + " " + jsonobj[i].last_name, jsonobj[i].id]);
    }

    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: professorName_id.map((x) => ([{
                text: x[0],
                callback_data: String("p" + x[1]),
            }])),
        }),
    };

    bot.sendMessage(chatId, jsonobj.length > 0 ? constants.SELECTPROFESSOR : constants.NOPROFESSOR, options);
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

    bot.sendMessage(chatId, jsonobj.length > 0 ? constants.SELECTTHESIS : constants.NOTHESIS, options);
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

    bot.sendMessage(chatId, jsonobj.length > 0 ? constants.SELECTTHESIS : constants.NOTHESIS, options);
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

    bot.sendMessage(chatId, jsonobj.length > 0 ? constants.SELECTCATEGORY : constants.NOCATEGORY, options);
};



exports.showThesisInfo = function(chatId, jsonobj, bot) {

    var thesis = constants.TITLEEMOJI+constants.TITLE + jsonobj.title +
        "\n"+ constants.SHORTABSTRACTEMOJI +constants.SHORTABSTRACT + jsonobj.short_abstract +
        "\n"+ constants.DESCRIPTIONEMOJI + constants.DESCRIPTION + jsonobj.description +
        "\n"+ constants.RESOURCEEMOJI +constants.RESOURCE + "<a href=\""+jsonobj.resource+"\" >"+constants.CLICKHERE+"</a>";

    bot.sendMessage(chatId, thesis, {parse_mode : "HTML"});
};
