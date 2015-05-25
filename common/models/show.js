var toArray = require('../services/toArray'),
    urlAppender = require('../services/urlAppender');

module.exports = function(Show) {
    'use strict';

    // Add hypermedia URLs to responses
    Show.afterRemote('**', function (ctx, show, next) {
        var isShow = (-1 === ctx.methodString.indexOf('prototype.__'));

        toArray(ctx.result).forEach(function (result) {
            if (isShow) {
                urlAppender.appendEpisodesUrlToShow(result);
            } else {
                urlAppender.appendShowUrlToEpisode(result);
            }
        });

        next();
    });
};
