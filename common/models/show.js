var toArray = require('../services/toArray'),
    appender = require('../services/hypermediaAppender');

module.exports = function(Show) {
    'use strict';

    // Add hypermedia URLs to responses
    Show.afterRemote('**', function (ctx, show, next) {
        var isShow = (-1 === ctx.methodString.indexOf('prototype.__'));

        toArray(ctx.result).forEach(function (result) {
            if (isShow) {
                appender.appendToShow(result, next);
            } else {
                appender.appendToEpisode(result, next);
            }
        });
    });
};
