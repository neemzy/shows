var toArray = require('../services/toArray'),
    appender = require('../services/hypermediaAppender');

module.exports = function(Episode) {
    'use strict';

    // Season number cannot be 0
    Episode.validate('season', function (err) {
        if (1 > this.season) {
            err();
        }
    });

    // Episode number cannot be 0
    Episode.validate('number', function (err) {
        if (1 > this.number) {
            err();
        }
    });

    // Episode must be linked to a valid Show
    Episode.validateAsync('showId', function (err, done) {
        this.show(function (error, show) {
            if (error || !show) {
                err();
            }

            done();
        });
    });

    // An Episode for this Show, number and season number must not already exist
    Episode.validatesUniquenessOf('number', { scopedTo: ['season', 'showId'] });

    // Add Show URL to all responses
    Episode.afterRemote('**', function (ctx, show, next) {
        toArray(ctx.result).forEach(function (result) {
            appender.appendToEpisode(result, next);
        });
    });
};
