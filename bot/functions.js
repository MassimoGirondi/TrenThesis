/*
* Main module that contains the base function, made to clean the bot logic
* implementation in routers.js
*/

/*
* Required module for the Telegram bot
*/
var request = require('request');

exports.getJsonFromUrl = function(url, cb, chatId) {
    console.log("Called url "+url);
    request({
        url: url,
        json: true
    }, function(err, res, json) {
        if (err) {
            console.log("Json request error "+err);
            throw err;
        } else {
            //must check json
            var jsonobj = JSON.parse(JSON.stringify(json));
            if (jsonobj.hasOwnProperty('error')){
                console.log("Json has error property");
                throw "Wrong url";
              }
            else
                cb(chatId, jsonobj);
        }
    });
};
