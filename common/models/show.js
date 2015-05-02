var baseUrl = require('../../server/baseUrl'),
    hypermediaUrl = require('../services/hypermediaUrl');

module.exports = function(Show) {
    'use strict';

    /**
     * @param {Model}  model
     * @param {String} baseUrl
     */
    var addEpisodesUrl = function (model, baseUrl) {
        hypermediaUrl.append(model, baseUrl, 'Show', 'Episode');
    };

    // Add Episode list URL to all responses
    Show.afterRemote('**', function (ctx, show, next) {
        if (ctx.result) {
            var base = baseUrl(ctx.req);

            if (Array.isArray(ctx.result)) {
                ctx.result.forEach(function (result) {
                    addEpisodesUrl(result, base);
                });
            } else {
                addEpisodesUrl(ctx.result, base);
            }
        }

        next();
    });
};
